import "express-session"


declare module "express-session" {

    interface SessionData {
        authenticated: boolean

        firstname: string
        lastname: string
        email: string
        displayPicture: string

        hasPasswordRequestSession: boolean
        OTP: number
        newPassword: string

        hasRegistrationSession: boolean
        token: string
        password: string
    }
}