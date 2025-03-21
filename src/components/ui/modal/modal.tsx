import s from './modal.module.css';
import { ChangeEvent, FC, memo, useMemo, useState } from 'react';
import icon_close from '../../../assets/icon_cross.svg';
import { Virtuoso } from 'react-virtuoso';
import { Currency, Term } from '../../../App';
import { Input } from '../input/input';
import { Button } from '../button/button';

interface Props {
  onSelectCurrency: (term: Term) => void;
  onClickCloseWindow: () => void;
  currencies: Currency[];
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const Modal: FC<Props> = memo(({ onSelectCurrency, onClickCloseWindow, currencies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countTerm, setCountTerm] = useState('');
  const [selectTerm, setSelectTerm] = useState<string | null>(null);
  const existingTerms = localStorage.getItem('terms');
  const updatedTerms = existingTerms ? JSON.parse(existingTerms) : {};

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
  };

  const onSelectCurrencyHandler = (value: string) => setSelectTerm(value);
  const resetSelectTerm = () => setSelectTerm(null);

  const onClickAddSelectCurrency = () => {
    if (selectTerm) {
      const term: Term = {
        [selectTerm]: {
          symbol: selectTerm,
          countTerm: +countTerm,
        },
      };

      const newTerms = { ...updatedTerms, ...term };

      localStorage.setItem('terms', JSON.stringify(newTerms));
      onSelectCurrency(term);
      setCountTerm('');
      setSelectTerm(null);
    }
  };

  const filteredCurrencies: Currency[] = useMemo(() => {
    if (searchTerm.length === 0) {
      return [...currencies].sort((a, b) => (+b.openPrice) - (+a.openPrice));
    }

    return currencies.filter(item => item.symbol.toLowerCase().startsWith(searchTerm.toLowerCase())).sort((a, b) => (+b.openPrice) - (+a.openPrice));
  }, [currencies, searchTerm]);

  const onChangeCount = (e: ChangeEvent<HTMLInputElement>) => setCountTerm(e.currentTarget.value);

  return (
    <div className={s.modal}>
      <div className={s.modal_window}>
        <h2>Поиск валюты</h2>
        <Input placeholder={'Введите нужную валюту'} onChange={onChangeHandler} value={searchTerm} />
        {filteredCurrencies.length > 0 ? <Virtuoso
          style={{ height: 300 }}
          data={filteredCurrencies}
          itemContent={(_, item) => (
            <div className={Object.keys(updatedTerms).includes(item.symbol) ? s.disabled_currency : s.currency}
                 key={item.symbol}
                 onClick={() => onSelectCurrencyHandler(item.symbol)}>
              <span className={s.symbol}>{item.symbol}</span>
              <span>{currencyFormatter.format(Number.parseFloat(item.openPrice))}</span>
              <span className={+item.priceChangePercent > 0
                ? s.priceUp : +item.priceChangePercent < 0
                  ? s.priceDown : s.priceZero}>{item.priceChangePercent}%</span>
            </div>
          )}
        /> : <div className={s.no_results}>Нет совпадений</div>}
        {selectTerm && <>
          <h4>{selectTerm}</h4>
          <Input placeholder={'Введите количество'} onChange={onChangeCount} type={'number'}
                 value={countTerm} />
          <div className={s.button_wrapper}>
            <Button label={'Добавить'} onClick={onClickAddSelectCurrency} disabled={countTerm === ''} />
            <Button label={'Отменить'} onClick={resetSelectTerm} />
          </div>
        </>}
        <button className={s.close_window} onClick={onClickCloseWindow}>
          <img src={icon_close} alt={'закрыть'} />
        </button>
      </div>
    </div>
  );
});
