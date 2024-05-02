<template>
  <el-card class="main-card">
    <div class="title" style="  font-size: 16px;font-weight: bold;">{{ this.$route.meta.title }}</div>

    <mavon-editor
      ref="md"
      @imgAdd="handleEditorImgAdd"
      @imgDel="handleEditorImgDel"
      v-model="form.aboutContent"
      style="height:calc(100vh - 250px);margin-top:2.25rem"
    />

    <el-button
      type="danger"
      size="medium"
      class="edit-btn"
      @click="updateAbout"
    >
      修改
    </el-button>
  </el-card>
</template>

<script>
import {getAbout, updateAbout, uploadOssImage} from "@/api/blog/about";

export default {
  name: "About",
  created() {
    this.getAbout();
  },
  data: function () {
    return {
      form: {
        aboutContent: ""
      },
      imgFile: [],
    };
  },
  methods: {
    getAbout() {
      getAbout().then(response => {
        this.aboutContent = response.msg;
      })

    },
    handleEditorImgAdd(pos, file) {
      let formData = new FormData()
      formData.append('file', file)
      this.imgFile[pos] = file
      uploadOssImage(formData).then(response => {
        if (response.code == 200) {
          this.$modal.msgSuccess("上传成功");
          this.$refs.md.$img2Url(pos, response.data.url);
        } else {
          this.$modal.msgError(response.data.msg);
        }
      })
    },
    handleEditorImgDel(pos) {
      delete this.imgFile[pos]
    },
    updateAbout() {
      updateAbout(this.form).then((response) => {
        if (response.code == 200) {
          this.$modal.msgSuccess(response.msg);
        } else {
          this.$modal.msgSuccess(response.msg);
        }
      });
    }
  }
};
</script>

<style scoped>
.edit-btn {
  float: right;
  margin: 1rem 0;
}

.main-card {
  min-height: calc(100vh - 126px);
}
</style>
