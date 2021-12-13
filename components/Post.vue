<template>
  <div class="main">
    <div class="main--title">
      <p>ホーム</p>
    </div>

    <div class="main--post" v-for="post in posts" :key="post.id">
      <div class="main--post--title">
        {{post.user_id[0].name}}
        <i class="icon">
          <img src="@/assets/img/heart.png" @click="changeFavorite(post.id)">
        </i>
        <!-- <span v-bind:class="decorationFavorite(post.id)"> -->
          {{countFavorite(post.id)}}
        <!-- </span> -->
        <i class="icon">
          <img src="@/assets/img/cross.png" @click="deletePost(post.id)">
        </i>
        <i class="icon">
          <img src="@/assets/img/detail.png" @click="showComment(post.id)">
        </i>

      </div>
      <div class="main--post--content">
        {{post.content}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return{
      posts:null,
      favorites:null,
    }
  },
  props:[
    "user"
  ],
  methods:{
    async getPost(){
      const resData = await this.$axios.get("http://127.0.0.1:8000/api/v1/post");
      this.posts = resData.data.posts;
    },
    async deletePost(id){
      await this.$axios.delete("http://127.0.0.1:8000/api/v1/post/" + id);
      this.getPost();
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
      setTimeout(()=>{
        this.getPost();
      },500);
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
    async showComment(id){
      const resData = await this.$axios.get("http://127.0.0.1:8000/api/v1/post/" + id);
      this.$router.push({
        path:"/comment",
        query:{
          post:resData.data.post[0],
          favorites:this.getFavoriteByPostId(resData.data.post[0].id),
        }
      });
    },
  },
  created(){
    this.getFavorite();
    setTimeout(()=>{
      this.getPost();
    },500);
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
}

</style>
