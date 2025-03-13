import s from './selected-tracked-currency.module.css';
import {FC, memo} from "react";

interface Props {
    symbol: string;
    price: number;
    changePrice: string;
    count: number;
}

export const SelectedTrackedCurrency: FC<Props> = memo(({price, changePrice, symbol, count}) => {

    return (
        <div className={s.selected_tracked_currency}>
            <div className={s.data_tracked_currency}>
                <span>Актив</span>
                <span>{symbol}</span>
            </div>
            <div className={s.data_tracked_currency}>
                <span>Количество</span>
                <span>{count}</span>
            </div>
            <div className={s.data_tracked_currency}>
                <span>Цена</span>
                <span>{price}</span>
            </div>
            <div className={s.data_tracked_currency}>
                <span>Общая стоимость</span>
                <span>{price * count}</span>
            </div>
            <div className={s.data_tracked_currency}>
                <span>Изм. за 24 ч.</span>
                <span className={+changePrice > 0
                    ? s.priceUp : +changePrice < 0
                        ? s.priceDown : undefined}>{changePrice} %</span></div>
            <div className={s.data_tracked_currency}><span>% портфеля</span></div>
        </div>
    );
});
