const express = require("express")
const mongoose = require("mongoose")
const Todo = require("./model/todo.model.cjs")

const port = 8080
const app = express()

app.use(express.json())


//add a product
app.post("/todo-api/add", async (req: any, res: any) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).send(product)
    } catch (error) {
        const err = error as Error
        res.status(500).send({ message: err.message })
    }
})


//get all product
app.get("/api/products", async (req: any, res: any) => {
    try {
        const products = await Product.find({})
        res.status(200).json(products)
    } catch (error) {
        const err = error as Error
        res.status(500).send({ message: err.message })
        console.log({ message: err.message })
    }
})


//get a product
app.get("/api/product/:id", async (req: any, res: any) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (error) {
        const err = error as Error
        res.status(500).send({ message: err.message })
        console.log({ message: err.message })
    }

})


//update a product
app.put("/api/product/:id", async (req: any, res: any) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body)
        if (!product) {
            return res.status(500).json({ message: "Product not found." })
        }
        const updatedProduct = await Product.findById(req.params.id)
        res.status(200).json(updatedProduct)
    } catch (error: unknown) {
        const err = error as Error
        res.status(500).send({ message: err.message })
        console.log({ message: err.message })
    }
})


//delete a product
app.delete("/api/product/:id", async (req: any, res: any) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) {
            return res.status(500).json({ message: "Product not found." })
        }
        res.status(200).json({ message: "Product deleted successfully" })
    } catch (error) {
        const err = error as Error
        res.status(500).json({ message: err.message })
    }
})


mongoose.connect("mongodb://myUserAdmin:admin@localhost:27017/todo?authSource=admin")
    .then(() => {
        console.log("Connected to the database.")
        app.listen(port, () => console.log("Listening on port: ", port))
    })
    .catch(() => console.log("Connection failed!"))
