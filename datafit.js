var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore")
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyB54vr57otWroNRa6W9rb4GJG0swQ1AC3E",
    authDomain: "practice-1c8b0.firebaseapp.com",
    databaseURL: "https://practice-1c8b0.firebaseio.com",
    projectId: "practice-1c8b0",
    storageBucket: "practice-1c8b0.appspot.com",
    messagingSenderId: "486372085816",
    appId: "1:486372085816:web:9d225c2e272554924c96cd",
    measurementId: "G-9EQ8YV1KYQ"
};

// Initialize Firebase
var name
var delname
var usersinformations = new Map()

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
let doc = db.collection("name").get()
    .then((snapshot) => {
        //이름 데이터 가져오기.
        snapshot.forEach((doc) => {
            name = doc.data()['username']
            delname = doc.data()['deletename']
            console.log(1, name);
            console.log(2, delname);
        });
        console.log(name);

        //회원 기본 정보 가져오기.
        for (var i = 0; i < name.length; i++) {
            db.collection(`${name[i]}`).doc("userinformation").get()
                .then((userinfo) => {
                    usersinformations.set(userinfo.data()['name'], userinfo.data())
                    // console.log(usersinformations);
                })
        }


    })
    .catch((err) => {
        console.log('Error getting documents', err)
    })


//회원 운동 데이터 가져오기.
var uiname = 'kimhyungsuk'
var date = '2020.8.25'

ExerciseDataGet=db.collection(`${uiname}`).doc(`userinformation/exerciseinformation/${date}`).get()
.then((exerciseinformation)=>{
    console.log(exerciseinformation.data())
})
.catch((err) => {
    console.log('Error getting documents', err)
})

    