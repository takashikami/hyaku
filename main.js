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
        if (event.target.id == app.record.answer) {
          app.judge = true
          app.score++
        } else {
          app.judge = false
        }
        let r = {id:0,elapsed:0,judge:false}
        r.id = app.quiz.id
        r.elapsed = Date.now() - app.started
        r.judge = (event.target.id == app.record.answer)
        app.record.results.push(r)

        app.showModal = true
      }
    },
    closemodal: () => {
      app.showModal = false
      if (app.record.index - app.record.stage_maisu < 9) {
        app.record.stage[app.record.answer] = null
      } else {
        localStorage.removeItem("record")
        newgame()
      }
      deal()
    },
    closestart: (event) => {
      if (event.target.id == "reset") {
        localStorage.removeItem("record")
      }
      newgame()
      app.showStart = false
    },
  },
  data: {
    record: {
      startdate: null,
      results: [],
      stage_maisu: 8,//ステージに置けるカード枚数
      mondaiset: [],
      stage: [],//ステージ
      index: 0,//カードの位置
      answer: 0,  //正解のステージ位置
    },
    started: 0, //dealでセットされる
    showStart: true,
    showModal: false,
    judge: false,
    cards: [],//シャッフル済みカード
    quiz: {},//問題カード
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
  return array
}

const deal = () => {
  app.record.stage.forEach((v,i,a)=>{
    if (!v) {
      a[i] = app.cards[app.record.mondaiset[app.record.index].index]
      app.record.index++
    }
  })
  app.record.answer = rand(app.record.stage.length)
  app.quiz = app.record.stage[app.record.answer]
  app.started = Date.now()

  localStorage.setItem("record", JSON.stringify(app.record))
}

const newgame = () => {
  var record = JSON.parse(localStorage.getItem("record"))
  if (record) {
    app.record = record
    app.quiz = app.record.stage[app.record.answer]
    app.started = Date.now()
  } else {
    var a = shuffle([...Array(100)].map((x,i)=>i))
    var avalid = a.map(x=>{return {index:x, valid:true}})
    var ainvalid = a.map(x=>{return {index:x, valid:false}})
    app.record.mondaiset = avalid.concat(ainvalid)
    app.record.startdate = Date.now()
    app.record.results = []
    app.record.stage_maisu = 8,//ステージに置けるカード枚数
    app.record.stage = [...Array(app.record.stage_maisu)]
    app.record.index = 0 //問題の位置
    deal()
  }
}

app.cards = cards() //import from mondai.js
newgame()
app.showStart = true
