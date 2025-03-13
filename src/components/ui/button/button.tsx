import s from './button.module.css';
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';

interface Props extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
  label: string;
  onClick: () => void;
}

export const Button: FC<Props> = ({ label, onClick, ...restProps }) => {
  return (
    <button className={s.button} onClick={onClick} {...restProps}>{label}</button>
  );
};
