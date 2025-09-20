import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()


async function sendMail(userName: string, email: string, type: "authorizeNewPassword" | "authorizeRegistration", otp?: number, url?: string) {

    let changePasswordEmail = `
<h2>Hi, @${userName}</h2>
<p>This is your OTP to change password.</p>
<h3><strong>${otp}</strong></h3>
<p>Please do not share this code with anyone.</p>
<p>If you didn't request this, you can safely ignore this email.</p>
<br><br><br>
<p>Thank you</p>
     `

    let registrationEmail = `
<h2>Hi, @${userName}</h2>
<p>To create your account, click on this link</p>
<h3><strong><a href=${url}>Verify</a></strong></h3>
<p>If you didn't request this, you can safely ignore this email.</p>
<br><br><br>
<p>Thank you</p>
     `

    let html

    try {
        if (type === "authorizeNewPassword") {
            if (otp == undefined) {
                throw new Error("sendMail()::Required parameter 'otp' is undefined.")
            }
            html = changePasswordEmail
        } else {
            if (url == undefined) {
                throw new Error("sendMail()::Required parameter 'url' is undefined.")
            }
            html = registrationEmail
        }
    } catch (error) {
        const err = error as Error
        console.log(err.message)
    }

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
        const info = await transporter.sendMail({
            from: process.env.zohoMail,
            to: email,
            subject: 'Change ToDo Password',
            html
        })
        return { info, isSent: true }
    } catch (err) {
        console.log("nodemailer error")
        console.log(err)
        return { isSent: false }
    }
}
export default sendMail