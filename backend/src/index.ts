import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import session from "express-session"
import path from "path"
import {
    addTodoItem,
    getTodoList,
    editTodoItem,
    deleteTodoItem,
    search,
    login,
    requestRegistration,
    googleLogin,
    googleRegistration,
    authorizeRegistration,
    requestNewPassword,
    authorizeNewPassword
} from "./controller/todo.controller.js"


dotenv.config()

let allowedOrigin: string

if (process.env.type = "local") {
    allowedOrigin = process.env.originLocal || "http://localhost:5173"
} else {
    allowedOrigin = process.env.originProduction as string
}


const mongoDbUrl = process.env.mongoDbUrl as string
const port = process.env.port
const app = express()
const __dirname = path.resolve()
const sessionSecret = process.env.sessionSecret || "default secret"


//middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.static(path.join(__dirname, "../frontend/dist")))
app.use(express.json())

app.set("trust proxy", 1) // important if behind proxy ( I've used NGINX reverse proxy to handle requests.)
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000,
        secure: false,
        sameSite: "lax",
        httpOnly: true,
    }
}))


/* api routes */

// add todo
app.post("/api/v1/addTodoItem", addTodoItem)

// get todo list
app.get("/api/v1/getTodoList", getTodoList)

// edit text of todo item
app.patch("/api/v1/editTodoItem", editTodoItem)

// remove a todo item
app.delete("/api/v1/deleteTodoItem", deleteTodoItem)

// search todo items
app.get("/api/v1/search", search)

// request registration
app.post("/api/v1/requestRegistration", requestRegistration)
//
// authorize registration
app.get("/api/v1/authorizeRegistration/:token", authorizeRegistration)

// login user
app.post("/api/v1/login", login)

// New Password (forgot password)
app.post("/api/v1/requestNewPassword", requestNewPassword)

// authorize new Password
app.post("/api/v1/authorizeNewPassword", authorizeNewPassword)

app.get("*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"))
})

// Google login
app.get("/api/v1/google/login", googleLogin)

// Google register
app.get("/api/v1/google/login", googleRegistration)

//making database connection
mongoose.connect(mongoDbUrl).then(() => {
    console.log("Connected to local instance of MonogoDB")
    app.listen(port, () => console.log("Listening on port: ", port))
}).catch((error: unknown) => {
    const err = error as Error
    console.log(err.message)
})