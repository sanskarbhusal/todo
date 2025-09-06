import mongoose from "mongoose"
const TodoSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Todo = mongoose.model("Todo", TodoSchema)
export default Todo