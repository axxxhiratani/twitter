<template>
  <div class="login">
    <p class="login--title">ログイン</p>
    <validation-observer ref="obs" v-slot="ObserverProps">

      <validation-provider v-slot="{ errors }" rules="required">
        <input v-model="email" type="text" name="メールアドレス" placeholder="メールアドレス" class="input--text"/>
        <div class="error">{{ errors[0] }}</div>
      </validation-provider>

      <validation-provider v-slot="{ errors }" rules="required">
        <input v-model="password" type="password" name="パスワード" placeholder="パスワード" class="input--text"/>
        <div class="error">{{ errors[0] }}</div>
      </validation-provider>

      <button
        type="button" @click="login"
        class="input--button"
        :disabled="ObserverProps.invalid || !ObserverProps.validated"
      >
        ログイン
      </button>
    </validation-observer>
  <!-- <NuxtLink to="/">戻る</NuxtLink> -->
  </div>
</template>


<script>
import firebase from '~/plugins/firebase'
export default {
  data() {
    return {
      email: null,
      password: null,
    }
  },
  methods: {
    login() {
      if (!this.email || !this.password) {
        alert('メールアドレスまたはパスワードが入力されていません。')
        return
      }
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          alert('ログインが完了しました')
          this.$router.push('/')
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/invalid-email':
              alert('メールアドレスの形式が違います。')
              break
            case 'auth/user-disabled':
              alert('ユーザーが無効になっています。')
              break
            case 'auth/user-not-found':
              alert('ユーザーが存在しません。')
              break
            case 'auth/wrong-password':
              alert('パスワードが間違っております。')
              break
            default:
              alert('エラーが起きました。しばらくしてから再度お試しください。')
              break
          }
        })
    },
  },
}
</script>

<style scoped>
.login{
  margin: 200px auto;
  width: 30%;
  background: #fff;
  border: #000 solid 2px;
  border-radius: 5px;
  text-align: center;
}
.login--title{
  font-weight: bold;
}
.input--text{
  width: 75%;
  height: 30px;
  margin-bottom: 10px;
  border: #e6e6fa solid 2px;
}
.input--button{
  border-radius: 10px;
  background: #8a2be2;
  color: #fff;
  margin-bottom: 20px;
  padding: 5px 15px;
}
</style>
