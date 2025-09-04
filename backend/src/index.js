const express = require("express")
const mongoose = require("mongoose")
const Product = require("./model/product.model.js")


port = 8080
const app = express()


app.use(express.json())

app.get("/", (req, res) => {
    res.send("Namaste")
})


//add a product
app.post("/api/products", async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).send(product)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})


//get all product
app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find({})
        res.status(200).json(products)
    } catch (err) {
        res.status(500).send({ message: err.message })
        console.log({ message: err.message })
    }
})


//get a product
app.get("/api/product/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).send({ message: error.message })
        console.log({ message: error.message })
    }

})


//update a product
app.put("/api/product/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body)
        if (!product) {
            return res.status(500).json({ message: "Product not found." })
        }
        const updatedProduct = await Product.findById(req.params.id)
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).send({ message: error.message })
        console.log({ message: error.message })
    }
})


//delete a product
app.delete("/api/product/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) {
            return res.status(500).json({ message: "Product not found." })
        }
        res.status(200).json({ message: "Product deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


mongoose.connect("mongodb://myUserAdmin:admin@localhost:27017/todo?authSource=admin")
    .then(() => {
        console.log("Connected to the database.")
        app.listen(port, () => console.log("Listening on port: ", port))
    })
    .catch(() => console.log("Connection failed!"))
