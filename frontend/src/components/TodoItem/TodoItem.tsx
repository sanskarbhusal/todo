import { useState, useContext } from "react"
import LoadingSpinner from "../LoadingSpinner"
import { useNavigate } from "react-router"


const url = import.meta.env.VITE_url2


type TextArea = {
    disabled: boolean
    updatePending: boolean
    buttonText: string | JSX.Element
}


function TodoItem({ text, uuid, html_id, removeTodoItem }: { text: string, uuid: string, html_id: string, removeTodoItem: (uuid: string) => void }) {

    const [id] = useState(uuid)
    const [newText, setNewText] = useState(text)
    const [textArea, setTextArea] = useState<TextArea>({ disabled: true, updatePending: false, buttonText: "edit" })
    const [status, setStatus] = useState(0)
    const navigate = useNavigate()
    // const [theme, setTheme] = useState({})

    // const themeContext = useContext(theme)

    async function handleUpdateText() {

        const response = await fetch(`${url}/editTodoItem?_id=${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: newText }),
            credentials: "include"
        })

        try {
            if (!response.ok) {
                switch (response.status) {
                    case 500:
                        setStatus(500)
                        throw Error(status.toString())
                    case 400:
                        setStatus(400)
                        throw Error(status.toString())
                    case 403:
                        navigate("/login")
                        break
                    default:
                        throw Error("Didn't get any status code while updating todo text")
                }
            }

            setTextArea(prev => ({ ...prev, updatePending: false, buttonText: "edit" }))

        } catch (error) {
            const err = error as Error
            console.log(err.message)
        }
    }

    return (
        <div className=" w-full h-fit flex flex-row w-30 gap-2 p-1 bg-blue-300 shadow-inner rounded-md"
            id={html_id}
        >
            <textarea className="w-full resize-none min-h-12 text-wrap overflow-y-auto overflow-x-hidden p-2 rounded-2xl border-none disabled:text-black bg-white disabled:bg-gray-100 outline-blue-700 "
                value={newText}
                onChange={(e) => { setNewText(e.target.value) }}
                disabled={textArea.disabled}
            >
            </textarea>

            <div className="flex flex-col justify-center gap-2 bg-transparent rounded-2xl ">
                <button
                    className="h-6 pl-2 pr-2 self-center w-full text-red-800 border-red-500 rounded-md hover:bg-red-500 bg-white hover:text-white active:text-black transition-colors"
                    onClick={() => {
                        removeTodoItem(id)
                    }}>
                    Remove
                </button>

                <button
                    className="h-6 self-center w-full text-green-800 border-blue-500 rounded-md bg-white hover:bg-blue-500 hover:text-white active:text-black"
                    onClick={() => {
                        setTextArea((prev) => {
                            if (prev.disabled) {
                                return { ...prev, disabled: false, buttonText: "update" }
                            } else {
                                handleUpdateText()
                                return { ...prev, disabled: true, updatePending: true }
                            }
                        })
                    }}>
                    {!textArea.updatePending ? textArea.buttonText : <LoadingSpinner size={15} />}
                </button>

            </div>

        </div>
    )
}
export default TodoItem