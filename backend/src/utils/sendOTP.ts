import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()


async function sendOTP(userName: string, otp: number, email: string) {

    const getHtml = (userName: string, otp: number) => `
<h2>Hi, @${userName}</h2>
<p>This is your OTP to change password.</p>
<h3><strong>${otp}</strong></h3>
<p>Please do not share this code with anyone.</p>
<p>If you didn't request this, you can safely ignore this email.</p>
<br><br><br>
<p>Thank you</p>
     `

    const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.zohoMail,
            pass: process.env.zohoPassword
        }
    })

    try {
        const recepient = email.split("").join()
        console.log(email)
        const info = await transporter.sendMail({
            from: process.env.zohoMail,
            to: email,
            subject: 'Change ToDo Password',
            html: getHtml(userName, otp)
        })
        return { info, isSent: true }
    } catch (err) {
        console.log("nodemailer error")
        console.log(err)
        return { isSent: false }
    }
}
export default sendOTP