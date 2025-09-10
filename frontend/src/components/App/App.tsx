import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { v4 as uuidv4 } from "uuid"
import TodoItem from "../TodoItem"
import LoadingSpinner from "../LoadingSpinner"
import zod from "zod"

const url = import.meta.env.VITE_url2


//type definitions
type TodoItem = {
    _id: string
    text: string
}


function App(): JSX.Element {
    let [inputText, setInputText] = useState("")
    let [list, setList] = useState<TodoItem[]>([])
    let [loading, setLoading] = useState(true)
    let [status, setStatus] = useState(0)
    let [loadLimit, setLoadLimit] = useState(4)
    let navigate = useNavigate()

    useEffect(() => {

        (async () => {
            try {
                const response = await fetch(`${url}/getTodoList?limit=${loadLimit}`, {
                    method: "GET",
                    credentials: "include"
                })

                if (!response.ok) {
                    console.log(await response.json())
                    switch (response.status) {
                        case 400:
                            setStatus(400)
                            throw Error(status.toString())
                        case 403:
                            navigate("/login")
                            break
                        case 500:
                            setStatus(500)
                            throw Error(status.toString())
                        default:
                            console.log("Default case in error response")
                            break
                    }
                }

                const responseJSON = await response.json()

                const TodoItemShape = zod.looseObject({
                    _id: zod.string(),
                    text: zod.string(),
                })

                const ResponseShape = zod.array(TodoItemShape)
                const ResponseValidation = ResponseShape.safeParse(responseJSON)

                if (!ResponseValidation.success) {
                    throw Error("Invalid json from the server")
                }

                setList(responseJSON)
                setLoading(false)

            } catch (error) {
                setLoading(false)
            }
        })()
    }, [loadLimit])

    //working
    async function removeTodoItem(_id: string) {

        const response = await fetch(`${url}/deleteTodoItem?_id=${_id}`, {
            method: "DELETE",
            credentials: "include"
            // headers: {
            //     "Content-Type": "application/json",
            // },
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
                        console.log("Default case in error response")
                }
            }

            setList(prev => {
                const newList = prev.filter((item) => {
                    return item._id === _id ? false : true
                })
                return newList
            })

        } catch (error) {
            const err = error as Error
            console.log(err.message)

        }

    }


    //Done.
    async function addTodoItem(text: string) {
        if (text.trim() != "") {

            const todoItem: TodoItem = {
                _id: uuidv4(),
                text
            }

            const response = await fetch(`${url}/addTodoItem`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(todoItem),
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
                            console.log("Default case in error response")
                    }
                }

                setList(prev => {
                    return [...prev, todoItem]
                })

            } catch (error) {
                const err = error as Error
                console.log(err.message)

            }

        }

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
                {
                    loading ? <LoadingSpinner size={30} /> : list.map((item) => {

                        return <TodoItem key={item._id} text={item.text} uuid={item._id} removeTodoItem={removeTodoItem} />
                    })
                }
            </div>
            <button
                onClick={() => {
                    setLoadLimit(prev => { return prev + 4 })
                }}
            >Load More</button>
        </div>

    )
}
export default App