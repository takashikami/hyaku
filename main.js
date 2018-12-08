/* -*- mode:javascript -*-
  hyakunin isshu anki app
*/

Vue.component('modal', {
  template: '#modal-template'
})

let app = new Vue({
  el: "#app",
  methods: {
    toru: (event) => {
      if (event) {
        if (event.target.id == app.ans) {
          app.judge = true
          app.score++
        } else {
          app.judge = false
        }
        let r = new Object()
        r.id = app.quiz.id
        r.elapsed = Date.now() - app.started
        r.judge = (event.target.id == app.ans)
        app.record.push(r)

        app.showModal = true
      }
    },
    closemodal: () => {
      app.showModal = false
      if (app.stage.length == 2) {
        newgame()
      }
      if (app.index < 100) {
        app.stage[app.ans] = null
      } else {
        newgame()
      }
      deal()
    }
  },
  data: {
    record: [],
    mondaiset: [],
    started: 0, //dealでセットされる
    elapsed: 0,
    showModal: false,
    judge: false,
    stage_maisu: 8,//ステージに置けるカード枚数
    stage: [],//ステージ
    cards: [],//シャッフル済みカード
    index: 0,//カードの位置
    quiz: {},//問題カード
    ans: 0,  //正解のステージ位置
    score: 0 //正解数
  },
});

const rand = i => Math.floor(Math.random() * i)

const shuffle = array => {
  for (var i = 0; i < array.length; i++) {
    var r = rand(i)
    var tmp = array[i]
    array[i] = array[r]
    array[r] = tmp
  }
}

const deal = () => {
  app.stage.forEach((v,i,a)=>{
    if (!v) {
      a[i] = app.cards[app.mondaiset[app.index]]
      app.index++
    }
  })
  app.ans = rand(app.stage.length)
  app.quiz = app.stage[app.ans]
  app.started = Date.now()

  localStorage.setItem("index", JSON.stringify(app.index))
  localStorage.setItem("score", JSON.stringify(app.score))
  localStorage.setItem("stage", JSON.stringify(app.stage))
  localStorage.setItem("ans", JSON.stringify(app.ans))
  localStorage.setItem("record", JSON.stringify(app.record))
}

const newgame = () => {
  app.cards = cards() //import from mondai.js

  app.mondaiset = JSON.parse(localStorage.getItem("mondaiset"))
  if (app.mondaiset) {
    app.index = JSON.parse(localStorage.getItem("index"))
    app.score = JSON.parse(localStorage.getItem("score"))
    app.stage = JSON.parse(localStorage.getItem("stage"))
    app.ans = JSON.parse(localStorage.getItem("ans"))
    app.record = JSON.parse(localStorage.getItem("record"))

    app.quiz = app.stage[app.ans]
    app.started = Date.now()
  } else {
    app.mondaiset = [...Array(100)].map((x,i)=>i)
    shuffle(app.mondaiset)
    //app.record = [...Array(100)].map(x=>null)
    localStorage.setItem("mondaiset", JSON.stringify(app.mondaiset))

    app.stage = [...Array(app.stage_maisu)]
    app.index = 0 //問題の位置
    app.score = 0 //正解数
    deal()
  }
}

newgame()
