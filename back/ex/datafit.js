var firebase = require("firebase/app");
const express = require('express')
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
const router = express.Router();

const { connected, send } = require("process");
const { toNamespacedPath } = require("path");
const { fstat } = require("fs");
const app = express();
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));


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
app.get('/', (req, res) => {
    var userlist = `<div class="list">`
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
                userlist += `
                <div class="item">
                <button type="button" class="btn btn-primary" data-toggle="button" 
                aria-pressed="false" autocomplete="off" onclick="location.href='/calendarinformation/${name[i]}'">
                    ${name[i]}
                  </button>                
                  </div>`
            }
            userlist += `</div>`
            console.log(userlist)
            var html = `
            <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <style>
        * {
            margin: 0px;
            padding: 0px;
        }

        body {
            background: #383c55;
            width: 100%;
            height: 100%;
            font: 12px "Open Sans", sans-serif;
        }

        #view-code {
            color: #4183d7;
            font-size: 13px;
            text-transform: uppercase;
            font-weight: 700;
            text-decoration: none;
            position: absolute;
            top: 640px;
            left: 50%;
            margin-left: -35px;
        }

        div.screen {
            width: auto;
            height: auto;
            overflow: hidden;
            position: absolute;
            top: 50px;
            left: 50%;
            margin-left: -160px;
            background: #31558a;
        }

        .list {
            margin-top: 36px;
            text-align: left;
        }

        .item {
            height: 115px;
            margin-top: 30px 0;
            padding-left: 115px;
            clear: both;
        }

        .item .img,
        .item span {
            background: #214273;
            border-radius: 3px;
        }

        .item .img {
            float: left;
            width: 71px;
            height: 71px;
            margin-left: -93px;
        }

        .item span {
            height: 11px;
            width: 180px;
            margin-bottom: 19px;
            float: left;
        }

        .item span:nth-of-type(3) {
            width: 75px;
            margin-botom: 0;
        }

        div.burger {
            height: 30px;
            width: 40px;
            position: absolute;
            top: 11px;
            left: 21px;
            cursor: pointer;
        }

        div.x,
        div.y,
        div.z {
            position: absolute;
            margin: auto;
            top: 0px;
            bottom: 0px;
            background: #fff;
            border-radius: 2px;
            -webkit-transition: all 200ms ease-out;
            -moz-transition: all 200ms ease-out;
            -ms-transition: all 200ms ease-out;
            -o-transition: all 200ms ease-out;
            transition: all 200ms ease-out;
        }

        div.x,
        div.y,
        div.z {
            height: 3px;
            width: 26px;
        }

        div.y {
            top: 18px;
        }

        div.z {
            top: 37px;
        }

        div.collapse {
            top: 20px;
            background: #4a89dc;
            -webkit-transition: all 70ms ease-out;
            -moz-transition: all 70ms ease-out;
            -ms-transition: all 70ms ease-out;
            -o-transition: all 70ms ease-out;
            transition: all 70ms ease-out;
        }


        div.rotate30 {
            -ms-transform: rotate(30deg);
            -webkit-transform: rotate(30deg);
            transform: rotate(30deg);
            -webkit-transition: all 50ms ease-out;
            -moz-transition: all 50ms ease-out;
            -ms-transition: all 50ms ease-out;
            -o-transition: all 50ms ease-out;
            transition: all 50ms ease-out;
        }

        div.rotate150 {
            -ms-transform: rotate(150deg);
            -webkit-transform: rotate(150deg);
            transform: rotate(150deg);
            -webkit-transition: all 50ms ease-out;
            -moz-transition: all 50ms ease-out;
            -ms-transition: all 50ms ease-out;
            -o-transition: all 50ms ease-out;
            transition: all 50ms ease-out;
        }

        div.rotate45 {
            -ms-transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
            transform: rotate(45deg);
            -webkit-transition: all 100ms ease-out;
            -moz-transition: all 100ms ease-out;
            -ms-transition: all 100ms ease-out;
            -o-transition: all 100ms ease-out;
            transition: all 100ms ease-out;
        }

        div.rotate135 {
            -ms-transform: rotate(135deg);
            -webkit-transform: rotate(135deg);
            transform: rotate(135deg);
            -webkit-transition: all 100ms ease-out;
            -moz-transition: all 100ms ease-out;
            -ms-transition: all 100ms ease-out;
            -o-transition: all 100ms ease-out;
            transition: all 100ms ease-out;
        }

        div.navbar {
            height: 73px;
            background: #385e97;
        }

        div.circle {
            border-radius: 50%;
            width: 0px;
            height: 0px;
            position: absolute;
            top: 35px;
            left: 36px;
            background: #fff;
            opacity: 1;
            -webkit-transition: all 300ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
            -moz-transition: all 300ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
            -ms-transition: all 300ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
            -o-transition: all 300ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
            transition: all 300ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
        }

        div.circle.expand {
            width: 1200px;
            height: 1200px;
            top: -560px;
            left: -565px;
            -webkit-transition: all 400ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
            -moz-transition: all 400ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
            -ms-transition: all 400ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
            -o-transition: all 400ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
            transition: all 400ms cubic-bezier(0.000, 0.995, 0.990, 1.000);

        }

        div.menu {
            height: 568px;
            width: 320px;
            position: absolute;
            top: 0px;
            left: 0px;
        }

        div.menu ul li {
            list-style: none;
            position: absolute;
            top: 50px;
            ;
            left: 0;
            opacity: 0;
            width: 320px;
            text-align: center;
            font-size: 0px;
            -webkit-transition: all 70ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
            -moz-transition: all 70ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
            -ms-transition: all 70ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
            -o-transition: all 70ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
            transition: all 70ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
        }

        div.menu ul li a {
            color: #4a89dc;
            text-transform: uppercase;
            text-decoration: none;
            letter-spacing: 3px;
        }

        div.menu li.animate {
            font-size: 21px;
            opacity: 1;
            -webkit-transition: all 150ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
            -moz-transition: all 150ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
            -ms-transition: all 150ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
            -o-transition: all 150ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
            transition: all 150ms cubic-bezier(0.000, 0.995, 0.990, 1.000);
        }

        div.menu li.animate:nth-of-type(1) {
            top: 120px;
            transition-delay: 0.0s;
        }

        div.menu li.animate:nth-of-type(2) {
            top: 190px;
            transition-delay: 0.03s;

        }

        div.menu li.animate:nth-of-type(3) {
            top: 260px;
            transition-delay: 0.06s;

        }

        div.menu li.animate:nth-of-type(4) {
            top: 330px;
            transition-delay: 0.09s;

        }

        div.menu li.animate:nth-of-type(5) {
            top: 400px;
            transition-delay: 0.12s;

        }

        div.menu li.animate:nth-of-type(6) {
            top: 470px;
            transition-delay: 0.15s;

        }
    </style>
</head>

<body>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'>
    <a id="view-code" href="https://codepen.io/virgilpana/pen/NPzodr">VIEW CODE</a>
    <div class="screen">
        <div class="navbar"></div>
        ${userlist}
        <div class="circle"></div>
        <div class="menu">
            <ul>
                <li><a href="">About</a></li>
                <li><a href="">Share</a></li>
                <li><a href="">Activity</a></li>
                <li><a href="">Settings</a></li>
                <li><a href="">Contact</a></li>
            </ul>
        </div>
        <div class="burger">
            <div class="x"></div>
            <div class="y"></div>
            <div class="z"></div>
        </div>

    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <script>
        if ('ontouchstart' in window) { var click = 'touchstart'; }
        else { var click = 'click'; }


        $('div.burger').on(click, function () {

            if (!$(this).hasClass('open')) { openMenu(); }
            else { closeMenu(); }

        });


        $('div.menu ul li a').on(click, function (e) {
            e.preventDefault();
            closeMenu();
        });


        function openMenu() {

            $('div.circle').addClass('expand');

            $('div.burger').addClass('open');
            $('div.x, div.y, div.z').addClass('collapse');
            $('.menu li').addClass('animate');

            setTimeout(function () {
                $('div.y').hide();
                $('div.x').addClass('rotate30');
                $('div.z').addClass('rotate150');
            }, 70);
            setTimeout(function () {
                $('div.x').addClass('rotate45');
                $('div.z').addClass('rotate135');
            }, 120);



        }

        function closeMenu() {

            $('div.burger').removeClass('open');
            $('div.x').removeClass('rotate45').addClass('rotate30');
            $('div.z').removeClass('rotate135').addClass('rotate150');
            $('div.circle').removeClass('expand');
            $('.menu li').removeClass('animate');

            setTimeout(function () {
                $('div.x').removeClass('rotate30');
                $('div.z').removeClass('rotate150');
            }, 50);
            setTimeout(function () {
                $('div.y').show();
                $('div.x, div.y, div.z').removeClass('collapse');
            }, 70);

        }
    </script>
</body>

</html>
`
            res.send(html);
            return snapshot
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
