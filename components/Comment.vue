<template>
  <div class="main">
    <div class="main--title">
      <p>コメント</p>
    </div>

    <div class="main--post">
      <div class="main--post--title">
        {{post.user_id}}
        <i class="icon">
          <img src="@/assets/img/heart.png" @click="changeFavorite(post.id)">
        </i>
        <!-- <span v-bind:class="decorationFavorite(post.id)"> -->
          {{countFavorite(post.id)}}
        <!-- </span> -->
        <i class="icon">
          <img src="@/assets/img/cross.png" @click="deletePost(post.id)">
        </i>

      </div>
      <div class="main--post--content">
        {{post.content}}
      </div>
    </div>

    <div class="main--comment--title">
      <p>コメント</p>
    </div>

    <div class="main--post" v-for="comment in comments" :key="comment.id">
      <div class="main--post--title">
        {{comment.user_id}}
      </div>
      <div class="main--post--content">
        {{comment.content}}
      </div>
    </div>

    <div class="main--create--comment">

      <validation-observer ref="obs" v-slot="ObserverProps">
        <validation-provider v-slot="ProviderProps" rules="required|max:120">
          <input type="text" class="input--text" id="input--text" v-model="post_value" name="コメント">
          <div class="error">{{ ProviderProps.errors[0] }}</div>
        </validation-provider>

        <button
          type="button" @click="postComment" class="input--button"
          :disabled="ObserverProps.invalid || !ObserverProps.validated"
        >
          コメント
        </button>

      </validation-observer>

    </div>
  </div>
</template>
<script>
export default {
  data() {
    return{
      favorites:null,
      comments:[],
      post_value:null,
    }
  },
  props:[
    "user",
    "post",
    "favorites"
  ],
  methods:{
    async deletePost(id){
      await this.$axios.delete("http://127.0.0.1:8000/api/v1/post/" + id);
      this.$router.push('/home');
    },
    async getComment(){

      const resData = await this.$axios.get("http://127.0.0.1:8000/api/v1/post/" + this.post.id);
      this.comments = resData.data.post[0].comments;
      console.log("getComment");
      console.log(this.comments);
    },
    async postComment(){
      const sendData = {
        user_id:this.user.id,
        post_id:this.post.id,
        content:this.post_value,
      };
      await this.$axios.post("http://127.0.0.1:8000/api/v1/comment",sendData);
      var formElement = document.getElementById('input--text');
      console.log(formElement);
      formElement.value = '';
      this.getComment();
    },
    async getFavorite(){
      const resData = await this.$axios.get("http://127.0.0.1:8000/api/v1/favorite");
      this.favorites = resData.data.favorites;
    },


    countFavorite(id){
      let count = 0;
      this.favorites.forEach(value => {
        let target = value.post_id;
        if(target == id){
          count++;
        }
      });
      return count;
    },

    //イイネを増やす/減らす
    async changeFavorite(id){
      if(this.checkFavorite(id)){
        const sendData = {
          user_id:this.user.id,
          post_id:id,
        };
        await this.$axios.post("http://127.0.0.1:8000/api/v1/favorite",sendData);
        alert("お気に入りしました");
      }else{
        const favorite_id = this.getFavoriteId(id);
        await this.$axios.delete("http://127.0.0.1:8000/api/v1/favorite/" + favorite_id);
        alert("お気に入り解除しました");
      }
      this.getFavorite();
    },
    getFavoriteId(id){
      let favorite_id = "";
      this.favorites.forEach(value =>{
        let target_post = value.post_id;
        let target_user = value.user_id;
        if(target_post == id && target_user == this.user.id){
          favorite_id = value.id;
        }
      });
      return favorite_id;
    },
    checkFavorite(id){
      let flg = true;
      this.favorites.forEach(value =>{
        let target_post = value.post_id;
        let target_user = value.user_id;
        if(target_post == id && target_user == this.user.id){
          flg = false;
        }
      });
      return flg;
    },
    decorationFavorite(id){
      if(this.checkFavorite(id)){
        return "";
      }else{
        return "favo";
      }
    },
    getFavoriteByPostId(id){
      let list = [];
      this.favorites.forEach( value =>{
        let target_post = value.post_id;
        if( target_post == id){
          list.push(value);
        }
      });
      return list;
    },

  },
  created(){
    this.getComment();
    console.log("favoritelist");
    console.log(this.favorites);
  }
}
</script>

<style scoped>
.main{
  width: 100%;
  margin: 0 10px;
  color: #fff;
  display: flex;
  flex-flow: column;
}
.main--title{
  border: solid #fff 1px;
  width: 100%;
  height: 50px;
}
.main--comment--title{
  border: solid #fff 1px;
  width: 100%;
  height: 50px;
  text-align: center;
}
.main--post{
  width: 100%;
  height: auto;
  color: #fff;
  border: solid #fff 1px;
}
.main--post--title{
  padding: 10px;

}
.main--post--content{
  padding-left: 10px;
  padding-bottom: 5px;
}

.icon{
  display: inline-block;
  width: 30px;
  height: 20px;
  cursor: pointer;
}
.icon > img{
  width: 50%;
}

.favo{
  color: red;
}.favo--no{
  color: blue;
}
.main--create--comment{
  text-align: center;
  margin-top: 20px;
}
.input--text{
  width: 95%;
  height: 30px;
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
  margin-left: 80%;
  cursor: pointer;
}
.error {
  color: red;
}

</style>
