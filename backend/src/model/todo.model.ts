import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin"],
        default: "user"

    },
    password: {
        type: String,
        required: true,
    },
    displayPicture: {
        type: String,
        default: "https://picsum.photos/seed/picsum/200/300" //random public url of an image 
    }
}, { timestamps: true })


const TodoItemSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })


const UsersTodoListSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    todoList: [TodoItemSchema]
})


const User = mongoose.model("User", UserSchema, "users")
const UsersTodoList = mongoose.model("UserTodoList", UsersTodoListSchema, "usersTodoLists")
export { User, UsersTodoList }