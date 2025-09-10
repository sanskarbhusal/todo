import { useState } from "react"
import { useNavigate } from 'react-router'
import zod from "zod"

const url = import.meta.env.VITE_url2


export default function Login() {

    const [email, setEmail] = useState("sanskarbhusal123@gmail.com")
    const [password, setPassword] = useState("password123")
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
        <div className="w-fit h-fit flex flex-col gap-4 p-3 pt-0 font-sans border-1 border-solid border-blue-400 shadow-xl rounded-md">
            <p className="font-mono font-black text-xl text-blue-500">
                Login
                {error.happened ? <span className="text-red-500 ml-8 font-sans font-medium text-sm">{error.message}</span> : ""}
            </p>
            <div className="flex flex-col gap-6">

                <div className="flex justify-between">
                    <label>Email</label>
                    <input
                        className="login-input transition-all "
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setError({ message: "", happened: false })}
                    />
                </div>
                <div className="flex justify-between gap-5">
                    <label>Password</label>
                    <input
                        className="login-input transition-all "
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setError({ message: "", happened: false })}
                    />
                </div>

                <button
                    className="w-20 self-center mt-4 border-blue-500 rounded-xl border-1 p-1 px-3 bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                    onClick={handleLogin}
                >
                    Login
                </button>
                <span className="w-full flex justify-center">
                    <a
                        className="text-blue-500 hover:underline"
                        href={"register"}>Don't have account?</a>
                </span>
            </div>
        </div>
    )
}