import { useState } from "react"
import { useNavigate } from "react-router"
import url from "../../utils"


export default function OTPForm() {

    // state hooks
    const [OTP, setOtp] = useState("")
    const [error, setError] = useState({ message: "your message", happened: false })
    // navigation hook
    const navigate = useNavigate()


    async function handleSubmit() {

        // POST form data
        const response = await fetch(`${url}/authorizeNewPassword`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            credentials: "include",
            body: JSON.stringify(
                {
                    OTP: parseInt(OTP)
                }
            )
        })

        if (!response.ok) {
            switch (response.status) {
                case 400:
                    return console.log("Server: HTTP body from client doesn't comply with the expected shape.")
                case 401:
                    return setError({ message: "Wrong OTP!", happened: true })
                case 403:
                    return setError({ message: "Session Expired. Please re-initiate forgot password.", happened: true })
                case 500:
                    return setError({ message: "Problem in server", happened: true })
                default:
                    return setError({ message: "Unknown response from server", happened: true })
            }
        }
        navigate("/login", { replace: true })
    }
    return (
        <div className="w-72 h-fit flex flex-col gap-4 p-5 font-sans border-[1px] border-solid shadow-2xl rounded-2xl transition-all">
            <div className="font-mono font-black text-3xl text-blue-500 drop-shadow-md">
                <p className="drop-shadow-md hover:drop-shadow-2xl">Email Verification</p>
                {error.happened ? <span className="text-red-500 font-sans text-wrap text-center font-medium text-sm">{error.message}!</span> : ""}
            </div>
            <div className="flex flex-col justify-between">
                <label className="text-pretty text-center">Check you email for OTP</label>
                <input
                    className="h-[33px] w-40 mt-5 self-center no-spinner pl-2 pr-2 text-center text-xl placeholder:text-base font-mono border-solid border-blue-400 border-[1px] rounded-2xl focus:shadow-inner outline-none transition-colors  "
                    type="number"
                    placeholder="6-digit code"
                    value={OTP}
                    onChange={(e) => setOtp(e.target.value)}
                    onFocus={() => setError({ message: "", happened: false })}
                />
            </div>
            <button
                className="w-20 self-center mt-4 mb-4 bg-white border-blue-500 rounded-xl border-[1px] p-1 px-3 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                onClick={handleSubmit}
            >
                Verify
            </button>
        </div>
    )
}