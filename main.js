/* -*- mode:javascript -*-
  hyakunin isshu anki app
*/

// JSON.parseのriviver
const inf = (k,v) => {
  if (k == "elapsed" && v == null) {
    return Infinity
  } else {
    return v
  }
}

// register the grid component
Vue.component('demo-grid', {
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    filterKey: String
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    }
  }
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
        let r = Object.assign({}, app.quiz)
        r.judge = app.judge
        r.elapsed = r.judge ? Date.now() - app.started : Infinity
        r.otetsuki = event.target.id < 100 ? app.record.stage[event.target.id].cardno : -1
        app.record.results.push(r)
        app.gridData.push(r)
        app.showModal = true
      }
    },
    closemodal: () => {
      app.showModal = false
      if (app.record.index - app.record.stage_maisu < app.record.mondaisu-1) {
        app.record.stage[app.record.answer] = null
        deal()
      } else {
        app.history.unshift(Object.assign({},app.record))
        localStorage.setItem("history", JSON.stringify(app.history))
        localStorage.removeItem("record")
        newgame()
        app.showStart = true
      }
    },
    closestart: (event) => {
      if (event.target.id == "reset") {
        if (app.record.results.length > 0) {
          app.history.unshift(Object.assign({},app.record))
          localStorage.setItem("history", JSON.stringify(app.history))
        }
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
      mondaisu: 100,
      stage_maisu: 8,//ステージに置けるカード枚数
      mondaiset: [],
      stage: [],//ステージ
      index: 0,//カードの位置
      answer: 0,  //正解のステージ位置
    },
    history: [],
    started: 0, //dealでセットされる
    showStart: true,
    showModal: false,
    judge: false,
    cards: [],//シャッフル済みカード
    quiz: {},//問題カード

    searchQuery: '',
    gridColumns: ['cardno', 'elapsed'],
    gridData: [],
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
      let card = app.record.mondaiset[app.record.index]
      card.grid = i
      a[i] = card
      app.record.index++
    }
  })
  let validcards = app.record.stage.filter(mondai=>mondai.valid)
  app.record.answer = validcards[rand(validcards.length)].grid
  app.quiz = app.record.stage[app.record.answer]
  app.started = Date.now()

  localStorage.setItem("record", JSON.stringify(app.record))
}

const newgame = () => {
  var record = JSON.parse(localStorage.getItem("record"), inf)
  if (record) {
    app.record = record
    app.quiz = app.record.stage[app.record.answer]
    app.started = Date.now()
  } else {
    var a = shuffle([...Array(100)].map((x,i)=>i))
    var avalid = a.map(x=>{return {cardno:x, valid:true}})
    var ainvalid = a.map(x=>{return {cardno:x, valid:false}})
    app.record.mondaiset = avalid.concat(ainvalid)
    app.record.startdate = Date.now()
    app.record.results = []
    app.record.stage_maisu = 8,//ステージに置けるカード枚数
    app.record.stage = [...Array(app.record.stage_maisu)]
    app.record.index = 0 //問題の位置
    app.gridData = []
    deal()
  }
}

app.cards = cards() //import from mondai.js
app.history = JSON.parse(localStorage.getItem("history"), inf) || []
newgame()
app.showStart = true
