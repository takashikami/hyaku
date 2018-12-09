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
        let r = {id:0,elapsed:0,judge:false}
        r.id = app.quiz.id
        r.elapsed = Date.now() - app.started
        r.judge = (event.target.id == app.ans)
        app.record.results.push(r)

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
    },
    closestart: () => {
      app.showStart = false
      app.started = Date.now()
    },
  },
  data: {
    record: {
      startdate: Date.now(),
      results: [],
      stage_maisu: 8,//ステージに置けるカード枚数
    },
    mondaiset: [],
    started: 0, //dealでセットされる
    elapsed: 0,
    showStart: true,
    showModal: false,
    judge: false,
    stage: [],//ステージ
    cards: [],//シャッフル済みカード
    index: 0,//カードの位置
    quiz: {},//問題カード
    ans: 0,  //正解のステージ位置
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
  localStorage.setItem("stage", JSON.stringify(app.stage))
  localStorage.setItem("ans", JSON.stringify(app.ans))
  localStorage.setItem("record", JSON.stringify(app.record))
}

const newgame = () => {
  app.cards = cards() //import from mondai.js

  app.mondaiset = JSON.parse(localStorage.getItem("mondaiset"))
  if (app.mondaiset) {
    app.index = JSON.parse(localStorage.getItem("index"))
    app.stage = JSON.parse(localStorage.getItem("stage"))
    app.ans = JSON.parse(localStorage.getItem("ans"))
    app.record = JSON.parse(localStorage.getItem("record"))

    app.quiz = app.stage[app.ans]
    app.started = Date.now()
  } else {
    app.mondaiset = [...Array(100)].map((x,i)=>i)
    shuffle(app.mondaiset)
    localStorage.setItem("mondaiset", JSON.stringify(app.mondaiset))

    app.stage = [...Array(app.record.stage_maisu)]
    app.index = 0 //問題の位置
    deal()
  }
  app.showStart = true
}

newgame()
