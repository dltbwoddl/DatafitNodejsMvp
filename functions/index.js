const functions = require('firebase-functions');
const express = require('express')
const app = express();

var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const { toNamespacedPath } = require("path");

var firebase = require("firebase/app");


//회원 추가 페이지 만들기.(a제대로 안먹히는 이유 알아보기.)
//회원 추가하면 데이터 생성되고 리스트에 바로 나오도록 하기.

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
require("firebase/auth");
require("firebase/firestore");
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

//회원 리스트 보여주는 페이지
app.get('/home/:email', (request, response) => {
    console.log(path)
    var filteredId = path.parse(request.params.email).base;
    console.log(filteredId)
    var html = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
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
            width: 320px;
            height: 560px;
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
        <div class="list">
            <!-- <div class="item">
                <div class="img"></div>
                <span></span>
                <span></span>
                <span></span>
            </div> -->
        </div>

        <div class="circle"></div>
        <div class="menu">
            <ul>
                <!-- 이메일 주소 넣어서 처리하기. -->
                <li><a href='./plus/${filteredId}'>회원 추가하기</a></li>
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
    response.send(html)
})

//회원 추가하기.
app.get('/home/plus/:email', (request, response) => {
    var filteredId = path.parse(request.params.email).base;
    var html = `
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<body>
    <form action='./plus_process/${filteredId}' method = 'post'>
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
    response.send(html)
})

app.get('/timestamp',(request,response)=>{
    response.send(`${Date.now()}`)
});

app.get('/timestamp-cached',(request,response)=>{
    response.set('Cache-Control',`public,max-age=300, s-maxage=600`);
    response.send(`${Date.now()}`)
});

exports.app = functions.https.onRequest(app);
