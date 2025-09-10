import { useState } from "react"
import LoadingSpinner from "../LoadingSpinner"
import { useNavigate } from "react-router"


const url = import.meta.env.VITE_url2


type TextArea = {
    disabled: boolean
    updatePending: boolean
    buttonText: string | JSX.Element
}


function TodoItem({ text, uuid, removeTodoItem }: { text: string, uuid: string, removeTodoItem: (uuid: string) => void }) {

    let [id] = useState(uuid)
    let [newText, setNewText] = useState(text)
    let [textArea, setTextArea] = useState<TextArea>({ disabled: true, updatePending: false, buttonText: "edit" })
    let [status, setStatus] = useState(0)
    let navigate = useNavigate()

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
        <div className=" w-full h-fit flex flex-row w-30 gap-2 p-1 bg-purple-300 shadow-inner rounded-md" >
            <textarea className="w-full resize-none min-h-12 text-wrap overflow-y-auto overflow-x-hidden p-2 rounded-2xl border-none disabled:text-black bg-white disabled:bg-purple-100 outline-purple-700 "
                value={newText}
                onChange={(e) => { setNewText(e.target.value) }}
                disabled={textArea.disabled}
            >
            </textarea>

            <div className="flex flex-col justify-center gap-2 bg-transparent rounded-2xl ">
                <button
                    className="h-6 self-center w-full text-purple-800 border-purple-500 rounded-md hover:bg-purple-500 hover:text-white active:text-black transition-colors"
                    onClick={() => {
                        removeTodoItem(id)
                    }}>
                    Remove
                </button>

                <button
                    className="h-6 self-center w-full text-purple-800 border-purple-500 rounded-md hover:bg-purple-500 hover:text-white active:text-black"
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