<template>

  <div class="header">
    <div class="header--title">
      <img src="@/assets/img/logo.png">
    </div>
    <ul class="header--nav">
      <li class="header--nav--list">
        <i class="home">
          <img src="@/assets/img/home.png">
        </i>

        <NuxtLink class="header--nav--list--link" to="/home">ホーム</NuxtLink>

      </li>
      <li class="header--nav--list">
        <i class="logout">
          <img src="@/assets/img/logout.png">
        </i>
        <a @click="logout" class="header--nav--list--link">ログアウト</a>
      </li>
      <li class="header--nav--list">
        シェアする
      </li>
    </ul>
    <div class="post">
      <validation-observer ref="obs" v-slot="ObserverProps">
        <validation-provider v-slot="ProviderProps" rules="required|max:120">
      <textarea v-model="post" class="input--text" id="input--text--post" cols="30" rows="10" name="投稿"></textarea>
          <div class="error">{{ ProviderProps.errors[0] }}</div>
        </validation-provider>

        <button
          type="button" @click="storePost" class="input--button"
          :disabled="ObserverProps.invalid || !ObserverProps.validated"
        >
          シェアする
        </button>
      </validation-observer>
    </div>




  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
  data() {
    return {
      message: '',
      post:"",
    }
  },
  props:[
    "user",
    "comment"
  ],
  methods:{
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          alert('ログアウトが完了しました')
          this.$router.replace('/')
        })
    },
    async storePost(){
      const resData = {
        user_id:this.user.id,
        content:this.post,
      };
      await this.$axios.post("http://127.0.0.1:8000/api/v1/post",resData);
      var formElement = document.getElementById('input--text--post');
      console.log(formElement);
      formElement.value = '';

      if(this.comment == "false"){
        location.reload();
      }else{
        this.$router.replace('/home')
      }
    },

  },
  created() {
  },
}
</script>
<style scoped>
.header{
  display: flex;
  flex-flow: column;
  background: #000;
  width: 30%;
  height: 100vh;
  display: inline-block;
}
.header--title{
  padding: 10px 10px;
  color: aliceblue;
  width: 40%;
}
.header--title > img{
  width: 100%;
}
.header--nav{
  display: flex;
  flex-flow: column;
  list-style: none;
}
.header--nav--list{
  color: #fff;
  text-decoration: none;
  padding: 5px 0;
  cursor: pointer;
}
.header--nav--list--link{
  text-decoration: none;
}
.home{
  display: inline-block;
  width: 30px;
  height: 30px;
}
.home > img{
  width: 50%;
}
.logout{
  display: inline-block;
  width: 30px;
  height: 30px;
}
.logout > img{
  width: 50%;
}
.header--nav--list--link{
  color: #fff;
  text-decoration: none;
}
.post{
  width: 100%;
  text-align: center;
}
.input--text{
  border: #fff solid 1px;
  border-radius: 5px;
  background: #000;
  color: #fff;
}
.input--button{
  background: #8a2be2;
  color: #fff;
  padding: 5px 10px;
  border: #000 1px solid;
  border-radius: 10px;
  margin-top: 5px;
  margin-left: 45%;
  cursor: pointer;
}
.error{
  color:red;
}
</style>
