import { useState } from "react"


function TodoItem({ text, uuid, removeTodoItem }: { text: string, uuid: string, removeTodoItem: (uuid: string) => void }) {


    let [id] = useState(uuid)
    let [newText, setNewText] = useState(text)
    let [textArea, setTextArea] = useState({ readOnly: true, disabled: true })


    return (
        <div className=" w-full h-fit flex flex-row w-30 gap-2 bg-gray-100 shadow-inner border border-solid border-green-500" >
            <textarea className="w-full resize-none min-h-12 text-wrap overflow-y-auto overflow-x-hidden p-1 border-none disabled:text-black "
                value={newText}
                onChange={(e) => { setNewText(e.target.value) }}
                readOnly={textArea.readOnly}
                disabled={textArea.disabled}
            >
            </textarea>

            <div className="flex flex-col gap-1 p-1">
                <button
                    className="h-6 self-center w-full "
                    onClick={() => {
                        removeTodoItem(id)
                    }}>
                    Remove
                </button>

                <button
                    className="h-6 self-center w-full"
                    onClick={() => {
                        setTextArea((prev: typeof textArea) => {
                            switch (prev.readOnly) {
                                case true:
                                    return { readOnly: false, disabled: false }
                                case false:
                                    return { readOnly: true, disabled: true, }
                                default:
                                    return { ...prev }
                            }
                        })
                    }}>
                    {textArea.readOnly ? "edit" : "update"}
                </button>
            </div>

        </div>
    )
}
export default TodoItem