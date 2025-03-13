import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import s from './modal.module.css';
import { Input } from "../input/input";
import { memo, useMemo, useState } from "react";
import icon_close from '../../../assets/icon_cross.svg';
import { Button } from "../button/button";
import { Virtuoso } from "react-virtuoso";
const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const Modal = memo(({ onSelectCurrency, onClickCloseWindow, currencies }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [countTerm, setCountTerm] = useState('');
    const [selectTerm, setSelectTerm] = useState(null);
    const onChangeHandler = (e) => {
        setSearchTerm(e.currentTarget.value);
    };
    const onSelectCurrencyHandler = (value) => setSelectTerm(value);
    const resetSelectTerm = () => setSelectTerm(null);
    const onClickAddSelectCurrency = () => {
        if (selectTerm) {
            const term = {
                [selectTerm]: {
                    symbol: selectTerm,
                    countTerm: +countTerm
                }
            };
            onSelectCurrency(term);
            setCountTerm('');
            setSelectTerm(null);
        }
    };
    const filteredCurrencies = useMemo(() => {
        if (searchTerm.length === 0) {
            return [...currencies];
        }
        return currencies.filter(item => item.symbol.toLowerCase().startsWith(searchTerm.toLowerCase()));
    }, [currencies, searchTerm]);
    const onChangeCount = (e) => setCountTerm(e.currentTarget.value);
    return (_jsx("div", { className: s.modal, children: _jsxs("div", { className: s.modal_window, children: [_jsx("h2", { children: "\u041F\u043E\u0438\u0441\u043A \u0432\u0430\u043B\u044E\u0442\u044B" }), _jsx(Input, { placeholder: 'Введите нужную валюту', onChange: onChangeHandler, value: searchTerm }), filteredCurrencies.length > 0 ? _jsx(Virtuoso, { style: { height: 300 }, data: filteredCurrencies, itemContent: (_, item) => (_jsxs("div", { className: s.currency, onClick: () => onSelectCurrencyHandler(item.symbol), children: [_jsx("span", { className: s.symbol, children: item.symbol }), _jsx("span", { children: currencyFormatter.format(Number.parseFloat(item.openPrice)) }), _jsxs("span", { className: +item.priceChangePercent > 0
                                    ? s.priceUp : +item.priceChangePercent < 0
                                    ? s.priceDown : s.priceZero, children: [item.priceChangePercent, "%"] })] }, item.symbol)) }) : _jsx("div", { className: s.no_results, children: "\u041D\u0435\u0442 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0439" }), selectTerm && _jsxs(_Fragment, { children: [_jsx("h4", { children: selectTerm }), _jsx(Input, { placeholder: 'Введите количество', onChange: onChangeCount, type: 'number', value: countTerm }), _jsxs("div", { className: s.button_wrapper, children: [_jsx(Button, { label: 'Добавить', onClick: onClickAddSelectCurrency }), _jsx(Button, { label: 'Отменить', onClick: resetSelectTerm })] })] }), _jsx("button", { className: s.close_window, onClick: onClickCloseWindow, children: _jsx("img", { src: icon_close, alt: 'закрыть' }) })] }) }));
});
