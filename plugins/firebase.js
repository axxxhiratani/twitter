import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
      apiKey: "AIzaSyCGbauCt2wjplVHOH5vaJrvD4_kpMcFrgY",
      authDomain: "twitter-afb60.firebaseapp.com",
      projectId: "twitter-afb60",
      storageBucket: "twitter-afb60.appspot.com",
      messagingSenderId: "672833343232",
      appId: "1:672833343232:web:5349210f8b60380cb7ede5",
      measurementId: "${config.measurementId}"    }
  )
}

export default firebase
