import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import TodoItem from "../TodoItem"


//type definitions
type TodoItem = {
    id: string
    jsxElement: JSX.Element
    removeTodoItem: (id: string) => void
}

function App(): JSX.Element {
    let [inputText, setInputText] = useState("")
    let [list, setList] = useState<TodoItem[]>([])


    //Working
    //Bug: Remove is removing all the items from the list
    function removeTodoItem(id: string) {
        setList(prev => {
            const newList = prev.filter((item) => {
                return item.id == id ? false : true
            })
            return newList
        })
    }


    //Done.
    function addTodoItem(text: string) {
        if (text.trim() != "") {
            const uniqueString = uuidv4()
            const todoItem: TodoItem = {
                id: uniqueString,
                jsxElement: <TodoItem key={uniqueString} text={text} uuid={uniqueString} removeTodoItem={removeTodoItem} />,
                removeTodoItem: removeTodoItem
            }
            setList(prev => {
                return [...prev, todoItem]
            })
        }

    }


    function List(): JSX.Element[] {
        const jsxArray: JSX.Element[] = list.map((item) => {
            return item.jsxElement
        })
        return jsxArray
    }


    return (
        <div className="h-fit w-fit flex flex-col font-serif gap-2 " >
            <div className="flex gap-2 ">
                <input
                    className="w-full"
                    value={inputText}
                    type="text"
                    onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            addTodoItem(inputText)
                            setInputText(() => {
                                return ""
                            })
                        }
                    }}
                    onChange={(e) => {
                        setInputText(e.target.value)
                    }}
                />
                <button
                    className="mr-[-0px]"
                    onClick={() => {
                        addTodoItem(inputText)
                        setInputText("")
                    }}>
                    Add
                </button>
            </div>
            <div className="h-96 w-80 flex flex-col items-center overflow-y-auto overflow-x-hidden gap-2 p-2 border border-solid shadow-lg">
                <List />
            </div>
            <button>Load More</button>
        </div>

    )
}
export default App