import s from './input.module.css'
import {DetailedHTMLProps, forwardRef, InputHTMLAttributes} from "react";

type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, Props>(({ ...restProps}, ref) => {

    return (
            <input className={s.input} ref={ref} {...restProps}/>
    );
});
