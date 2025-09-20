const envType = import.meta.env.VITE_env

let apiURL: string
if (envType === "local") {
    apiURL = import.meta.env.VITE_apiURLLocal || ""
} else {
    apiURL = import.meta.env.VITE_apiURLProduction || ""
}
export default apiURL