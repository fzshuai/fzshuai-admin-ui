<template>
  <div class="login-container">
    <div class="login-card">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <div class="login-title">
          <img src="../assets/logo/logo.png" class="login-title-logo" />
          Fzshuai-Weblog 后台管理系统
        </div>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            auto-complete="off"
            placeholder="账号"
            class="login-form-input"
          >
            <svg-icon
              slot="prefix"
              icon-class="user"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter.native="handleLogin"
            class="login-form-input"
          >
            <svg-icon
              slot="prefix"
              icon-class="password"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="code" v-if="captchaEnabled">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 65%;"
            @keyup.enter.native="handleLogin"
            class="login-form-input"
          >
            <svg-icon
              slot="prefix"
              icon-class="validCode"
              class="el-input__icon input-icon"
            />
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img"/>
          </div>
        </el-form-item>
        <el-checkbox
          v-model="loginForm.rememberMe"
          style="margin: 0px 0px 25px 0px;"
        >记住密码</el-checkbox
        >
        <el-form-item style="width: 100%;">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width:100%;"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
          <div style="float: right;" v-if="register">
            <router-link class="link-type" :to="'/register'">
              立即注册
            </router-link>
          </div>
        </el-form-item>
        <div style="display: flex;justify-content: flex-end;flex-direction: row;">
          <el-button circle>
            <svg-icon icon-class="qq" @click="doSocialLogin('QQ')" />
          </el-button>
          <el-button circle>
            <svg-icon icon-class="wechat" @click="doSocialLogin('Wechat')" />
          </el-button>
          <el-button circle>
            <svg-icon icon-class="gitee" @click="doSocialLogin('gitee')" />
          </el-button>
          <el-button circle>
            <svg-icon icon-class="github" @click="doSocialLogin('github')" />
          </el-button>
        </div>
      </el-form>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2023 Fzshuai-Blog All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { authBinding } from "@/api/system/social";

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.data.captchaEnabled === undefined ? true : res.data.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.data.img;
          this.loginForm.uuid = res.data.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
          }).catch(() => {
            this.loading = false;
            if (this.captchaEnabled) {
              this.getCode();
            }
          });
        }
      });
    },
    doSocialLogin(source) {
      authBinding(source).then(response => {
        if (response.code === 200) {
          window.location.href = response.msg;
        } else {
          this.$message.error(response.msg);
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login-container {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: url("../assets/images/login-background.jpg") center center / cover
  no-repeat;
}
.login-card {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  background: #ffffff;
  padding: 120px 30px 180px;
  width: 400px;
}

.login-title {
  font-size: 20px;
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}
.login-title-logo {
  width: 35px;
  height: 35px;
  vertical-align: middle;
  margin-right: 5px;
}
.login-form {
  margin-top: 1rem;
  .login-form-input {
    font-size: 16px;
  }
  .input-icon {
    height: 14px;
    width: 14px;
    margin-left: 5px;
  }
}
.input-icon {
  height: 14px;
  width: 14px;
  margin-left: 5px;
}
.login-code {
  width: 30%;
  height: 35px;
  float: right;
  img {
    height: 35px;
    margin-left: 5px;
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 35px;
  line-height: 35px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 14px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
