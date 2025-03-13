import s from './modal.module.css';
import {Input} from "../input/input.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../bll/redux/store.ts";
import {Currency} from "../../bll/redux/reducers/currency.ts";
import {ChangeEvent, FC, memo, useMemo, useState} from "react";
import icon_close from '../../../assets/icon_cross.svg';
import {Button} from "../button/button.tsx";
import {Term} from "../../../App.tsx";

interface Props {
    onSelectCurrency: (term: Term) => void;
    onClickCloseWindow: () => void;
}

export const Modal: FC<Props> = memo(({onSelectCurrency, onClickCloseWindow}) => {
    const currencies = useSelector<RootState, Currency[]>(state => state.currency.currency);
    const [searchTerm, setSearchTerm] = useState('');
    const [countTerm, setCountTerm] = useState(0);
    const [selectTerm, setSelectTerm] = useState<string | null>(null);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.currentTarget.value)
    }

    const onSelectCurrencyHandler = (value: string) => setSelectTerm(value);
    const resetSelectTerm = () => setSelectTerm(null);

    const onClickAddSelectCurrency = () => {
        if (selectTerm) {
            const term = {
                [selectTerm]: {
                    symbol: selectTerm,
                    countTerm
                }
            };
            onSelectCurrency(term);
            setCountTerm(0);
            setSelectTerm(null);
        }
    }

    const filteredCurrencies: Currency[] = useMemo(() => {
        if (searchTerm.length === 0) return [...currencies];

        return currencies.filter(item =>
            item.symbol.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
            +item.openPrice > 1
        );
    }, [currencies, searchTerm]);

    const onChangeCount = (e: ChangeEvent<HTMLInputElement>) => setCountTerm(+e.currentTarget.value)

    return (
        <div className={s.modal}>
            <div className={s.modal_window}>
                <h2>Поиск валюты</h2>
                <Input placeholder={'Введите нужную валюту'} onChange={onChangeHandler} value={searchTerm}/>
                {filteredCurrencies.length > 0 && <div className={s.currencies_wrapper}>
                    {filteredCurrencies.map((item) => (
                        <div className={s.currency} key={item.firstId}
                             onClick={() => onSelectCurrencyHandler(item.symbol)}>
                            <span>{item.symbol}</span>
                            <span>${item.openPrice}</span>
                            <span className={+item.priceChangePercent > 0
                                ? s.priceUp : +item.priceChangePercent < 0
                                    ? s.priceDown : undefined}>{item.priceChangePercent}%</span>
                        </div>
                    ))}
                </div>}
                {filteredCurrencies.length === 0 &&<div className={s.no_results}>Нет совпадений</div>}
                {selectTerm && <>
                    <h4>{selectTerm}</h4>
                    <Input placeholder={'Введите количество'} onChange={onChangeCount} type={'number'} value={countTerm}/>
                    <div className={s.button_wrapper}>
                        <Button label={'Добавить'} onClick={onClickAddSelectCurrency}/>
                        <Button label={'Отменить'} onClick={resetSelectTerm}/>
                    </div>
                </>}
                <button className={s.close_window} onClick={onClickCloseWindow}>
                    <img src={icon_close} alt={'закрыть'}/>
                </button>
            </div>
        </div>
    );
});
