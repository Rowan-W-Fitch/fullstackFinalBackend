const express = require("express")
const app = express()
const bodyParser = require("body-parser")
app.use(bodyParser.json({ limit: "50mb" }))

const register = require("./endpts/auth/register")
const login = require("./endpts/auth/login")

app.post("/register", register)
app.post("/login", login)

const getClass = require("./endpts/class/getCourse")
const getClasses = require("./endpts/class/getCourses")
const createClass = require("./endpts/class/create")

app.post("/class", createClass)
app.get("/class/:_id", getClass)
app.get("/class", getClasses)

const getProf = require("./endpts/prof/getProf")
const getProfs = require("./endpts/prof/getProfs")
const createProf = require("./endpts/prof/create")

app.post("/prof", createProf)
app.get("/prof/:_id", getProf)
app.get("/prof", getProfs)

app.listen(process.env.PORT || 5000, () => {
  console.log("running!")
})
