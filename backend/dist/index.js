import mongoose from "mongoose";
import express from "express";
import Todo from "./model/todo.model.js";
import zod from "zod";
import cors from "cors";
import dotenv from "dotenv";
import { addTodoItem } from "./Controller/todo.controller.js";
dotenv.config();
const port = 8080;
const app = express();
//adding middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.allowedOrigin
}));
app.post("/todo-api/user/addTodoItem", addTodoItem);
app.get("/todo-api/user/getTodoList", async (req, res) => {
    //validation
    const QueryShape = zod.object({
        limit: zod.coerce.bigint()
    });
    const QueryShapeValidation = QueryShape.safeParse(req.query);
    if (!QueryShapeValidation.success) {
        return res.status(400).json({ message: "Invalid query param." });
    }
    //request processing
    try {
        const limit = req.query.limit; //asserts limit key's type as string
        let todoList;
        if (limit == "-1") {
            //no limit on query result
            todoList = await Todo.find({}).sort({ createdAt: 1 });
        }
        else {
            //set limit on query result
            todoList = await Todo.find({}).sort({ createdAt: 1 }).limit(parseInt(limit));
        }
        setTimeout(() => {
            return res.status(200).json(todoList);
        }, 200);
    }
    catch (error) {
        const err = error;
        console.log(err.message);
        return res.status(500).json({ message: "Database error." });
    }
});
app.patch("/todo-api/user/editTodoItem", async (req, res) => {
    //validation
    const QueryShape = zod.object({
        _id: zod.string()
    });
    const BodyShape = zod.object({
        text: zod.string()
    });
    const QueryValidation = QueryShape.safeParse(req.query);
    const BodyValidation = BodyShape.safeParse(req.body);
    if (!QueryValidation.success) {
        res.status(400).json({ message: "Invalid query param" });
    }
    if (!BodyValidation.success) {
        res.status(400).json({ message: "Invalid JSON payload on body." });
    }
    //request processing
    try {
        const ret = await Todo.findByIdAndUpdate(req.query._id, req.body);
        if (ret != null) {
            res.status(200).json({ message: "success" });
        }
        else {
            res.status(404).json({ message: "_id not found." });
        }
    }
    catch (error) {
        const err = error;
        console.log(err.message);
        res.status(500).json({ message: "Database error" });
    }
});
app.delete("/todo-api/user/deleteTodoItem", async (req, res) => {
    const QueryShape = zod.object({
        _id: zod.string()
    });
    const QueryValidation = QueryShape.safeParse(req.query);
    if (!QueryValidation.success) {
        return res.status(400).json({ message: "Invalid query param" });
    }
    try {
        const ret = await Todo.findByIdAndDelete(req.query._id, req.body);
        if (ret != null) {
            res.status(200).json({ message: "success" });
        }
        else {
            res.status(404).json({ message: "_id not found." });
        }
    }
    catch (error) {
        const err = error;
        console.log(err.message);
        res.status(500).json({ message: "Database error" });
    }
});
//search
//done
app.get("/todo-api/user/search", async (req, res) => {
    const QueryShape = zod.object({
        key: zod.string()
    });
    const QueryValidation = QueryShape.safeParse(req.query);
    if (!QueryValidation.success) {
        return res.status(400).json({ message: "Invalid query param" });
    }
    try {
        const searchKey = req.query.key;
        console.log(searchKey);
        const ret = await Todo.find({ text: { $regex: searchKey, $options: "i" } });
        if (ret != null) {
            res.status(200).json(ret);
        }
        else {
            res.status(404).json({ message: "_id not found." });
        }
    }
    catch (error) {
        const err = error;
        console.log(err.message);
        res.status(500).json({ message: "Database error" });
    }
});
mongoose.connect("mongodb://myUserAdmin:admin@localhost:27017/todo?authSource=admin").then(() => {
    console.log("Connected to local instance of MonogoDB");
    app.listen(port, () => console.log("Listening on port: ", port));
}).catch((error) => {
    const err = error;
    console.log(err.message);
});
//# sourceMappingURL=index.js.map