var firebase = require("firebase/app");
const express = require('express')
var path = require('path');
var bodyParser = require('body-parser')
const { connected } = require("process");
const { toNamespacedPath } = require("path");
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
// var calendar = require("calenday/calendar_2.html")

//달력 쪽 코드 이해하고 데이터 끌어와 표현하는 것까지 하기.

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


//회원 목록을 보여줄 홈페이지.
var userlist = `<table>`
app.get('/', (req, res) => {
    let doc = db.collection("name").get()
        .then((snapshot) => {
            //이름 데이터 가져오기.
            snapshot.forEach((doc) => {
                name = doc.data()['username']
                delname = doc.data()['deletename']
                console.log(1, name);
                console.log(2, delname);
            })
            console.log(name);
            for (i = 0; i < name.length; i++) {
                userlist += `<tr>
                <th><a href="/userinformation/${name[i]}">${name[i]}</th>
                </tr>`
            }
            userlist += `</table>`
            var html = `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <a href="/create">create</a>
    ${userlist}
</body>
</html>`
            res.send(html);
        })
        .catch((err) => {
            console.log('Error getting documents', err)
        })

})

//회원 정보 가져오기.
app.get('/userinformation/:username', (req, res) => {
    var filteredId = path.parse(req.params.username).base;
    console.log(filteredId)
    db.collection(`${filteredId}`).doc("userinformation").get()
        .then((it) => {
            var userdata = it.data()
            var fat = userdata['fat']
            var fatlist = ``
            var muscle = userdata['muscle']
            var musclelist = ``
            for (i = 0; i < muscle.length; i++) {
                fatlist += `<th>${Object.keys(fat[i])}</th>
                        <th>${Object.values(fat[i])}</th>`
                musclelist += `<th>${Object.keys(muscle[i])}</th>
                        <th>${Object.values(muscle[i])}</th>`
            }
            console.log(fatlist)
            var userinfotable = `
        <table>
            <tr>
                <th>${userdata['name']}</th>
                <th>${userdata['age']}</th>
                <th>${userdata['sex']}</th>
                <th>${userdata['weight']}</th>
                <th>${userdata['height']}</th>
            </tr>
            <tr>
                <th>muscle</th>
                ${musclelist}
            </tr>
            <tr>
                <th>fat</th>
                ${fatlist}
            </tr>
        </table>
        `
            var html = `
        <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<body>
<a href="/userinformation/userexercisedata/${filteredId}">${filteredId}</a><br>
${userinfotable}
</body>
</html>`
            res.send(html);
        });
})


//회원 운동 데이터 가져오기.
app.get('/userinformation/userexercisedata/:username', (req, res) => {
    var filteredId = path.parse(req.params.username).base;
    console.log(filteredId)
    var date = []
    var datehtml = `<ul>`
    db.collection(`${filteredId}/userinformation/exerciseinformation`).get()
        .then((value, err) => {
            value.forEach((doc) => {
                date.push(doc.data()['thisdate'][0])
            });
            console.log(date);
            for (i = 0; i < date.length; i++) {
                datehtml += `<li><a href='/userinformation/userexercisedata/${filteredId}/${date[i]}'>${date[i]}</li>`
            }
            datehtml += `</ul>`
            var html = `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    ${datehtml}
</body>
</html>`
            res.send(html)
        });
});

app.get('/userinformation/userexercisedata/:username/:date', (req, res) => {
    var filteredId = path.parse(req.params.username).base;
    var date = path.parse(req.params.date).base;
    var exerciseinfo = `<table>`
    db.collection(`${filteredId}`).doc(`userinformation/exerciseinformation/${date}`).get()
        .then((it) => {
            var key = Object.keys(it.data())
            var value = Object.values(it.data())
            for (i = 0; i < key.length; i++) {
                if (value[i].length == 0) {

                } else {
                    exerciseinfo += `
                <tr>
                    <th>${key[i]}</th>
                    <th>${value[i]}</th>
                </tr>`
                }

            }
            exerciseinfo += `</table>`
            var html = `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    ${exerciseinfo}
</body>
</html>`
            res.send(html)
        });
});

app.get('/create', (req, res) => {
    var html = `
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<body>
    <form action='/create_process' method = 'post'>
        name : <input type='text' name='name'><br>
        age : <input type='text' name='age'><br>
        sex : <input type='text' name='sex'><br>
        height : <input type='text' name='height'><br>
        weight : <input type='text' name='weight'><br>
        muscle : <input type='text' name='muscle'><br>
        fat : <input type='text' name='fat'><br>
        submit : <input type="submit">
    </form>
</body>
</html>`
    res.send(html)
});

app.post('/create_process', (req, res) => {
    var post = req.body;
    var dateFormat = require('dateformat');
    var now = new Date();
    var today = dateFormat(now, "yyyy.m.dd")
    var muscledata = {}
    var fatdata = {}
    muscledata[today]=post.muscle
    fatdata[today]=post.fat

    console.log(today)
    var data = {
        'name': post.name,
        'age': post.age,
        'sex': post.sex,
        'height': post.height,
        'weight': post.weight,
        'muscle': muscledata,
        'fat': fatdata
    }
    db.collection(`${post.name}`).doc("userinformation").set(
        data
    ).then(() => {
        db.collection('name').doc('usernames').get().then((it, err) => {
            console.log(it.data()['username']);
            var usernames = it.data()['username']
            usernames.push(post.name);
            console.log(usernames);
            db.collection('name').doc('usernames').update(
                'username', usernames
            ).then(() => {
                res.redirect('/')
            });
        });
    });

});

app.listen(300, () => {
    console.log("welecome");
});