import mongoose from "mongoose"
import express from "express"
import Todo from "./model/todo.model.js"
import zod from "zod"

const port = 8080
const app = express()

app.use(express.json())


//done
app.post("/todo-api/user/addTodoItem", async (req, res) => {

    const TodoItemShape = zod.object({
        _id: zod.string(),
        text: zod.string(),
    })

    const result = TodoItemShape.safeParse(req.body)

    if (!result.success) {
        return res.status(400).json({ message: "Invalid json/data." })
    }

    try {
        const ret = await Todo.create(req.body)
        res.status(200).json({ message: "success" })
    } catch (error) {
        const err = error as Error
        console.log(err.message)
        res.status(200).json({ message: "Database error" })
    }

})


//done
app.get("/todo-api/user/getTodoList", async (req, res) => {

    const QueryShape = zod.object({
        limit: zod.coerce.bigint()
    })

    const QueryShapeValidation = QueryShape.safeParse(req.query)

    if (!QueryShapeValidation.success) {
        return res.status(400).json({ message: "Invalid query param." })
    }

    //request processing
    try {

        const limit = req.query.limit as string //asserts limit key's type as string
        const todoList = await Todo.find({}).sort({ createdAt: -1 }).limit(parseInt(limit))

        return res.status(200).json(todoList)
    } catch (error) {
        const err = error as Error
        console.log(err.message)
        return res.status(500).json({ message: "Database error." })
    }
})


//done
app.patch("/todo-api/user/editTodoItem", async (req, res) => {

    //validation
    const QueryShape = zod.object({
        _id: zod.string()
    })

    const BodyShape = zod.object({
        text: zod.string()
    })

    const QueryValidation = QueryShape.safeParse(req.query)
    const BodyValidation = BodyShape.safeParse(req.body)

    if (!QueryValidation.success) {
        res.status(400).json({ message: "Invalid query param" })
    }

    if (!BodyValidation.success) {
        res.status(400).json({ message: "Invalid JSON payload on body." })
    }


    //request processing
    try {
        const ret = await Todo.findByIdAndUpdate(req.query._id, req.body)
        if (ret != null) {
            res.status(200).json({ message: "success" })
        } else {
            res.status(404).json({ message: "_id not found." })
        }
    } catch (error) {
        const err = error as Error
        console.log(err.message)
        res.status(500).json({ message: "Database error" })
    }
})


//done
app.delete("/todo-api/user/deleteTodoItem", async (req, res) => {

    console.log(req.query._id)
    const QueryShape = zod.object({
        _id: zod.string()
    })

    const QueryValidation = QueryShape.safeParse(req.query)

    if (!QueryValidation.success) {
        return res.status(400).json({ message: "Invalid query param" })
    }

    try {
        const ret = await Todo.findByIdAndDelete(req.query._id, req.body)
        if (ret != null) {
            res.status(200).json({ message: "success" })
        } else {
            res.status(404).json({ message: "_id not found." })
        }
    } catch (error) {
        const err = error as Error
        console.log(err.message)
        res.status(500).json({ message: "Database error" })
    }
})


mongoose.connect("mongodb://myUserAdmin:admin@localhost:27017/todo?authSource=admin").then(() => {
    console.log("Connected to local instance of MonogoDB")
    app.listen(port, () => console.log("Listening on port: ", port))
}).catch((error: unknown) => {
    const err = error as Error
    console.log(err.message)
})