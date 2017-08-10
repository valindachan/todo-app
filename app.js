const express = require("express")
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")
const mustacheExpress = require("mustache-express")

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

  const listByCompletion = {
    complete: todos.todos.filter(todo => todo.status === "complete"),
    incomplete: todos.todos.filter(todo => todo.status === "incomplete")
  }

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
