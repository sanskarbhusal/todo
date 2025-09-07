import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import {
    addTodoItem,
    getTodoList,
    editTodoItem,
    deleteTodoItem,
    search
} from "./controller/todo.controller.js"


dotenv.config()
const port = 8080
const app = express()


//middlewares
app.use(express.json())
app.use(cors({
    origin: process.env.allowedOrigin
}))


// add todo
app.post("/todo-api/user/addTodoItem", addTodoItem)

// get todo list
app.get("/todo-api/user/getTodoList", getTodoList)

// edit text of todo item
app.patch("/todo-api/user/editTodoItem", editTodoItem)

// remove a todo item
app.delete("/todo-api/user/deleteTodoItem", deleteTodoItem)

// search todo items
app.get("/todo-api/user/search", search)


//making database connection
mongoose.connect("mongodb://myUserAdmin:admin@localhost:27017/todo?authSource=admin").then(() => {
    console.log("Connected to local instance of MonogoDB")
    app.listen(port, () => console.log("Listening on port: ", port))
}).catch((error: unknown) => {
    const err = error as Error
    console.log(err.message)
})