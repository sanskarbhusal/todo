import { useState } from "react"
import { useNavigate } from "react-router"

const url = import.meta.env.VITE_url2

export default function PasswordForm() {

    // state hooks
    const [email, setEmail] = useState("sanskarbhusal123@gmail.com")
    const [password, setPassword] = useState("root")
    const [cpassword, setCpassword] = useState("root")
    const [error, setError] = useState({ message: "your message", happened: false })

    // other hooks
    const navigate = useNavigate()


    async function handleSubmit() {
        // password validaton
        if (password !== cpassword) {
            return setError({ message: "Password didn't match", happened: true })
        }

        // POST form data
        const response = await fetch(`${url}/requestNewPassword`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            credentials: "include",
            body: JSON.stringify(
                {
                    email,
                    newPassword: password
                }
            )
        })

        if (!response.ok) {
            switch (response.status) {
                case 404:
                    return setError({ message: "Email doesn't exist", happened: true })
                case 500:
                    return setError({ message: "Problem in server", happened: true })
                default:
                    return setError({ message: "Unknown response from server", happened: true })
            }
        }
        console.log(await response.json())
        navigate("/otpForm", { replace: true })

    }
    return (
        <div className="w-fit h-fit flex flex-col gap-4 p-5 font-sans border-[1px] border-solid shadow-2xl rounded-2xl transition-all">
            <div className="font-mono font-black text-3xl text-blue-500 drop-shadow-md mb-6">
                <p className="drop-shadow-md hover:drop-shadow-2xl">Change Password</p>
                {error.happened ? <span className="text-red-500 font-sans text-wrap text-center font-medium text-sm">{error.message}!</span> : ""}
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
                <label>New password</label>
                <input
                    className="h-[31px] pl-2 border-solid border-blue-400 border-[1px] rounded-2xl focus:shadow-inner outline-none transition-colors "
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}

                    onFocus={() => setError({ message: "", happened: false })}
                />
            </div>
            <div className="flex justify-between gap-3">
                <label>Re-type new password</label>
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
}