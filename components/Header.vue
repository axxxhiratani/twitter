<template>
  <div class="header">
    <div class="header--title">
      <img src="@/assets/img/logo.png">
    </div>
    <ul class="header--nav">
      <li class="header--nav--list">
        <NuxtLink to="/register" class="header--nav--list--link">新規登録</NuxtLink>
      </li>
      <li class="header--nav--list">
        <NuxtLink to="/" class="header--nav--list--link">ログイン</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
  data() {
    return {
      user:null,
      message: 'ログインができておりません',
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.message = 'ログイン済みです';
        this.user = user.uid;
      }
    })
  },
}
</script>
<style scoped>
.header{
  display: flex;
  justify-content: space-between;
  background: #000;
  widows: 100%;
}
.header--title{
  padding: 10px 10px;
  color: aliceblue;
  width: 20%;
}
.header--title > img{
  width: 100%;
}
.header--nav{
  display: flex;
  list-style: none;
}
.header--nav--list{
  color: #fff;
  text-decoration: none;
  padding: 10px 10px;
}
.header--nav--list--link{
  color: #fff;
  text-decoration: none;
}
</style>
