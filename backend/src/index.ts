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
    requestNewPassword,
    authorizeNewPassword
} from "./controller/todo.controller.js"


dotenv.config()
const mongoDbUrl = process.env.mongoDbUrl as string
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
        maxAge: 86400000,
        sameSite: "lax",
        secure: false,
        httpOnly: true,
    }
}))
const allowedOrign1 = process.env.allowedOrigin1
const allowedOrign2 = process.env.allowedOrigin2
app.use(cors({
    // I'm allowing all the origin domains
    origin: (origin, callback) => {
        const allowed = [allowedOrign1, allowedOrign2]
        if (!origin || allowed.includes(origin)) {
            callback(null, origin)
        } else {
            callback(new Error("Origin not allowed."))
        }
    },
    credentials: true,
}))


// add todo
app.post("/addTodoItem", addTodoItem)

// get todo list
app.get("/getTodoList", getTodoList)

// edit text of todo item
app.patch("/editTodoItem", editTodoItem)

// remove a todo item
app.delete("/deleteTodoItem", deleteTodoItem)

// search todo items
app.get("/search", search)

// register user
app.post("/register", register)

// login user
app.post("/login", login)

// New Password (forgot password)
app.post("/requestNewPassword", requestNewPassword)

// authorize new Password
app.post("/authorizeNewPassword", authorizeNewPassword)


//making database connection
mongoose.connect(mongoDbUrl).then(() => {
    console.log("Connected to local instance of MonogoDB")
    app.listen(port, () => console.log("Listening on port: ", port))
}).catch((error: unknown) => {
    const err = error as Error
    console.log(err.message)
})