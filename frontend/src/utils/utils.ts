const envType = import.meta.env.VITE_envType

let apiURL: string
if (envType === "local") {
    apiURL = import.meta.env.VITE_apiURLLocal || ""
} else {
    apiURL = import.meta.env.VITE_apiURLProduction || ""
}
export default apiURL