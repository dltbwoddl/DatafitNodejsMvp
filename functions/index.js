const functions = require('firebase-functions');
const express = require('express')
const app = express();

var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const { toNamespacedPath } = require("path");

var firebase = require("firebase/app");
const { request } = require('http');
const { response } = require('express');
const { isNull } = require('util');

//버튼으로 삭제하는 버튼, 같은 내용 운동이면 둘다 삭제 하지만 이용자 입장에서 
//똑같은 내용을 두번 입력하는 경우는 흔하지 않으므로 굳이 안고쳐도 될듯
//색 다르게 하는 것 구현하기.
//회원가입에서 바로 넘어가도록 만들기

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
//회원 추가하기, 캘린더 넘어가는 버튼 만들기.
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
            margin: 0;
            box-sizing: border-box;
        }

        ul {
            padding: 0;
            list-style: none;
        }

        a {
            color: #555;
            transition: 0.3s;
            text-decoration: none;

        }

        a:hover {
            color: #bbb;
        }

        .fl-left {
            float: left;
        }

        .d-none {
            display: none;
        }

        .clearfix:after {
            display: table;
            content: "";
            clear: both;
        }

        #content {
            margin: 0 auto;
            padding: 0 10%;
            max-width: 767px;
        }

        /* ===================================header */

        #header {
            padding: 30px 0;
            width: 100%;
            height: auto;
            background-color: rgba(252, 151, 73, .9);
            text-align: center;
        }

        #header p {
            padding-top: 5px;
            font-size: 11px;
            font-family: Verdana;
            color: black;
            animation-name: black-to-white;
            animation-duration: 3s;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
        }

        @keyframes black-to-white {
            0% {
                color: rgba(0, 0, 0);
            }

            25% {
                color: rgba(0, 0, 0, 0.3);
            }

            50% {
                color: rgba(0, 0, 0, 0.8);
            }

            75% {
                color: rgba(0, 0, 0, 0.3);
            }

            100% {
                color: rgba(0, 0, 0);
            }
        }

        /* ===================================show selected member */

        #show-selected-member {
            position: relative;
            margin-top: 30px;
            padding-top: 30px;
            padding-bottom: 30px;
            width: 100%;
            height: auto;
            background-color: rgba(252, 151, 73, .4);
            border-bottom: 1px dotted rgba(0, 0, 0, 0.3);
        }

        #show-selected-member p {
            padding: 5px 0;
            font-size: 15px;
            letter-spacing: 1px;
        }

        #close {
            position: absolute;
            display: inline-block;
            right: 30px;
            text-decoration: none;
            font-family: Verdana;
            font-size: 10px;
            letter-spacing: 1px;
        }

        #info-list>div {
            padding-left: 30px;
        }

        .avatar img {
            max-height: 72px;
            width: 100%;
        }

        /* =================================== member list */

        #member-list {
            padding-top: 30px;
            padding-bottom: 30px;
        }

        #member-list li {
            margin: 5px;
        }

        .member {
            display: inline-block;
            width: calc(25% - 10px);
            line-height: 40px;
            text-align: center;

        }

        .member a {
            display: inline-block;
            width: 100%;
            height: 100%;
            font-size: 15px;
            letter-spacing: 1px;
            background-color: rgba(252, 151, 73, .2);
        }


        @media (min-width: 768px) {
            #content {
                margin: 0 auto;
                padding: 0 10%;
                max-width: 1100px;
            }

            .member {
                width: calc(20% - 10px);
            }
        }
    </style>
</head>

