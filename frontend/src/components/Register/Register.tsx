import { useState } from "react"

const url = import.meta.env.VITE_url2

export default function Register() {

    // state hooks
    const [firstname, setFirstname] = useState("Sanskar")
    const [lastname, setLastname] = useState("Bhusal")
    const [email, setEmail] = useState("sanskarbhusal123@gmail.com")
    const [password, setPassword] = useState("admin")
    const [cpassword, setCpassword] = useState("admin")
    const [error, setError] = useState({ message: "your message", happened: false })
    const [registered, setRegistered] = useState(false)

    async function handleSubmit() {
        // password validaton
        if (password !== cpassword) {
            return setError({ message: "Password didn't match", happened: true })
        }

        // POST form data
        const response = await fetch(`${url}/register`, {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
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
        <div className="w-fit h-fit flex flex-col gap-4 p-5 font-sans border-[1px] border-solid shadow-2xl rounded-2xl transition-all">
            <div className="font-mono font-black text-3xl text-blue-500 drop-shadow-md mb-5">
                <p className="drop-shadow-md hover:drop-shadow-2xl">Create Account</p>
                {error.happened ? <span className="text-red-500 font-sans text-wrap text-center font-medium text-sm">{error.message}!</span> : ""}
            </div>
            <div className="flex justify-between gap-5">
                <label>Firstname</label>
                <input
                    className="h-[31px] pl-2 border-solid border-blue-400 border-[1px] rounded-2xl focus:shadow-inner outline-none transition-colors "
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    onFocus={() => setError({ message: "", happened: false })}
                />
            </div>
            <div className="flex justify-between">
                <label>Lastname</label>
                <input
                    className="h-[31px] pl-2 border-solid border-blue-400 border-[1px] rounded-2xl focus:shadow-inner outline-none transition-colors "
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    onFocus={() => setError({ message: "", happened: false })}
                />
            </div>
            <div className="flex justify-between">
                <label>Email</label>
                <input
                    className="h-[31px] pl-2 border-solid border-blue-400 border-[1px] rounded-2xl focus:shadow-inner outline-none transition-colors "
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setError({ message: "", happened: false })}
                />
            </div>
            <div className="flex justify-between">
                <label>Password</label>
                <input
                    className="h-[31px] pl-2 border-solid border-blue-400 border-[1px] rounded-2xl focus:shadow-inner outline-none transition-colors "
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}

                    onFocus={() => setError({ message: "", happened: false })}
                />
            </div>
            <div className="flex justify-between gap-3">
                <label>Confirm Password</label>
                <input
                    className="h-[31px] pl-2 border-solid border-blue-400 border-[1px] rounded-2xl focus:shadow-inner outline-none transition-colors "
                    type="password"
                    value={cpassword}
                    onChange={(e) => setCpassword(e.target.value)}
                    onFocus={() => setError({ message: "", happened: false })}
                />
            </div>
            <button
                className="w-20 self-center mt-4 mb-4 bg-white border-blue-500 rounded-xl border-[1px] p-1 px-3 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    )
    else return <div className="text-center text-2xl text-green-500">Your account has been registered. Goto <a href="/">home</a> page</div>
}