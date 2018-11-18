Vue.component('modal', {
  template: '#modal-template'
})

let app = new Vue({
  el: "#app",
  methods: {
    toru: (event)=>{
      if (event) {
        if (event.target.id == app.ans) {
          app.judge = true
          app.score++
        } else {
          app.judge = false
        }
        app.lastans = app.stage[app.ans]
        app.showModal = true
        //console.log(app.index, app.stage.length)
        if (app.stage.length == 2) {
          newgame()
        }
        if (app.index < 100) {
          app.stage[app.ans] = null
        } else {
          newgame()
          //app.stage.splice(app.ans, 1)
        }
        deal()
      }
    }
  },
  data: {
    showModal: false,
    judge: null,
    lastans: null,
    stage_maisu: 8,//ステージに置けるカード枚数
    stage: [],//ステージ
    cards: [],//シャッフル済みカード
    index: 0,//カード上位置
    quiz: {},//問題カード
    ans: 0,  //正解のステージ位置
    score: 0 //正解数
  },
});

const rand = i => {
  return Math.floor(Math.random() * i)
}

const shuffle = array => {
    for (var i = 0; i < array.length; i++) {
    var r = rand(i+1)
    var tmp = array[i]
    array[i] = array[r]
    array[r] = tmp
    }
}

const deal = () => {
  app.stage.forEach((v,i,a)=>{
    if (!v) {
      a[i] = app.cards[app.index]
      app.index++
    }
  })
  app.ans = rand(app.stage.length)
  app.quiz = app.stage[app.ans]
}

const newgame = () => {
  app.index = 0
  app.score = 0
  shuffle(app.cards)
  app.stage = [...Array(app.stage_maisu)]
  deal()
}

app.cards = init()
newgame()
