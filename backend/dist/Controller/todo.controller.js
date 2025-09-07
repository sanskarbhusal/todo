import Todo from "../model/todo.model.js";
import zod from "zod";
const addTodoItem = async (req, res) => {
    const TodoItemShape = zod.object({
        _id: zod.string(),
        text: zod.string(),
    });
    const result = TodoItemShape.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: "Invalid json/data." });
    }
    try {
        const ret = await Todo.create(req.body);
        res.status(200).json({ message: "success" });
    }
    catch (error) {
        const err = error;
        console.log(err.message);
        res.status(200).json({ message: "Database error" });
    }
};
export { addTodoItem };
//# sourceMappingURL=todo.controller.js.map