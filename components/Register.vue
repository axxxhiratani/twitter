<template>
  <div class="register">
    <p class="register--title">新規登録</p>

    <validation-observer ref="obs" v-slot="ObserverProps">

        <validation-provider v-slot="{ errors }" rules="required|max:20">
          <input v-model="username" type="text" name="名前" placeholder="ユーザーネーム" class="input--text"/>
          <div class="error">{{ errors[0] }}</div>
        </validation-provider>


        <validation-provider v-slot="{ errors }" rules="required|email">
          <input v-model="email" type="email" name="メールアドレス" placeholder="メールアドレス" class="input--text"/>
          <div class="error">{{ errors[0] }}</div>
        </validation-provider>


        <validation-provider v-slot="{ errors }" vid="passwordConfirm" rules="required|min:6">
          <input
            v-model="password"
            type="password"
            name="パスワード"
            placeholder="パスワード"
            class="input--text"
          />
          <div class="error">{{ errors[0] }}</div>
        </validation-provider>


        <button
          type="button" @click="register"
          :disabled="ObserverProps.invalid || !ObserverProps.validated"
          class="input--button"
        >
          新規登録
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
      username:null,
      email: null,
      password: null,
    }
  },
  methods: {
    register() {
      if (!this.username || !this.email || !this.password) {
        alert('メールアドレスまたはパスワードが入力されていません。')
        return
      }
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((data) => {
          data.user.sendEmailVerification().then(() => {
            console.log(data.user);
            console.log(data.user.uid);
            this.storeUser(data.user.uid);
            alert("新規登録が完了しました");
            this.$router.replace('/')
          })
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/invalid-email':
              alert('メールアドレスの形式が違います。')
              break
            case 'auth/email-already-in-use':
              alert('このメールアドレスはすでに使われています。')
              break
            case 'auth/weak-password':
              alert('パスワードは6文字以上で入力してください。')
              break
            default:
              alert('エラーが起きました。しばらくしてから再度お試しください。')
              break
          }
        });

    },
    async storeUser(uid){
      const sendData = {
        "uuid":uid,
        "name":this.username,
      };
      await this.$axios.post("http://127.0.0.1:8000/api/v1/user",sendData);
    },
  },
}
</script>

<style scoped>
.register{
  margin: 50px auto;
  width: 30%;
  background: #fff;
  border: #000 solid 2px;
  border-radius: 5px;
  text-align: center;
}
.register--title{
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
  cursor: pointer;
}
.error{
  color: red;
}

</style>
