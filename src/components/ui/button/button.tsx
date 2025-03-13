import s from './button.module.css';
import {FC} from "react";

interface Props {
    label: string;
    onClick: ()=> void;
}

export const Button:FC<Props> = ({label, onClick}) => {
    return (
        <button className={s.button} onClick={onClick}>{label}</button>
    );
};
