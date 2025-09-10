import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import session from "express-session"
import {
    addTodoItem,
    getTodoList,
    editTodoItem,
    deleteTodoItem,
    search,
    login,
    register,
    hasSession
} from "./controller/todo.controller.js"


dotenv.config()
const port = 8080
const app = express()
const sessionSecret = process.env.sessionSecret || "default secret"


//middlewares
app.use(express.json())
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 500000,
        sameSite: "lax",
        secure: false,
        httpOnly: true,
    }
}))
app.use(cors({
    origin: process.env.allowedOrigin,
    credentials: true,
}))


// add todo
app.post("/todo-api/addTodoItem", addTodoItem)

// get todo list
app.get("/todo-api/getTodoList", getTodoList)

// edit text of todo item
app.patch("/todo-api/editTodoItem", editTodoItem)

// remove a todo item
app.delete("/todo-api/deleteTodoItem", deleteTodoItem)

// search todo items
app.get("/todo-api/search", search)

// register user
app.post("/todo-api/register", register)

// login user
app.post("/todo-api/login", login)

// login user
app.get("/todo-api/hasSession", hasSession)

//making database connection
mongoose.connect("mongodb://myUserAdmin:admin@localhost:27017/todo?authSource=admin").then(() => {
    console.log("Connected to local instance of MonogoDB")
    app.listen(port, () => console.log("Listening on port: ", port))
}).catch((error: unknown) => {
    const err = error as Error
    console.log(err.message)
})