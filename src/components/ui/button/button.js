import { jsx as _jsx } from "react/jsx-runtime";
import s from './button.module.css';
export const Button = ({ label, onClick }) => {
    return (_jsx("button", { className: s.button, onClick: onClick, children: label }));
};
