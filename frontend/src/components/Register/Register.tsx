import { useState } from "react"


export default function Register() {

    let [fname, setFname] = useState("")
    let [lname, setLname] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [cpassword, setCpassword] = useState("")

    function handleRegister() {
        if (password == cpassword) {
            alert("Registered")
        }
    }

    return (
        <div className="w-fit h-fit flex flex-col gap-5 p-5 border border-solid rounded-md shadow-xl">
            <p className="absolute font-mono font-black text-2xl top-[110px] left-[585px] ">Register</p>
            <div className="flex justify-between gap-5">
                <label>Firstname</label>
                <input
                    type="text"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                />
            </div>
            <div className="flex justify-between">
                <label>Lastname</label>
                <input
                    type="text"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                />
            </div>
            <div className="flex justify-between">
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="flex justify-between">
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="flex justify-between gap-3">
                <label>Confirm Password</label>
                <input
                    type="password"
                    value={cpassword}
                    onChange={(e) => setCpassword(e.target.value)}
                />
            </div>
            <button
                className="w-fit self-center mt-4"
                onClick={handleRegister}
            >Register</button>
        </div>
    )
}