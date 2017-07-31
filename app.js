const express = require("express")
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")
const mustacheExpress = require("mustache-express")

// var jsonfile = require("jsonfile")
// var file = "./todos.json"

// console.log(file)
// let obj = { name: "Obama" }

// jsonfile.readFile(file, function(err, obj) {
//   console.dir(obj)
// })
//
// jsonfile.writeFile(file, obj, { flag: "a" }, function(err) {
//   console.error(err)
// })

// console.log(file)

const app = express()

app.use(express.static("public"))

let todos = {
  todos: [
    { id: 0, item: "Pick up dog food", status: "complete" },
    { id: 1, item: "Paint the bathroom", status: "incomplete" },
    { id: 2, item: "Go to Canada", status: "incomplete" },
    { id: 3, item: "Check out new vegan burger place", status: "complete" }
  ]
}

// Set app to use bodyParser()` middleware.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//'extended: false' parses strings and arrays.
//'extended: true' parses nested objects
//'expressValidator' must come after 'bodyParser', since data must be parsed first!
app.use(expressValidator())

app.engine("mustache", mustacheExpress())
app.set("views", "./views")
app.set("view engine", "mustache")

app.get("/", function(req, res) {
  let completedItems = todos.todos.filter(todo => todo.status === "complete")
  let incompleteItems = todos.todos.filter(todo => todo.status === "incomplete")

  let listByCompletion = {
    complete: [],
    incomplete: []
  }

  listByCompletion.complete = completedItems
  listByCompletion.incomplete = incompleteItems

  res.render("index", listByCompletion)
})

app.get("/", function(req, res) {
  res.render("index")
})

app.post("/createTodo", function(req, res) {
  let newTodo = req.body.todo
  let id = todos.todos.length
  todos.todos[id] = { id: id, item: newTodo, status: "incomplete" }
  res.redirect("/")
})

app.post("/markComplete/:id", function(req, res) {
  let id = req.params.id
  todos.todos[id].status = "complete"
  res.redirect("/")
})

app.post("/markIncomplete/:id", function(req, res) {
  let id = req.params.id
  todos.todos[id].status = "incomplete"
  res.redirect("/")
})

app.listen(3000, function() {
  console.log("Started Todo application")
})
