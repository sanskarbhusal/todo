import { FaSpinner as Spinner } from "react-icons/fa";
export default function loader({ size, className }: { size: number, className?: string }): JSX.Element {
    let text = ""
    return <div className="h-full flex justify-center">

        <Spinner size={size} className={`animate-spin self-center text-gray-500 ${className}`} />
    </div>
}