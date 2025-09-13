import { User, UsersTodoList } from "../model/todo.model.js"
import zod from "zod"
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import sendOTP from "../utils/sendOTP.ts"

import type { Request, Response } from "express"

// Working: Prototyping done
const requestNewPassword = async (req: Request, res: Response) => {

    // payload(Body) validation
    const bodyShape = zod.object({
        email: zod.string(),
        newPassword: zod.string()
    })

    const result = bodyShape.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ message: "Invalid json/data." })
    }

    //request processing
    const { email, newPassword } = req.body

    try {
        const user = await User.findOne({ email })

        if (user === null) return res.status(404).json({ message: "Email doesn't exist." })

        const userName = user.firstname

        req.session.email = email
        req.session.newPassword = newPassword
        req.session.OTP = Math.floor(Math.random() * 100000)
        req.session.hasPasswordRequestSession = true

        const otp = await sendOTP(userName, req.session.OTP, email)

        if (!otp.isSent) {
            return res.status(500).json({ message: "something wrong with OTP agent" })
        } else {
            return res.status(200).json({ message: "success" })
        }

    } catch (error) {
        const err = error as Error
        console.log(err.message)
        res.status(500).json({ message: "Database error" })
    }
}


// working: Prototyping done
const authorizeNewPassword = async (req: Request, res: Response) => {
    // payload(Body) validation
    const bodyShape = zod.object({
        OTP: zod.number()
    })

    const result = bodyShape.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ message: "Invalid json/data." })
    }

    // request processing
    const { OTP } = req.body
    //session verification
    if (!req.session.hasPasswordRequestSession) return res.status(403).json({ message: "Please initate new password request first." })
    // OTP verification
    if (OTP !== req.session.OTP) return res.status(401).json({ message: "Wrong OTP" })

    // password updation
    try {
        const user = await User.findOne({ email: req.session.email })
        if (user === null) return res.status(500).json({ message: "Query failed! Possibly a bug." })
        //working
        const hashedPassword = await bcrypt.hash(req.session.newPassword!, 10)
        user.password = hashedPassword
        user.save()
        res.status(200).json({ message: "success" })
    } catch (error) {
        const err = error as Error
        console.log(err.message)
        res.status(500).json({ message: "Database error" })
    }
}


const addTodoItem = async (req: Request, res: Response) => {

    // authentication
    if (!req.session.authenticated) {
        console.log("Session not found!")
        // 403: forbidden
        return res.status(403).json({ message: "Session expired" })
    }

    console.log("Session found")

    // payload(Body) validation
    const TodoItemShape = zod.object({
        text: zod.string(),
    })

    const result = TodoItemShape.safeParse(req.body)

    if (!result.success) {
        return res.status(400).json({ message: "Invalid json/data." })
    }

    //request processing
    const { email } = req.session
    const { text } = req.body

    try {
        const usersTodoList = await UsersTodoList.findOne({ email })
        if (usersTodoList === null) return res.status(500).json({ message: "Query failed! Possibly a bug." })
        const _id = uuidv4()
        usersTodoList.todoList.push({ text, _id })
        await usersTodoList.save()
        res.status(200).json({ message: "success", todo_id: _id })
    } catch (error) {
        const err = error as Error
        console.log(err.message)
        res.status(500).json({ message: "Database error" })
    }
}


const getTodoList = async (req: Request, res: Response) => {

    // authentication
    if (!req.session.authenticated) {
        console.log("Session not found!")
        return res.status(403).json({ message: "Session not found. Auth required." })
    }

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
        const { email } = req.session
        const limit = req.query.limit as string //asserts limit key's type as string

        if (limit <= "0") { // no limit on query

            const usersTodoList = await UsersTodoList.findOne({ email })
            if (usersTodoList === null) return res.status(500).json({ message: "Query failed. Possibly a bug." })
            console.log(usersTodoList.todoList)
            setTimeout(() => {
                res.status(200).json(usersTodoList!.todoList)
            }, 200)

        } else { // limit on query 
            const usersTodoList = await UsersTodoList.findOne({ email })

            setTimeout(() => {
                const queryResult = usersTodoList!.todoList.slice(0, parseInt(limit))
                res.status(200).json(queryResult)
            }, 200)

        }
    } catch (error) {
        const err = error as Error
        console.log(err.message)
        return res.status(500).json({ message: "Database error." })
    }
}


