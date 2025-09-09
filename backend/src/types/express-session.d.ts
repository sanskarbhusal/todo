import "express-session"


interface User {

}


declare module "express-session" {

    interface SessionData {
        authenticated: boolean

        firstname: string
        lastname: string
        email: string
        displayPicture: string

    }

}