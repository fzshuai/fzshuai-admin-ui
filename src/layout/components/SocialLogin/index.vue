<template>
  <div v-if="loading" class="social-callback">Loading...</div>
</template>

<script>
import { setToken } from "@/utils/auth";
import { socialLogin } from "@/api/system/social";

export default {
  data() {
    return {
      loading: true,
      code: this.$route.query.code,
      state: this.$route.query.state,
      source: this.$route.query.source,
    };
  },
  mounted() {

    socialLogin(this.source, this.code, this.state)
      .then((res) => {
        if (res.code !== 200) {
          this.$message.error(res.msg);
          this.$router.go(-2);
          return;
        }
        this.loading = false;
        setToken(res.msg);
        this.$message.success("登录成功");
        this.$router.go(-2);
      })
      .catch(() => {
        this.loading = false;
      });
  },
};
</script>
