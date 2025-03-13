import { jsx as _jsx } from "react/jsx-runtime";
import s from './input.module.css';
import { forwardRef } from "react";
export const Input = forwardRef(({ ...restProps }, ref) => {
    return (_jsx("input", { className: s.input, ref: ref, ...restProps }));
});
