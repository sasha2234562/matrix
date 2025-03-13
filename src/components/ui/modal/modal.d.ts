import { FC } from "react";
import { Currency, Term } from "../../../App";
interface Props {
    onSelectCurrency: (term: Term) => void;
    onClickCloseWindow: () => void;
    currencies: Currency[];
}
export declare const Modal: FC<Props>;
export {};
