type Props = {
    text: string
}

export default function StaticPage(props: Props) {
    return (
        <div className="text-2xl">
            {props.text}
        </div>
    )
}