<template>
  <div class="main">
    <Menu v-bind:user="user" comment="false"></Menu>
    <Post v-bind:user="user"></Post>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
  data() {
    return{
      user:null,
      uid:null,
    }
  },
  methods:{
    getAuth(){
      firebase.auth().onAuthStateChanged((user) => {
        this.uid = user.uid;
      });
    },
    async getUser(){
      const sendData = {
        uuid:this.uid,
      };
      const resData = await this.$axios.get("http://127.0.0.1:8000/api/v1/investigate/userid",
        {
          params:sendData
        });
      this.user = resData.data.user[0];
    },
  },
  created(){
    this.getAuth();
    setTimeout(()=>{
      this.getUser();
    },500);
  }
}
</script>
<style scoped>
.main{
  background: #000;
  display: flex;
}
</style>
