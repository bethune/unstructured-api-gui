import { FC, ReactNode } from "react"


type InputGroupProps = {
    children: ReactNode
}

const InputGroup: FC<InputGroupProps> = ({children}) => {
    return (
    <div className="col-span-full sm:col-span-4 my-5">
        {children}
    </div>
    )
}

export { InputGroup }