<body>
    <div id="header">
        <h1>Member List</h1>
        <a href="/home/plus/${filteredId}">회원 추가</a>
    </div>
    <a href="/restore/${filteredId}">회원 복원</a>
    <div id="content">
        <!---show info of selected member -->
        <div id="show-selected-member" class="d-none">
            <a href="#" id="close">CLOSE[X]</a>
        </div>

        <!---show list of all members  -->
        <ul id="member-list"></ul>
    </div>
    <!-- Firebase App (the core Firebase SDK) is always required and must be listed first -->
    <script src="https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <!-- Add Firebase products that you want to use -->
    <script src="https://www.gstatic.com/firebasejs/6.2.0/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/6.2.0/firebase-firestore.js"></script>
    <script>
    var link = document.location.href.split("/")[4];
    console.log(111111111111111111111,link)
        $(document).ready(function () {


            var firebaseConfig = {
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
            var fire = firebase.initializeApp(firebaseConfig);
            var db = fire.firestore();
            var memberdatalist = new Array()
            db.collection('${filteredId}').doc('name').get().then((it)=>{
                console.log(it.data()['existing'])
                var member = it.data()['existing']
                for(i in member){
                    databind(member[i])
                }
            
            })
            console.log(22222,memberdatalist)
            
            function databind(memberi) {

                // for (let v in data.results) {
                db.collection(\`${filteredId}/name/\${memberi}\`).doc('userinformation').get().then((mem) => {
                    console.log(mem.data())
                    let user = mem.data();
                    let memberTag = $('<li class="member">');
                    let aTag = $('<a href="#show-selected-member" class="member-name">');
                    $(aTag).html(user['name']);
                    $(memberTag).append(aTag);

                    let infoArea = $('<div class="info-area d-none">');
                    let infoList = $('<div id="info-list" class="clearfix">');

                    let infoListItems = \`

          <div class="fl-left">
            <p>Name : \${user['name']}</p>
            <p>Gender : \${user['sex']}</p>
            <p>weight : \${user['weight']}</p>
            <p>height : \${user['height']}</p>
            <a href="/calendar/${filteredId}/\${user['name']}">운동 캘린더</a>
            <a href="/deletemember/${filteredId}/\${user['name']}">삭제</a>
            </div>\`;

                    $(infoList).append(infoListItems)
                    $(infoArea).append(infoList);

                    $(memberTag).append(infoArea);

                    $('#member-list').append(memberTag);
                })

            }


            $('body').on("click", '.member-name', function (e) {
                $('#show-selected-member').removeClass('d-none');

                $('#seleted-member').remove();

                const info = $(e.target).parent().find('.info-area').html();
                const infoTag = \`<div id="seleted-member">\${info}</div>\`;
                $('#show-selected-member').append(infoTag);

                var target = $(e.target).attr("href");
                var offset = $(target).offset();
                $('html').animate({ scrollTop: offset.top });

                e.preventDefault();
            });

            // btn-close in #show-selected-member
            $('body').on("click", '#close', function (e) {
                $('#show-selected-member').addClass('d-none');
                e.preventDefault();
            });


        });

    </script>
</body>

</html>
`
  response.send(html)
})

//회원 삭제하기.
app.get('/deletemember/:email/:name', (request, response) => {
  var email = path.parse(request.params.email).base;
  var name = path.parse(request.params.name).base;
  db.collection(`${email}`).doc('name').get().then((it) => {
    var d = it.data()
    var del = d['del']
    var existing = d['existing']
    if (existing.length === 1) {
      existing = new Array
    } else {
      ind = existing.indexOf(name)
      existing.splice(ind, 1)
    }
    del.push(name)

    console.log(del)
    console.log(existing)
    d['del'] = del
    d['existing'] = existing
    db.collection(`${email}`).doc('name').update(
      d
    ).then((it) => {
      response.redirect(`/home/${email}`)
      return ('')
    }).catch(() => { })
    return (' ')
  }).catch(() => { })
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
    <form action='/plus_process/${filteredId}' method = 'post'>
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
  return (html)
});
//회원 복원하기.
app.get('/restore/:email',(request,response)=>{
  var email = path.parse(request.params.email).base;
  db.collection(`${email}`).doc('name').get().then((it)=>{
    var d = it.data()
    var del = d['del']
    var p = ``
    for(i in del){
      var delname=del[i]
          p +=`<label><input type="checkbox" name="${delname}" value="${delname}"> ${delname}</label>    `
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
    <form method="post" action="/restore_process/${email}">
        <p>삭제 목록</p>
        ${p}
        <p><input type="submit" value="Submit"></p>
    </form>
</body>

</html>
    `
    response.send(html)
    return(' ')
  }).catch(()=>{})
})
app.post("/restore_process/:email",(request,response)=>{
  var email = path.parse(request.params.email).base;
  var post = request.body;
  var value = Object.values(post)
  db.collection(`${email}`).doc('name').get().then((it)=>{
    var d = it.data()
    var del = d['del']
    var existing = d['existing']
    for (i in value){
      if(del.length ===1){
        del = new Array
      } else{
        ind = del.indexOf(value[i])
        del.splice(ind,1)
      }
      existing.push(value[i])
    }
    console.log(del)
    console.log(existing)
    d['del']=del
    d['existing']=existing
    db.collection(`${email}`).doc('name').update(d).then(()=>{
      response.redirect(`/home/${email}`)
      return(' ')
    }).catch(()=>{})
    return(' ')
  }).catch(()=>{})
})
//추가하기 과정
app.post('/plus_process/:email', (request, response) => {
  var filteredId = path.parse(request.params.email).base;
  var post = request.body;
  var dateFormat = require('dateformat');
  var now = new Date();
  var today = dateFormat(now, "yyyy.m.dd")
  var muscledata = {}
  var fatdata = {}
  muscledata[today] = post.muscle
  fatdata[today] = post.fat

  var data = {
    'name': post.name,
    'age': post.age,
    'sex': post.sex,
    'height': post.height,
    'weight': post.weight,
    'muscle': muscledata,
    'fat': fatdata
  }
  db.collection(`${filteredId}/name/${post.name}`).doc("userinformation").set(
    data
  ).then(() => {
    db.collection(`${filteredId}`).doc('name').get().then((it, err) => {
      console.log(it.data()['existing']);
      var usernames = it.data()['existing']
      usernames.push(post.name);
      db.collection(`${filteredId}`).doc('name').update(
        'existing', usernames
      ).then(() => {
        response.redirect(`/home/${filteredId}`)
        return (' ')
      }).catch(() => { })
      return ('')
    }).catch(() => { })
    return ('')
  }).catch(() => { })
});

//캘린더
app.get('/calendar/:email/:name', (request, response) => {
  var email = path.parse(request.params.email).base;
  var name = path.parse(request.params.name).base;
  var html = `<!DOCTYPE html>
<html lang="en">
<!-- 운동 추가를 눌렀을 때 선택했던 날짜가 넘어가도록 한다. -->

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.27.0/moment.min.js"></script>
  <style>
    *,
    *:before,
    *:after {
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }

    body {
      overflow: hidden;
      font-family: 'HelveticaNeue-UltraLight', 'Helvetica Neue UltraLight', 'Helvetica Neue', Arial, Helvetica, sans-serif;
      font-weight: 100;
      color: rgba(255, 255, 255, 1);
      margin: 0;
      padding: 0;
      background: #4A4A4A;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    #calendar {
      -webkit-transform: translate3d(0, 0, 0);
      -moz-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      width: 420px;
      margin: 0 auto;
      height: 570px;
      overflow: hidden;
    }

    .header {
      height: 50px;
      width: 420px;
      background: rgba(66, 66, 66, 1);
      text-align: center;
      position: relative;
      z-index: 100;
    }

    .header h1 {
      margin: 0;
      padding: 0;
      font-size: 20px;
      line-height: 50px;
      font-weight: 100;
      letter-spacing: 1px;
    }

    .left,
    .right {
      position: absolute;
      width: 0px;
      height: 0px;
      border-style: solid;
      top: 50%;
      margin-top: -7.5px;
      cursor: pointer;
    }

    .left {
      border-width: 7.5px 10px 7.5px 0;
      border-color: transparent rgba(160, 159, 160, 1) transparent transparent;
      left: 20px;
    }

    .right {
      border-width: 7.5px 0 7.5px 10px;
      border-color: transparent transparent transparent rgba(160, 159, 160, 1);
      right: 20px;
    }

    .month {
      /*overflow: hidden;*/
      opacity: 0;
    }

    .month.new {
      -webkit-animation: fadeIn 1s ease-out;
      opacity: 1;
    }

    .month.in.next {
      -webkit-animation: moveFromTopFadeMonth .4s ease-out;
      -moz-animation: moveFromTopFadeMonth .4s ease-out;
      animation: moveFromTopFadeMonth .4s ease-out;
      opacity: 1;
    }

    .month.out.next {
      -webkit-animation: moveToTopFadeMonth .4s ease-in;
      -moz-animation: moveToTopFadeMonth .4s ease-in;
      animation: moveToTopFadeMonth .4s ease-in;
      opacity: 1;
    }

    .month.in.prev {
      -webkit-animation: moveFromBottomFadeMonth .4s ease-out;
      -moz-animation: moveFromBottomFadeMonth .4s ease-out;
      animation: moveFromBottomFadeMonth .4s ease-out;
      opacity: 1;
    }

    .month.out.prev {
      -webkit-animation: moveToBottomFadeMonth .4s ease-in;
      -moz-animation: moveToBottomFadeMonth .4s ease-in;
      animation: moveToBottomFadeMonth .4s ease-in;
      opacity: 1;
    }

    .week {
      background: #4A4A4A;
    }

    .day {
      display: inline-block;
      width: 60px;
      padding: 10px;
      text-align: center;
      vertical-align: top;
      cursor: pointer;
      background: #4A4A4A;
      position: relative;
      z-index: 100;
    }

    .day.other {
      color: rgba(255, 255, 255, .3);
    }

    .day.today {
      color: rgba(156, 202, 235, 1);
    }

    .day-name {
      font-size: 9px;
      text-transform: uppercase;
      margin-bottom: 5px;
      color: rgba(255, 255, 255, .5);
      letter-spacing: .7px;
    }

    .day-number {
      font-size: 24px;
      letter-spacing: 1.5px;
    }


    .day .day-events {
      list-style: none;
      margin-top: 3px;
      text-align: center;
      height: 12px;
      line-height: 6px;
      overflow: hidden;
    }

    .day .day-events span {
      vertical-align: top;
      display: inline-block;
      padding: 0;
      margin: 0;
      width: 5px;
      height: 5px;
      line-height: 5px;
      margin: 0 1px;
    }

    /* .blue {
      background: rgba(156, 202, 235, 1);
    }

    .orange {
      background: rgba(247, 167, 0, 1);
    }

    .green {
      background: rgba(153, 198, 109, 1);
    }

    .yellow {
      background: rgba(249, 233, 0, 1);
    } */

    .details {
      position: relative;
      width: 420px;
      height: 75px;
      background: rgba(164, 164, 164, 1);
      margin-top: 5px;
      border-radius: 4px;
    }

    .details.in {
      -webkit-animation: moveFromTopFade .5s ease both;
      -moz-animation: moveFromTopFade .5s ease both;
      animation: moveFromTopFade .5s ease both;
    }

    .details.out {
      -webkit-animation: moveToTopFade .5s ease both;
      -moz-animation: moveToTopFade .5s ease both;
      animation: moveToTopFade .5s ease both;
    }

    .arrow {
      position: absolute;
      top: -5px;
      left: 50%;
      margin-left: -2px;
      width: 0px;
      height: 0px;
      border-style: solid;
      border-width: 0 5px 5px 5px;
      border-color: transparent transparent rgba(164, 164, 164, 1) transparent;
      transition: all 0.7s ease;
    }

    .events {
      height: 75px;
      padding: 7px 0;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .events.in {
      -webkit-animation: fadeIn .3s ease both;
      -moz-animation: fadeIn .3s ease both;
      animation: fadeIn .3s ease both;
    }

    .events.in {
      -webkit-animation-delay: .3s;
      -moz-animation-delay: .3s;
      animation-delay: .3s;
    }

    .details.out .events {
      -webkit-animation: fadeOutShrink .4s ease both;
      -moz-animation: fadeOutShink .4s ease both;
      animation: fadeOutShink .4s ease both;
    }

    .events.out {
      -webkit-animation: fadeOut .3s ease both;
      -moz-animation: fadeOut .3s ease both;
      animation: fadeOut .3s ease both;
    }

    .event {
      font-size: 16px;
      line-height: 22px;
      letter-spacing: .5px;
      padding: 2px 16px;
      vertical-align: top;
    }

    .event.empty {
      color: #eee;
    }

    .event-category {
      height: 10px;
      width: 10px;
      display: inline-block;
      margin: 6px 0 0;
      vertical-align: top;
    }

    .event span {
      display: inline-block;
      padding: 0 0 0 7px;
    }

    .legend {
      position: absolute;
      bottom: 0;
      width: auto;
      /* width: 100%; */
      height: auto;
      /* height: 30px; */
      background: rgba(60, 60, 60, 1);
      line-height: 30px;

    }

    .entry {
      position: relative;
      padding: 0 0 0 25px;
      font-size: 13px;
      display: inline-block;
      line-height: 30px;
      background: transparent;
    }

    .entry:after {
      position: absolute;
      content: '';
      height: 5px;
      width: 5px;
      top: 12px;
      left: 14px;
    }

    /* .entry.blue:after {
      background: rgba(156, 202, 235, 1);
    }

    .entry.orange:after {
      background: rgba(247, 167, 0, 1);
    }

    .entry.green:after {
      background: rgba(153, 198, 109, 1);
    }

    .entry.yellow:after {
      background: rgba(249, 233, 0, 1);
    } */

    /* Animations are cool!  */
    @-webkit-keyframes moveFromTopFade {
      from {
        opacity: .3;
        height: 0px;
        margin-top: 0px;
        -webkit-transform: translateY(-100%);
      }
    }

    @-moz-keyframes moveFromTopFade {
      from {
        height: 0px;
        margin-top: 0px;
        -moz-transform: translateY(-100%);
      }
    }

    @keyframes moveFromTopFade {
      from {
        height: 0px;
        margin-top: 0px;
        transform: translateY(-100%);
      }
    }

    @-webkit-keyframes moveToTopFade {
      to {
        opacity: .3;
        height: 0px;
        margin-top: 0px;
        opacity: 0.3;
        -webkit-transform: translateY(-100%);
      }
    }

    @-moz-keyframes moveToTopFade {
      to {
        height: 0px;
        -moz-transform: translateY(-100%);
      }
    }

    @keyframes moveToTopFade {
      to {
        height: 0px;
        transform: translateY(-100%);
      }
    }

    @-webkit-keyframes moveToTopFadeMonth {
      to {
        opacity: 0;
        -webkit-transform: translateY(-30%) scale(.95);
      }
    }

    @-moz-keyframes moveToTopFadeMonth {
      to {
        opacity: 0;
        -moz-transform: translateY(-30%);
      }
    }

    @keyframes moveToTopFadeMonth {
      to {
        opacity: 0;
        -moz-transform: translateY(-30%);
      }
    }

    @-webkit-keyframes moveFromTopFadeMonth {
      from {
        opacity: 0;
        -webkit-transform: translateY(30%) scale(.95);
      }
    }

    @-moz-keyframes moveFromTopFadeMonth {
      from {
        opacity: 0;
        -moz-transform: translateY(30%);
      }
    }

    @keyframes moveFromTopFadeMonth {
      from {
        opacity: 0;
        -moz-transform: translateY(30%);
      }
    }

    @-webkit-keyframes moveToBottomFadeMonth {
      to {
        opacity: 0;
        -webkit-transform: translateY(30%) scale(.95);
      }
    }

    @-moz-keyframes moveToBottomFadeMonth {
      to {
        opacity: 0;
        -webkit-transform: translateY(30%);
      }
    }

    @keyframes moveToBottomFadeMonth {
      to {
        opacity: 0;
        -webkit-transform: translateY(30%);
      }
    }

    @-webkit-keyframes moveFromBottomFadeMonth {
      from {
        opacity: 0;
        -webkit-transform: translateY(-30%) scale(.95);
      }
    }

    @-moz-keyframes moveFromBottomFadeMonth {
      from {
        opacity: 0;
        -webkit-transform: translateY(-30%);
      }
    }

    @keyframes moveFromBottomFadeMonth {
      from {
        opacity: 0;
        -webkit-transform: translateY(-30%);
      }
    }

    @-webkit-keyframes fadeIn {
      from {
        opacity: 0;
      }
    }

    @-moz-keyframes fadeIn {
      from {
        opacity: 0;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
    }

    @-webkit-keyframes fadeOut {
      to {
        opacity: 0;
      }
    }

    @-moz-keyframes fadeOut {
      to {
        opacity: 0;
      }
    }

    @keyframes fadeOut {
      to {
        opacity: 0;
      }
    }

    @-webkit-keyframes fadeOutShink {
      to {
        opacity: 0;
        padding: 0px;
        height: 0px;
      }
    }

    @-moz-keyframes fadeOutShink {
      to {
        opacity: 0;
        padding: 0px;
        height: 0px;
      }
    }

    @keyframes fadeOutShink {
      to {
        opacity: 0;
        padding: 0px;
        height: 0px;
      }
    }
  </style>

</head>

<body>
  <div id="calendar"></div>
  <form action="/${email}/plusactivity" method="POST">
      <input type="text" id="date" name="date">
      <input type="text" id="name" name="name" value="${name}">
      <input type="submit" value="운동 추가하기.">
    </form>

  <!-- Insert these scripts at the bottom of the HTML, but before you use any Firebase services -->

  <!-- Firebase App (the core Firebase SDK) is always required and must be listed first -->
  <script src="https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <!-- Add Firebase products that you want to use -->
  <script src="https://www.gstatic.com/firebasejs/6.2.0/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/6.2.0/firebase-firestore.js"></script>
  <script>
  document.getElementById("name").style.visibility = 'hidden'
    document.getElementById("date").style.visibility = 'hidden'
    var pathArray = window.location.pathname.split('/');
    // TODO: Replace the following with your app's Firebase project configuration
    var firebaseConfig = {
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
    var fire = firebase.initializeApp(firebaseConfig);
    var db = fire.firestore();

      db.collection('${email}/name/${name}/userinformation/exercisebydate').get()
        .then((snapshot) => {
          db.collection('${email}').doc('color').get().then((colors)=>{
            var colors = colors.data()
            console.log('colorscolorscolorscolors',colors)
            var datas = []
          snapshot.forEach(function (doc) {
            var i = doc.data()
            console.log(111111, i)
            var exd = Object.keys(i)
            console.log(222222, exd)
            for (j in exd) {
              if (exd[j] != 'thisdate') {
                console.log('partaprataptpap',colors[exd[j]])
                if (i[exd[j]][0] != null) {
                  console.log(3333, i[exd[j]])
                  console.log(moment(i['thisdate'][0]))
                  for (t in i[exd[j]]) {
                    datas.push({ eventName: i[exd[j]][t], calendar: exd[j], color:colors[exd[j]] , date: moment(i['thisdate']) })
                  }
                }
              }
            }
          })

        !function () {
          var today = moment();
          function Calendar(selector, events) {
            this.el = document.querySelector(selector);
            this.events = events;
            this.current = moment().date(1);
            this.draw();//여기서 Calendar.prototype.draw으로
            var current = document.querySelector('.today');
            if (current) {
              var self = this;
              window.setTimeout(function () {
                self.openDay(current);
              }, 500);
            }
          }

          Calendar.prototype.draw = function () {
            //Create Header
            this.drawHeader();

            //Draw Month
            this.drawMonth();

            this.drawLegend();
          }

          //월 년 옆으로 달력 이동하는 코드 생성하는 부분
          Calendar.prototype.drawHeader = function () {
            console.log(22222222222, this)
            var self = this;
            if (!this.header) {
              //Create the header elements
              this.header = createElement('div', 'header');
              this.header.className = 'header';

              this.title = createElement('h1');

              var right = createElement('div', 'right');
              right.addEventListener('click', function () { self.nextMonth(); });

              var left = createElement('div', 'left');
              left.addEventListener('click', function () { self.prevMonth(); });

              //Append the Elements
              this.header.appendChild(this.title);
              this.header.appendChild(right);
              this.header.appendChild(left);
              this.el.appendChild(this.header);
            }
            var date = this.current.format('YYYY.M')
            console.log(3333333333333333, date)
            this.title.innerHTML = this.current.format('MMMM YYYY');
          }


          Calendar.prototype.drawMonth = function () {
            var self = this;
            if (this.month) {
              this.oldMonth = this.month;
              this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
              this.oldMonth.addEventListener('webkitAnimationEnd', function () {
                self.oldMonth.parentNode.removeChild(self.oldMonth);
                self.month = createElement('div', 'month');
                self.backFill();
                self.currentMonth();
                self.fowardFill();
                self.el.appendChild(self.month);
                window.setTimeout(function () {
                  self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
                }, 16);
              });
            } else {
              this.month = createElement('div', 'month');
              this.el.appendChild(this.month);
              this.backFill();
              this.currentMonth();
              this.fowardFill();
              this.month.className = 'month new';
            }
          }


          Calendar.prototype.backFill = function () {
            var clone = this.current.clone();

            var dayOfWeek = clone.day();

            if (!dayOfWeek) { return; }

            clone.subtract('days', dayOfWeek + 1);

            for (var i = dayOfWeek; i > 0; i--) {
              this.drawDay(clone.add('days', 1));
            }
          }


          Calendar.prototype.fowardFill = function () {
            var clone = this.current.clone().add('months', 1).subtract('days', 1);
            var dayOfWeek = clone.day();

            if (dayOfWeek === 6) { return; }

            for (var i = dayOfWeek; i < 6; i++) {
              this.drawDay(clone.add('days', 1));
            }
          }



          Calendar.prototype.currentMonth = function () {
            var clone = this.current.clone();
            while (clone.month() === this.current.month()) {
              this.drawDay(clone);
              clone.add('days', 1);
            }
          }



          Calendar.prototype.getWeek = function (day) {
            if (!this.week || day.day() === 0) {
              this.week = createElement('div', 'week');
              this.month.appendChild(this.week);
            }
          }

          //달력을 만들 때 하루 하루를 다 만들어 준다.
          Calendar.prototype.drawDay = function (day) {
            var self = this;
            this.getWeek(day);

            //날짜 별 공간 만들어주는 곳
            var outer = createElement('div', this.getDayClass(day));

            //날짜를 클릭했을 때 하는 일.
            outer.addEventListener('click', function () {
              self.openDay(this);
            });
            //데이터를 실시간으로 끌어와 보여주는 문제가 남아 있다.
            var days = day.format('yyyy.M.DD');


            //Day Name
            var name = createElement('div', 'day-name', day.format('ddd'));

            //Day Number
            var number = createElement('div', 'day-number', day.format('DD'));


            //Events
            var events = createElement('div', 'day-events');
            this.drawEvents(day, events);

            outer.appendChild(name);
            outer.appendChild(number);
            outer.appendChild(events);
            this.week.appendChild(outer);
          }


          //날짜 이벤트 색 나타내는 곳
          Calendar.prototype.drawEvents = function (day, element) {
            if (day.month() === this.current.month()) {
              var todaysEvents = this.events.reduce(function (memo, ev) {
                if (ev.date.isSame(day, 'day')) {
                  memo.push(ev);
                }
                return memo;
              }, []);

              todaysEvents.forEach(function (ev) {
                //달력에 표시되는 운동색
                var evSpan = createElement('span', ev.color);
                evSpan.setAttribute('style',\`background : \${ev.color}\`)
                element.appendChild(evSpan);
              });
            }
          }

          Calendar.prototype.getDayClass = function (day) {
            classes = ['day'];
            if (day.month() !== this.current.month()) {
              classes.push('other');
            } else if (today.isSame(day, 'day')) {
              classes.push('today');
            }
            return classes.join(' ');
          }


          //이벤트 입력하는 곳
          Calendar.prototype.openDay = function (el) {
            console.log('@')
            var details, arrow;
            var dayNumber = +el.querySelectorAll('.day-number')[0].innerText || +el.querySelectorAll('.day-number')[0].textContent;
            day = this.current.clone().date(dayNumber);
            document.getElementById('date').value = day.format("YYYY.M.D")
            console.log(day)
            var currentOpened = document.querySelector('.details');

            //Check to see if there is an open detais box on the current row
            if (currentOpened && currentOpened.parentNode === el.parentNode) {
              details = currentOpened;
              arrow = document.querySelector('.arrow');
            } else {
              //Close the open events on differnt week row
              //currentOpened && currentOpened.parentNode.removeChild(currentOpened);
              if (currentOpened) {
                currentOpened.addEventListener('webkitAnimationEnd', function () {
                  currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.addEventListener('oanimationend', function () {
                  currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.addEventListener('msAnimationEnd', function () {
                  currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.addEventListener('animationend', function () {
                  currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.className = 'details out';
              }
              console.log(1900)
              //Create the Details Container
              details = createElement('div', 'details in');
              console.log(333333333,day.format("YYYY.M.D"))
              //Create the arrow
              var arrow = createElement('div', 'arrow');

              //Create the event wrapper

              details.appendChild(arrow);
              el.parentNode.appendChild(details);
            }

            var todaysEvents = this.events.reduce(function (memo, ev) {
              if (ev.date.isSame(day, 'day')) {
                memo.push(ev);
              }
              return memo;
            }, []);

            this.renderEvents(todaysEvents, details);

            arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + 'px';
          }


          //이벤트 텍스트 만들어주는 곳
          Calendar.prototype.renderEvents = function (events, ele) {
            console.log(2)
            //Remove any events in the current details element
            var currentWrapper = ele.querySelector('.events');
            var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));
            var form = createElement('form')
            form.setAttribute('action',\`/exercisedel/${email}/${name}/\${day.format("YYYY.M.D")}\`) 
            form.setAttribute('method','post')
            events.forEach(function (ev) {
              console.log(2222222,day.format("YYYY.M.D"))
              var div = createElement('div', 'event');
              //특정 날짜 선택했을 때 운동 색나옴.
              var square = createElement('div', 'event-category ' + ev.color);
              square.setAttribute('style',\`background : \${ev.color}\`)
              var span = createElement('input');
              span.setAttribute("type", "checkbox");
              span.setAttribute("name",\`\${ev.eventName}\`);
              span.setAttribute("value",ev.eventName)
              var label = createElement("label");
              label.setAttribute('for',ev.eventName)
              label.innerHTML=ev.eventName
              div.appendChild(square);
              div.appendChild(label);
              div.appendChild(span);
              form.appendChild(div);
              wrapper.appendChild(form);
              console.log(10)
            });
            var submit = createElement('input')
            submit.setAttribute('type','submit')
            form.appendChild(submit)
            

            if (!events.length) {
              var div = createElement('div', 'event empty');
              var span = createElement('span', '', 'No Events');

              div.appendChild(span);
              wrapper.appendChild(div);
            }

            if (currentWrapper) {
              currentWrapper.className = 'events out';
              currentWrapper.addEventListener('webkitAnimationEnd', function () {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
              });
              currentWrapper.addEventListener('oanimationend', function () {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
              });
              currentWrapper.addEventListener('msAnimationEnd', function () {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
              });
              currentWrapper.addEventListener('animationend', function () {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
              });
            } else {
              ele.appendChild(wrapper);
            }
          }

          //legend 만드는 곳
          Calendar.prototype.drawLegend = function () {
            var legend = createElement('div', 'legend');
            var calendars = this.events.map(function (e) {
              console.log("eeeeeeeeeeeee",e)
              return e.calendar + '|' + e.color;
            }).reduce(function (memo, e) {
              if (memo.indexOf(e) === -1) {
                memo.push(e);
              }
              return memo;
            }, []).forEach(function (e) {
              var parts = e.split('|');
              //legend에 나오는 색 바꾸는 부분
              console.log("partspartspartsparts", parts[1], parts[0])
              var entry = createElement('span', 'entry ' + parts[1], parts[0]);
              entry.setAttribute('style',\`background:\${parts[1]}\`)
              legend.appendChild(entry);
            });
            this.el.appendChild(legend);
          }

          //이후 달
          Calendar.prototype.nextMonth = function () {
            this.current.add('months', 1);
            this.next = true;
            this.draw();
          }

          //전달
          Calendar.prototype.prevMonth = function () {
            this.current.subtract('months', 1);
            this.next = false;
            this.draw();
          }

          window.Calendar = Calendar;

          function createElement(tagName, className, innerText) {
            var ele = document.createElement(tagName);
            if (className) {
              ele.className = className;
            }
            if (innerText) {
              ele.innderText = ele.textContent = innerText;
            }
            return ele;
          }
        }();

        !function () {
          var data = [
            { eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', color: 'red' },
            { eventName: 'Interview - Jr. Web Developer', calendar: 'Work', color: 'orange' },
            { eventName: 'Demo New App to the Board', calendar: 'Work', color: 'orange' },
            { eventName: 'Dinner w/ Marketing', calendar: 'Work', color: 'orange' },

            { eventName: 'Game vs Portalnd', calendar: 'Sports', color: 'blue' },
            { eventName: 'Game vs Houston', calendar: 'Sports', color: 'blue' },
            { eventName: 'Game vs Denver', calendar: 'Sports', color: 'blue' },
            { eventName: 'Game vs San Degio', calendar: 'Sports', color: 'blue' },

            { eventName: 'School Play', calendar: 'Kids', color: 'yellow' },
            { eventName: 'Parent/Teacher Conference', calendar: 'Kids', color: 'yellow' },
            { eventName: 'Pick up from Soccer Practice', calendar: 'Kids', color: 'yellow' },
            { eventName: 'Ice Cream Night', calendar: 'Kids', color: 'yellow' },

            { eventName: 'Free Tamale Night', calendar: 'Other', color: 'green' },
            { eventName: 'Bowling Team', calendar: 'Other', color: 'green' },
            { eventName: 'Teach Kids to Code', calendar: 'Other', color: 'green' },
            { eventName: 'Startup Weekend', calendar: 'Other', color: 'green' }
          ];


          function addDate(ev) {

          }

          var calendar = new Calendar('#calendar', datas);

        }();
      });});
  </script>

</body>

</html>`
  response.send(html)

})
//운동추가 페이지
app.post('/:email/plusactivity', (request, response) => {
  var post = request.body;
  var date = post.date
  var name = post.name
  var email = path.parse(request.params.email).base;
  db.collection(`${email}`).doc("exercisedata").get().then((it) => {
    var d = it.data()
    var keys = Object.keys(d)
    console.log("keys", keys)
    console.log("ddd", d[keys[0]])
    var p = `<div id='exerciseplus'>`
    for (i in keys) {
      p += `${keys[i]} : <select name='${keys[i]}'><option value='choose'>choose</option>`
      var v = d[keys[i]]
      for (j in v) {
        p += `<option value='${v[j]}'>${v[j]}</option>`
      }
      p += `</select><input name='${keys[i]}text' type='text'></div>`
    }
    console.log(p)
    db.collection(`${email}`).doc('exercisedata').get().then((it) => {
      var d = it.data()
      var keys = Object.keys(d)
      var s = `<div id='part'><select name='part_2'><option value ='choose'>choose</option>`
      for (i in keys) {
        console.log(i)
        s += `<option value ='${keys[i]}'>${keys[i]}</option>`
      }
      s += `</select></div>`
      console.log(s)
      var html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <form action='/explusac_process' id='plusex' method="POST">
        <div id='exlist'></div>
        <button type="button" onclick="myFunction()">기존의 파트에 새로운 운동을 추가하는 경우</button>
        <br><div id=explus_2>
        <label for="Parts">Part:</label>
        <div id='parts'></div>
            <label for="Exercise">Exercise name:</label>
            <input type="text" id="Exercise" name="ex_2">
            <label for="Exercise">detail:</label>
            <input type="text" id="Exercise" name="ex_2detail"><br><br>
          </div>
        
        <button type="button" onclick="myFunction_2()">새로운 파트를 추가하는 경우</button>
        <br><div id=explus_3>
        <label for="allPart">Part:</label>
        <input type="text" id="allPart" name="part_3"><br><br>
        <input type="color" id="partcolor" name="partcolor">
        <label for="allExercise">Exercise name:</label>
        <input type="text" id="allExercise" name="ex_3">
        <label for="Exercise">detail:</label>
            <input type="text" id="Exercise" name="ex_3detail"><br><br>
        </div>
        <input type="submit" value="Submit">
        <input type="text" name="email" value='${email}' id="email" display=none>
        <input type="text" name="date" value='${date}' id="date">
        <input type="text" name="name" value='${name}' id="name">
    </form>
    <script>
      function myFunction() {
        document.getElementById("explus_2").style.display = "inline";
        }
      function myFunction_b() {
          document.getElementById("explus_2").style.display = "none";
          }
        function myFunction_2() {
          document.getElementById("explus_3").style.display = "inline";
          }

        document.getElementById("explus_2").style.display = "none";
        document.getElementById("explus_3").style.display = "none";
        document.getElementById("email").style.display = "none";
        document.getElementById("date").style.display = "none";
        document.getElementById("name").style.display = "none";
        document.getElementById('parts').innerHTML = "${s}";
        document.getElementById('exlist').innerHTML = "${p}";
    </script>
</body>

</html>`
      response.send(html);
      return (" ")
    }).catch(() => { })
    return ("")
  }).catch(() => { })
})

//운동추가 과정
app.post('/explusac_process', (request, response) => {
  var post = request.body;
  var name = post.name
  var email = post.email;
  var date = post.date

  var part_2 = post.part_2
  var ex_2 = post.ex_2

  var part_3 = post.part_3
  var ex_3 = post.ex_3
  var partcolor = post.partcolor

  var l = ['partcolor','part_2', 'ex_2', 'part_3', 'ex_3', 'name', 'email', 'date']
  var p = new Object()
  p['thisdate'] = date
  var d = ``
  var keys = Object.keys(post)
  if (part_2 === 'choose' && part_3 === '') {
    for (i in keys) {
      var k = keys[i]
      if (l.includes(k) === false) {
        if (k.slice(-4) !== "text") {
          if (post[k] !== 'choose' && post[k] !== undefined) {
            if (k.slice(-4) !== "tail") {
              p[k] = new Array(post[k] + " : " + post[k + "text"])
            }
          }
        }
      }
    }
  } else {
    //기존의 부위에 새로운 운동 추가할 때
    console.log(10000000)
    if (part_2 !== 'choose') {
      p_2 = post['part_2']
      ex_2 = post['ex_2']
      p[p_2] = new Array(ex_2 + " : " + post['ex_2detail'])
      console.log(222222222222, p_2)
      db.collection(`${email}`).doc('exercisedata').get().then((it) => {
        var h = it.data()[`${p_2}`]
        h.push(ex_2)
        console.log('hhhhhhhhhhhhhhhh', h)
        db.collection(`${email}`).doc('exercisedata').update(
          `${p_2}`, h
        ).catch(() => { })
        return (' ')
      }).catch(() => { })
    } else {
      //새로운 부위에 새로운 운동 추가할 때.
      p_3 = post['part_3']
      ex_3 = post['ex_3']
      p[p_3] = new Array(ex_3 + " : " + post['ex_3detail'])
      db.collection(`${email}`).doc('exercisedata').update(
        p_3, new Array(ex_3)
      ).then(() => {
        db.collection(`${email}`).doc('color').get().then((it) => {
          if (it.data() === undefined) {
            db.collection(`${email}`).doc('color').set(
              {})
          }
          db.collection(`${email}`).doc('color').update(
            p_3, partcolor)
        return(' ')
          }).catch(()=>{})
        return(" ")
      }).catch(()=>{})
    }
  }
  db.collection(`${email}/name/${name}/userinformation/exercisebydate`).doc(`${date}`)
    .get().then((it) => {
      var pk = Object.keys(p)[1]
      // response.send(Object.keys(p)[1])
      //해당 날짜에 운동 데이터가 없는 경우
      if (it.data() === undefined) {
        db.collection(`${email}/name/${name}/userinformation/exercisebydate`).doc(`${date}`)
          .set(
            p
          ).then(() => {
            response.redirect(`/calendar/${email}/${name}`)
            return (" ")
          }).catch(() => { })
      } else {
        //해당 날짜에 운동데이터가 있는 경우
        var ks = Object.keys(p)
        db.collection(`${email}/name/${name}/userinformation/exercisebydate`).doc(`${date}`)
          .get().then((it) => {
            var d = it.data()
            var x = new Object()
            for (i in ks) {
              if (ks[i] !== 'thisdate') {
                var v = d[ks[i]]
                if (v === undefined) {
                  v = new Array()
                }
                v.push(p[ks[i]][0])
                x[ks[i]] = v
              }
            }
            db.collection(`${email}/name/${name}/userinformation/exercisebydate`).doc(`${date}`)
              .update(x)
              .then(() => {
                response.redirect(`/calendar/${email}/${name}`)
                return (" ")
              }).catch(() => { })
            return (" ")
          }).catch(() => { })
      }
      return (" ")
    }).catch(() => { })


})

//회원 정보 상세보기
app.get('/information/:email/:name', (request, response) => {
  //email, name가져오고 firestore에서 데이터 가져오기.
  var email = path.parse(request.params.email).base;
  var name = path.parse(request.params.name).base;
  db.collection(`${email}/name/${name}`).doc('userinformation').get().then((it) => {
    var keys = Object.keys(it.data())
    var d = it.data()
    var p = `<div>`
    for (i in keys) {
      if (typeof d[keys[i]] === "object") {
        p += `<p>${keys[i]} : ${Object.keys(d[keys[i]])[0]} = ${Object.values(d[keys[i]])[0]}</p>`
      } else {
        p += `<p>${keys[i]} : ${d[keys[i]]}</p>`
      }
    }
    p += `</div>`

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
    response.send(html)
    return (" ")
  }).catch(() => { })
})

//회원 운동 삭제 페이지 구현하기.
//회원 운동 삭제 프로세스 완성하기.
app.post('/exercisedel/:email/:name/:date', (request, response) => {
  var post = request.body;
  var delex = Object.values(post)
  var email = path.parse(request.params.email).base;
  var name = path.parse(request.params.name).base;
  var date = path.parse(request.params.date).base;
  console.log('delex', delex)
  ///limyohan@naver.com/name/이창현/userinformation/exercisebydate/2020.9.9
  db.collection(`${email}/name/${name}/userinformation/exercisebydate`).doc(`${date}`).get().then((it) => {
    var d = it.data()
    var keys = Object.keys(d)
    // console.log(values)
    console.log('origin',d)
    for (i in keys) {
      var key = keys[i]
      var values = d[key]
      if (typeof (values) !== 'string') {
        for (j in values) {
          if (delex.includes(values[j])) {
            var ts = d[key]
            if (ts.length === 1) {
              delete d[key]
            } else {
              var v = Object.values(ts)
              var ind = v.indexOf(values[j])
              v.splice(ind, 1)
              d[key] = v
            }
          }
        }
      }
    }
    console.log('change',d)
    db.collection(`${email}/name/${name}/userinformation/exercisebydate`).doc(`${date}`).set(d).then(() => {
      response.redirect(`/calendar/${email}/${name}`)
      return(' ')
    }).catch(()=>{})
  return(' ')
  }).catch(()=>{})

})

exports.app = functions.https.onRequest(app);