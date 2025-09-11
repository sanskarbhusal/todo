import { useState, useEffect, useRef } from "react"
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

    // state hooks
    const [todoText, setTodoText] = useState("")
    const [searchText, setSearchText] = useState("")
    const [list, setList] = useState<TodoItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchClicked, setSearchClicked] = useState(false)
    const [searching, setSearching] = useState(false)
    const [outsideClicked, setOutsideClicked] = useState(false)
    const [status, setStatus] = useState(0)
    const [loadLimit, setLoadLimit] = useState(4)
    const navigate = useNavigate()

    // effect hooks
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

                // validation
                const TodoItemShape = zod.looseObject({
                    _id: zod.string(),
                    text: zod.string(),
                })

                const ResponseShape = zod.array(TodoItemShape)
                const ResponseValidation = ResponseShape.safeParse(responseJSON)

                if (!ResponseValidation.success) {
                    throw Error("Invalid json from the server")
                }

                // svaing fetched data
                setLoading(false)
                if (!searchClicked) {
                    setList(responseJSON)
                } else {

                }

            } catch (error) {
                setLoading(false)
                navigate("/login")
            }
        })()
    }, [loadLimit])

    useEffect(() => {
        if (list.length !== 0 && !searching) {
            const el = document.getElementById(list[list.length - 1]._id)
            if (el !== null) {
                el.scrollIntoView({ behavior: "auto" })
            }
        }
    }, [list])

    useEffect(() => {
        (async () => {
            const response = await fetch(`${url}/search?key=${searchText}`, {
                method: "GET",
                credentials: "include"
            })

            if (response.ok) {
                //
                // validation
                const responseJSON = await response.json()
                const ResponseShape = zod.array(
                    zod.looseObject({
                        _id: zod.string(),
                        text: zod.string()
                    }
                    )
                )
                const result = ResponseShape.safeParse(responseJSON)

                if (result.success) {
                    //update state
                    setList(responseJSON)
                } else {
                    console.log("Invalid response for search query from server.")
                }
            }
        })()
    }, [searching])

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
        <div className="h-fit w-fit flex flex-col font-serif gap-4 " >
            <div className="flex">
                <input
                    className="w-full h-7 text-center border-1 border-solid border-purple-500 outline-purple-500 bg-white shadow-inner shadow-purple-200 rounded-full"
                    placeholder="Start typing to search"
                    type="text"
                    value={searchText}
                    onClick={() => {
                        setSearchClicked(true)
                    }}
                    onChange={(e) => {
                        setSearchText(e.target.value)
                        setSearching(true)
                    }}
                />
            </div>
            <div className="h-96 w-96 flex flex-col items-center overflow-y-auto overflow-x-hidden gap-[14px] p-[14px] border-1 border-solid border-purple-500 shadow-inner shadow-purple-300 rounded-md"
            >
                {
                    loading ? <LoadingSpinner size={30} className="text-purple-400" /> : list.map((item) => {
                        return <TodoItem key={item._id} text={item.text} uuid={item._id} html_id={item._id} removeTodoItem={removeTodoItem} />

                    })
                }
            </div>

            <div className="flex gap-2 ">
                <input
                    className="w-full h-7 pl-4 border-1 border-solid border-purple-500 outline-purple-500 bg-white shadow-inner shadow-purple-200 rounded-full"
                    value={todoText}
                    placeholder="Add todo"
                    type="text"
                    onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            addTodoItem(todoText)
                            setTodoText(() => {
                                return ""
                            })
                        }
                    }}
                    onChange={(e) => {
                        setTodoText(e.target.value)
                    }}
                />
            </div>
            <button
                className="w-[30%] h-7 self-center font-semibold font-sans border-purple-400 rounded-full bg-white active:bg-purple-400 active:text-white hover:shadow-xl"
                onClick={() => {
                    setLoadLimit(prev => { return prev + 4 })
                }}
            >
                Load More
            </button>

        </div>

    )
}
export default App