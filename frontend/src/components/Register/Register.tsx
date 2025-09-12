import { useState } from "react"
import zod from "zod"

const url = import.meta.env.VITE_url2

export default function Register() {

    let [firstname, setFirstname] = useState("")
    let [lastname, setLastname] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [cpassword, setCpassword] = useState("")
    const [error, setError] = useState({ message: "your message", happened: false })
    let [registered, setRegistered] = useState(false)

    async function handleSubmit() {
        // password validaton
        if (password !== cpassword) {
            return setError({ message: "Password didn't match", happened: true })
        }

        // POST form data
        const response = await fetch(`${url}/register`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(
                {
                    firstname,
                    lastname,
                    email,
                    password
                }
            )
        })

        if (!response.ok) {
            switch (response.status) {
                case 400:
                    return console.log("Server: HTTP body from client doesn't comply with the expected shape.")
                case 409:
                    return setError({ message: "Email already taken.", happened: true })
                case 500:
                    return setError({ message: "Problem in server", happened: true })
                default:
                    return setError({ message: "Unknown response from server", happened: true })
            }
        }

        setRegistered(response.ok)

    }
    if (!registered) return (
        <div className="w-fit h-fit flex flex-col gap-5 p-3 font-sans border-1 border-solid border-green-400 shadow-xl rounded-md">
            <div className="h-12 flex flex-col font-mono font-black text-2xl text-green-500">
                Create Account
                {error.happened ? <span className="text-red-500 font-sans text-wrap text-center font-medium text-sm">{error.message}!</span> : ""}
            </div>
            <div className="flex justify-between gap-5">
                <label>Firstname</label>
                <input
                    className="green-input transition-all "
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    onFocus={() => setError({ message: "", happened: false })}
                />
            </div>
            <div className="flex justify-between">
                <label>Lastname</label>
                <input
                    className="green-input transition-all "
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    onFocus={() => setError({ message: "", happened: false })}
                />
            </div>
            <div className="flex justify-between">
                <label>Email</label>
                <input
                    className="green-input transition-all "
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setError({ message: "", happened: false })}
                />
            </div>
            <div className="flex justify-between">
                <label>Password</label>
                <input
                    className="green-input transition-all "
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}

                    onFocus={() => setError({ message: "", happened: false })}
                />
            </div>
            <div className="flex justify-between gap-3">
                <label>Confirm Password</label>
                <input
                    className="green-input transition-all "
                    type="password"
                    value={cpassword}
                    onChange={(e) => setCpassword(e.target.value)}
                    onFocus={() => setError({ message: "", happened: false })}
                />
            </div>
            <button
                className="w-20 self-center mt-4 mb-4 bg-white border-green-500 rounded-xl border-1 p-1 px-3 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    )
    else return <div className="text-center text-2xl text-green-500">Your account has been registered. Goto <a href="/">home</a> page</div>
}