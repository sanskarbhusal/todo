import "express-session"


interface User {

    firstname: string
    lastname: string
    email: string
    displayPicture: string

}


declare module "express-session" {

    interface SessionData {
        user?: User
        authenticated?: boolean
    }

}