const editTodoItem = async (req: Request, res: Response) => {


    // authentication
    if (!req.session.authenticated) {
        console.log("Session not found!")
        return res.status(403).json({ message: "Session not found. Auth required." })
    }

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
        return res.status(400).json({ message: "Invalid query param" })
    }

    if (!BodyValidation.success) {
        return res.status(400).json({ message: "Invalid JSON payload on body." })
    }

    //request processing
    const { text } = req.body
    const { email } = req.session
    const _id = req.query._id

    try {
        const usersTodoList = await UsersTodoList.findOne({ email })
        if (usersTodoList === null) return res.status(500).json({ message: "Query failed. Possibly a bug" })
        const targetTodo = usersTodoList.todoList.find(item => item._id === _id)
        const indexOfTargetTodo = usersTodoList.todoList.indexOf(targetTodo!)
        usersTodoList.todoList[indexOfTargetTodo].text = text
        await usersTodoList.save()
        res.status(200).json({ message: "success" })
    } catch (error) {
        const err = error as Error
        console.log(err.message)
        res.status(500).json({ message: "Database error" })
    }
}


const deleteTodoItem = async (req: Request, res: Response) => {

    // authentication
    if (!req.session.authenticated) {
        console.log("Session not found!")
        return res.status(403).json({ message: "Session not found. Auth required." })
    }

    // validation
    const QueryShape = zod.object({
        _id: zod.string()
    })
    const QueryValidation = QueryShape.safeParse(req.query)

    if (!QueryValidation.success) {

        return res.status(400).json({ message: "Invalid query param" })
    }

    // request processing
    const { email } = req.session
    const { _id } = req.query

    try {
        const usersTodoList = await UsersTodoList.findOne({ email })
        if (usersTodoList === null) return res.status(500).json({ message: "Query failed. Possibly a bug" })
        const targetTodo = usersTodoList.todoList.find(item => item._id === _id)
        const indexOfTargetTodo = usersTodoList.todoList.indexOf(targetTodo!)
        // splice(2,1) removes 1 element starting from element at index 2
        usersTodoList.todoList.splice(indexOfTargetTodo, 1)
        await usersTodoList.save()
        res.status(200).json({ message: "success" })

    } catch (error) {
        const err = error as Error
        console.log(err.message)
        res.status(500).json({ message: "Database error" })
    }
}

const search = async (req: Request, res: Response) => {

    // authentication
    if (!req.session.authenticated) {
        console.log("Session not found!")
        return res.status(403).json({ message: "Session not found. Auth required." })
    }

    // validation
    const QueryShape = zod.object({
        key: zod.string()
    })
    const QueryValidation = QueryShape.safeParse(req.query)

    if (!QueryValidation.success) {
        return res.status(400).json({ message: "Invalid query param" })
    }

    // request processing
    try {
        const key = req.query.key as string
        const { email } = req.session
        const usersTodoList = await UsersTodoList.findOne({ email })
        if (usersTodoList === null) return res.status(500).json({ message: "Query failed. Possibly a bug" })
        const searchResult = usersTodoList.todoList.filter(item => item.text.toLowerCase().includes(key))
        setTimeout(() => res.status(200).json(searchResult), 100)
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

                req.session.firstname = firstname
                req.session.lastname = lastname
                req.session.email = email

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
            const usersTodoList = new UsersTodoList({
                email: req.body.email,
                todoList: []
            })
            await user.save()
            await usersTodoList.save()
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
    register,
    requestNewPassword,
    authorizeNewPassword
}