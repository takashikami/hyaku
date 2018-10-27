let app = new Vue({
  el: "#app",
  methods: {
    toru: (event)=>{
      if (event) {
        let judge
        if (event.target.id == app.ans) {
          judge = "正解"
          app.score++
        } else {
          judge = "不正解"
        }
        alert([judge,
                app.stage[app.ans].yomikami,
                app.stage[app.ans].yomisimo].join("\n"))
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

const init = () => {
  for (let i = 0; i < 100; i++) {
    const hira = bara.hira[i]
    const yomi = bara.yomi[i]
    let card = {}
    card.hira = hira
    card.yomi = yomi
    card.hirakami = simo(hira[0]+hira[1]+hira[2])
    card.hirasimo = simo(hira[3]+hira[4])
    card.yomikami = yomi[0]+yomi[1]+yomi[2]
    card.yomisimo = yomi[3]+yomi[4]
    card.id = i+1
    app.cards.push(card)
  }
}

const newgame = () => {
  app.index = 0
  app.score = 0
  shuffle(app.cards)
  app.stage = [...Array(app.stage_maisu)]
  deal()
}

init()
newgame()
