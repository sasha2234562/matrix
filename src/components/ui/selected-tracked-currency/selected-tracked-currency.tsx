import s from './selected-tracked-currency.module.css';
import { FC, memo } from 'react';

interface Props {
  symbol: string;
  price: number;
  changePrice: string;
  count: number;
  portfolioPercentage: number;
  onClickRemoveCurrency: (symbol: string) => void;
}

export const SelectedTrackedCurrency: FC<Props> = memo(({
                                                          price, changePrice, symbol, count,
                                                          portfolioPercentage, onClickRemoveCurrency,
                                                        }) => {

  return (
    <div className={s.selected_tracked_currency} onClick={()=> onClickRemoveCurrency(symbol)}>
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
        <span>{price.toFixed(2)}</span>
      </div>
      <div className={s.data_tracked_currency}>
        <span>Общая стоимость</span>
        <span>{(price * count).toFixed(2)}</span>
      </div>
      <div className={s.data_tracked_currency}>
        <span>Изм. за 24 ч.</span>
        <span className={+changePrice > 0
          ? s.priceUp : +changePrice < 0
            ? s.priceDown : undefined}>{(+changePrice).toFixed(2)} %</span></div>
      <div className={s.data_tracked_currency}><span>% портфеля</span><span>{portfolioPercentage}%</span></div>
    </div>
  );
});
