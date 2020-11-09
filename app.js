const express = require("express")
const app = express()
const bodyParser = require("body-parser")
app.use(bodyParser.json({ limit: "50mb" }))

const register = require("./endpts/auth/register")
const login = require("./endpts/auth/login")


app.post("/register", register)
app.post("/login", login)
// app.post("/search", search)
//
// app.get("/course/:_id", getCourse)
// app.get("/prof/:_name", getProf)

app.listen(3000, () => {
  console.log("listening on port 3000")
})
