import { useState } from "react"
import { useNavigate } from 'react-router'
import zod from "zod"

const url = import.meta.env.VITE_url2


export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState({ message: "Error message", happened: false })

    const navigate = useNavigate()

    async function handleLogin() {

        const response = await fetch(`${url}/login`, {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            method: "POST",
            body: JSON.stringify({ email, password })
        })

        if (!response.ok) {
            switch (response.status) {
                case 400:
                    return console.log("Server: HTTP body from client doesn't comply with the expected shape.")
                case 403:
                    return setError({ message: "Incorrect password", happened: true })
                case 404:
                    return setError({ message: "Email not registered", happened: true })
                case 500:
                    return setError({ message: "Problem in server", happened: true })
                default:
                    return setError({ message: "Unknown response from server", happened: true })
            }
        }
        if (response.ok) {
            return navigate("/", { replace: true, viewTransition: true })
        }

        // validation
        const ResponseShape = zod.object({
            message: zod.string(),
        })
        const result = ResponseShape.safeParse(ResponseShape)

        if (!result.success) {
            throw Error("Invalid json from the server")
        }
    }

    return (
        <div className="w-[97vw] sm:w-fit h-fit flex flex-col gap-4 p-5 font-sans border-[1px] border-solid shadow-2xl rounded-2xl transition-all">
            <div className="font-mono font-black text-3xl text-blue-500 drop-shadow-md mb-6">
                <p className="drop-shadow-md hover:drop-shadow-2xl">Login</p>
                {error.happened ? <span className="text-red-500 ml-8 font-sans font-medium text-sm">{error.message}</span> : ""}
            </div>
            <div className="flex flex-col gap-6">

                <div className="flex justify-between">
                    <label className="self-center">Email</label>
                    <input
                        className="h-[31px] w-64 ml-2 pl-2 border-solid border-blue-400 border-[1px] rounded-2xl focus:shadow-inner outline-none transition-colors "
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setError({ message: "", happened: false })}
                    />
                </div>
                <div className="flex justify-between">
                    <label className="self-center">Password</label>
                    <input
                        className="h-[31px] w-64 ml-3 pl-2 border-solid border-blue-400 border-[1px] rounded-2xl focus:shadow-inner outline-none transition-colors "
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setError({ message: "", happened: false })}
                    />
                </div>

                <div className="w-full flex justify-between items-center mt-3">
                    <div className="mt-[2px] flex gap-2 ">
                        <input id="remember-me" type="checkbox" onClick={() => { alert("This feature is under construction &#128517;") }} />
                        <label htmlFor="remember-me" className="text-blue-500">Remember me</label>
                    </div>
                    <a
                        className="flex justify-end text-blue-500"
                        href={"/changePassword"}
                    >
                        Forgot password?
                    </a>
                </div>
                <button
                    className=" w-20 self-center bg-white border-blue-500 rounded-xl border-[1px] p-1 px-3 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                    onClick={handleLogin}
                >
                    Login
                </button>
                <span className="w-full flex justify-center ">
                    <button
                        className="text-blue-500 hover:underline"
                        onClick={() => {
                            navigate("/register")
                        }}
                    >
                        Don't have account?
                    </button>
                </span>
            </div>
        </div>
    )
}