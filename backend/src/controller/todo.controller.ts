import { User, TodoList } from "../model/todo.model.js"
import zod from "zod"
import bcrypt from "bcrypt"
import type { Request, Response } from "express"


//working:
const addTodoItem = async (req: Request, res: Response) => {

    // authentication
    if (!req.session.authenticated) {
        return res.status(400).json({ message: "Session not found. Auth required." })
    }

    //payload(Body) validation
    const TodoItemShape = zod.object({
        email: zod.email({ pattern: zod.regexes.html5Email }),
        _id: zod.string(),
        text: zod.string(),
    })

    const result = TodoItemShape.safeParse(req.body)

    if (!result.success) {
        return res.status(400).json({ message: "Invalid json/data." })
    }

    //request processing
    try {
        const todoList = await TodoList.findOne({ email: req.body.email })
        if (todoList !== null) {
            console.log(todoList)
        } else {
            console.log("Didn't find entry for:", req.body.email)
        }
        // res.status(200).json({ message: "success" })
        res.send()
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


const login = async (req: Request, res: Response) => {

    // validation
    const BodyShape = zod.object({
        email: zod.email(),
        password: zod.string()
    })

    const BodyValidation = BodyShape.safeParse(req.body)

    if (!BodyValidation.success) {
        return res.status(400).json({ message: "Invalid JSON payload." })
    }

    // request handling
    try {

        req.session.authenticated ? console.log("Already logged in") : console.log("First time login")

        let queryResult = await User.findOne({ email: req.body.email })

        if (queryResult !== null) {

            const match = await bcrypt.compare(req.body.password, queryResult.password)

            if (!match) {
                // 403:forbidden
                res.status(403).json({ message: "Incorrect password!" })
            } else {

                const { firstname, lastname, email, displayPicture } = queryResult
                const userSessionData = { firstname, lastname, email, displayPicture }

                req.session.user = userSessionData
                req.session.authenticated = true

                res.status(200).json({ message: "success" })

            }

        } else {

            //404: resource not found
            res.status(404).json({ message: "Email not registered." })

        }

    } catch (error) {

        const err = error as Error
        console.log(err.message)
        res.status(500).json({ message: "Database error" })

    }
}


//done
const register = async (req: Request, res: Response) => {

    const BodyShape = zod.object({
        firstname: zod.string(),
        lastname: zod.string(),
        email: zod.email(),
        password: zod.string()
    })

    const BodyValidation = BodyShape.safeParse(req.body)

    if (!BodyValidation.success) {
        return res.status(400).json({ message: "Invalid JSON payload." })
    }

    try {

        let queryResult = await User.findOne({ email: req.body.email })

        if (queryResult === null) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = new User({ ...req.body, password: hashedPassword })
            const todoList = new TodoList({
                email: req.body.email,
                todoList: []
            })
            await user.save()
            await todoList.save()
            res.status(200).json({ message: "success" })
        } else {
            //409: conflicting resource
            res.status(409).json({ message: "Email already registered" })
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
    search,
    login,
    register
}