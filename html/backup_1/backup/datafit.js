var firebase = require("firebase/app");
const express = require('express')
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
const router = express.Router();

const { connected, send } = require("process");
const { toNamespacedPath } = require("path");
const { fstat } = require("fs");
const app = express()
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));

//9/3
//menu codepen으로 바꾸기.(button은 bootstarp꺼로)
//호스팅 방법 강의 듣고 적용해보기.
//저작권 적용하기.
//데이터 구조 짜기.

//9/4
//로그인 페이지 추가
//데이터 구조 바꾸기.
//데이터 구조 바꾼 것 기존 웹 코드에 적용하기.
//운동데이터 색변화 적용하기.
//회원 추가하기 만들기->운동추가하기 만들기

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
var userlist = `<div class="list">`
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
            for (i = 0; i < name.length; i++) {
                userlist += `<tr>
                <td><a href="/calendarinformation/${name[i]}">${name[i]}</a></td>
                </tr>`
            }
            userlist += `
                    <tr><a href="/create">회원추가</a></tr>
               </table>
            </tbody>
            `
            var html = `
            <html>
    <head>

	<link href='https://fonts.googleapis.com/css?family=Alegreya+Sans:700,500' rel='stylesheet' type='text/css'>
	<meta charset="utf-8">
	<meta name="viewport" content="initial-scale = 1.0,maximum-scale = 1.0" />
        <style>
        a {
            color:white;
          }
        .primaryContainer {
            height: auto;
            margin-left: auto;
            margin-right: auto;
            /*min-height: 100%;*/
            width: 100%;
            /*min-width: 0px;*/
        }
        
        #header {
            float: none;
            height: 3.125em;
            clear: none;
            width: 100%;
            background-color: rgb(21, 29, 37);
            min-width: 0px;
            position: static;
            top: 0px;
            left: 0px;
        }
        
        #table_container {
            float: none;
            clear: none;
            height: 100%;
            margin-left: auto;
            margin-right: auto;
            margin-top: 0px;
            width: 65.104167%;
            position: relative;
            top: 0px;
            left: 0px;
            z-index: 1;
            max-width: 1000px;
            /*background: none;
            opacity: 1;
            min-width: 0px;*/
        }
        
        table{
            display: table;
            border-spacing: 0 0.8em;
            border:none;
            width: 90%;
            margin-right: auto;
            margin-left: auto;
            /*margin-top: -0.8em;*/
            font-family: 'Alegreya Sans', sans-serif;
            font-size: 1.3em;
            font-weight: bold;
            color: white;
            text-align: center;
        }
        
        th{
            background-color: #D04242;
            height: 50px;
            box-shadow: 0 5px #a62828;
            font-size: 1.2em;
        }
        
        tr{
            
        }
        
        td{
            background: #E25858;
            height: 117px;
            box-shadow: 0 5px #CA3030;
            vertical-align: middle;
        }
        
        #table_warp {
            float: none;
            height: inherit;
            margin-left: auto;
            margin-right: auto;
            margin-top: 0px;
            clear: none;
            width: 100%;
            position: absolute;
            top: 0px;
            left: 0px;
            z-index: -1;
            background-color: #253442;
            opacity: 0.5;
            max-width: 1000px;
        }
        
        body {
            background-image: url("BG.png");
            background-color: rgb(52, 73, 94);
        }
        
        </style>
    </head>
    <body>

	<div id="primaryContainer" class="primaryContainer clearfix">
       <div id='table_container' class='clearfix'>
			<table>
				<thead>
					<tr>
						<th class="name">이름</th>
					</tr>
				</thead>
                    ${userlist}
       </div>
    </body>
</html>`
            res.send(html);
        })
        .catch((err) => {
            console.log('Error getting documents', err)
        })
})

app.get('/calendarinformation/:username', function (req, res) {
    res.sendfile('index.html')
});

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
${userinfotable}
</body>
</html>`
            res.send(html);
        });
})

app.get('/exercisedatacreat/:username', (req, res) => {
    console.log(1000);
    db.collection("exercisedata").doc('exdata').get()
        .then((it, err) => {
            var p = ''
            var part = it.data()['part']
            console.log(it.data()['part']);
            db.collection('/exercisedata/exdata/body').doc('exd').get().then((it_2, err) => {
                console.log(it_2.data());
                console.log(Object.keys(it_2.data()));
                var keys = Object.keys(it_2.data());
                for (i in keys) {
                    p += `
                <label for=${keys[i]}>Choose ${keys[i]} exercise</label>
                <select name=${keys[i]} id=${keys[i]}>
                <option value = none>selector </option>`
                    var v = it_2.data()[keys[i]]
                    for (i in v) {
                        p += `<option value=${v[i]}>${v[i]}</option>`
                    }
                    p += `</select><br><br>`
                    console.log(it_2.data()[keys[i]]);
                }

                var html = `
        <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<body>
            ${p}
</body>
</html>
        `
                res.send(html)
            });
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
    muscledata[today] = post.muscle
    fatdata[today] = post.fat

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



//회원 운동 데이터 가져오기.
// app.get('/userinformation/userexercisedata/:username', (req, res) => {
//     var filteredId = path.parse(req.params.username).base;
//     console.log(filteredId)
//     var date = []
//     var datehtml = `<ul>`
//     db.collection(`${filteredId}/userinformation/exerciseinformation`).get()
//         .then((value, err) => {
//             value.forEach((doc) => {
//                 date.push(doc.data()['thisdate'][0])
//             });
//             console.log(date);
//             for (i = 0; i < date.length; i++) {
//                 datehtml += `<li><a href='/userinformation/userexercisedata/${filteredId}/${date[i]}'>${date[i]}</a></li>`
//             }
//             datehtml += `</ul>`
//             var html = `
//             <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Document</title>
// </head>
// <body>
//     ${datehtml}<br>
// </body>
// </html>`
//             res.send(html)
//         });
// });

// app.get('/userinformation/userexercisedata/:username/:date', (req, res) => {
//     var filteredId = path.parse(req.params.username).base;
//     var date = path.parse(req.params.date).base;
//     var exerciseinfo = `<table>`
//     db.collection(`${filteredId}`).doc(`userinformation/exerciseinformation/${date}`).get()
//         .then((it) => {
//             console.log(100)
//             var key = Object.keys(it.data())
//             var value = Object.values(it.data())
//             for (i = 0; i < key.length; i++) {
//                 if (value[i].length == 0) {

//                 } else {
//                     exerciseinfo += `
//                 <tr>
//                     <th>${key[i]}</th>
//                     <th>${value[i]}</th>
//                 </tr>`
//                 }

//             }
//             exerciseinfo += `</table>`
//             var html = `
//             <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Document</title>
// </head>
// <body>
//     ${exerciseinfo}<br>
// </body>
// </html>`
//             res.send(html)
//         });
// });
