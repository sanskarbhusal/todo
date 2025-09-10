import { useState } from "react"

export default function Login() {

    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")

    function handleLogin() {
        alert(email)
        alert(password)
    }

    return <div className="w-fit h-fit flex flex-col gap-5 p-5 border border-solid shadow-xl rounded-md">
        <p className="absolute font-mono font-black text-2xl top-[150px] left-[600px] ">Login</p>
        <div className="flex justify-between gap-5">
            <label>Email</label>
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div className="flex justify-between gap-5">
            <label>Password</label>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <button
            className="w-fit self-center mt-4"
            onClick={handleLogin}
        >Login</button>
        <span className="w-full flex justify-center">
            <a href={"register"}>Don't have account?</a>
        </span>
    </div>
}