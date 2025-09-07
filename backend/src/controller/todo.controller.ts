import Todo from "../model/todo.model.js"
import zod from "zod"
import type { Request, Response } from "express"


const addTodoItem = async (req: Request, res: Response) => {

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

}


const getTodoList = async (req: Request, res: Response) => {


    //validation
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

        let todoList
        if (limit == "-1") {
            //no limit on query result
            todoList = await Todo.find({}).sort({ createdAt: 1 })
        } else {
            //set limit on query result
            todoList = await Todo.find({}).sort({ createdAt: 1 }).limit(parseInt(limit))
        }

        setTimeout(() => {
            return res.status(200).json(todoList)
        }, 200)

    } catch (error) {
        const err = error as Error
        console.log(err.message)
        return res.status(500).json({ message: "Database error." })
    }
}


const editTodoItem = async (req: Request, res: Response) => {

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
}


const deleteTodoItem = async (req: Request, res: Response) => {

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
}


const search = async (req: Request, res: Response) => {

    const QueryShape = zod.object({
        key: zod.string()
    })

    const QueryValidation = QueryShape.safeParse(req.query)

    if (!QueryValidation.success) {
        return res.status(400).json({ message: "Invalid query param" })
    }

    try {
        const searchKey = req.query.key
        console.log(searchKey)

        const ret = await Todo.find({ text: { $regex: searchKey, $options: "i" } })

        if (ret != null) {
            res.status(200).json(ret)
        } else {
            res.status(404).json({ message: "_id not found." })
        }
    } catch (error) {
        const err = error as Error
        console.log(err.message)
        res.status(500).json({ message: "Database error" })
    }

}
export {
    addTodoItem,
    getTodoList,
    editTodoItem,
    deleteTodoItem,
    search
}