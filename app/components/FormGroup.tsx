import { FC, ReactNode } from "react";

type FormGroupProps = {
    children: ReactNode,
    disabled: boolean
}

const FormGroup: FC<FormGroupProps> = ({children, disabled}) => {
    
    return (
        <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
                <fieldset disabled={disabled} className="disabled:opacity-75 mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    {children}
                </fieldset>
            </div>
        </div>
    )
}

export { FormGroup }