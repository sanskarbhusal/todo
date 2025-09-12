import { useState, useEffect, useRef, type HTMLAttributes, type HTMLInputTypeAttribute } from "react"
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
    const [searchFocused, setSearchFocused] = useState(false)
    const [searching, setSearching] = useState(false)
    const [loadLimit, setLoadLimit] = useState(4)
    const navigate = useNavigate()

    // ref hook
    const searchBoxRef = useRef<HTMLInputElement>(null)

    // effect hooks
    useEffect(() => {
        let ignore = false;
        (async () => {
            // event listener to handle search box focus
            document.addEventListener("click", (e) => {
                if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node) && !ignore) {
                    setSearchFocused(false)
                    setSearching(false)
                }
            })

            try {
                const response = await fetch(`${url}/getTodoList?limit=${loadLimit}`, {
                    method: "GET",
                    credentials: "include"
                })

                if (!response.ok) {
                    console.log(await response.json())
                    switch (response.status) {
                        case 400:
                            throw Error("400")
                        case 403:
                            navigate("/login")
                            break
                        case 500:
                            throw Error("500")
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
                if (!searchFocused) {
                    setList(responseJSON)
                } else {
                    setList([])
                }

            } catch (error) {
                setLoading(false)
                navigate("/login")
            }
        })();

        return () => {
            ignore = true
        }

    }, [loadLimit, searchFocused])

    useEffect(() => {
        if (searching) {
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
                        setLoading(false)
                        setList(responseJSON)
                        setSearching(false)
                    } else {
                        console.log("Invalid response for search query from server.")
                    }
                }
            })()
        }
    }, [searchText])

    useEffect(() => {
        if (!searchFocused && list.length > 0) {
            const el = document.getElementById(list[list.length - 1]._id)
            if (el !== null) {
                el.scrollIntoView({ behavior: "auto" })
            }
        }
    }, [list])


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
                        throw Error("500")
                    case 400:
                        throw Error("400")
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
                            throw Error("500")
                        case 400:
                            throw Error("400")
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
        <div className="h-fit w-fit flex flex-col font-sans gap-4 drop-shadow-md" >
            <input
                className="h-9 w-full text-center border-solid border-blue-400 border-[1px] rounded-2xl focus:shadow-inner outline-none transition-colors "
                placeholder="Search"
                ref={searchBoxRef}
                type="text"
                value={searchText}
                onClick={() => {
                    setSearchFocused(true)
                }}
                onChange={(e) => {
                    setSearchText(e.target.value)
                    setSearching(true)
                    setLoading(true)
                }}
            />
            <div className="h-96 w-96 flex flex-col bg-transparent items-center overflow-y-auto overflow-x-hidden gap-[14px] p-[14px] font-sans border-[1px] border-solid shadow-md rounded-2xl transition-all drop-shadow-xl "
            >
                {
                    loading ? <LoadingSpinner size={30} className="text-blue-400" /> : list.map((item) => {
                        return <TodoItem key={item._id} text={item.text} uuid={item._id} html_id={item._id} removeTodoItem={removeTodoItem} />

                    })
                }

                {
                    !searching && list.length == 0 ? <p className="z-10 h-full w-full flex justify-center items-center text-gray-600">Start typing to search</p> : ""

                }
            </div>
            <input
                className="h-9 w-full pl-3 border-solid border-blue-400 border-[1px] rounded-2xl focus:shadow-inner outline-none transition-colors "
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
            <button
                className=" w-fit self-center bg-white border-blue-500 rounded-xl border-[1px] p-1 px-3 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
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