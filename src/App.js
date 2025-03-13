import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import './App.css';
import logo from './assets/matrix.svg';
import { useCallback, useEffect, useMemo, useState } from "react";
import { SelectedTrackedCurrency } from "./components/ui/selected-tracked-currency/selected-tracked-currency";
import { Button } from "./components/ui/button/button";
import { Modal } from "./components/ui/modal/modal";
function App() {
    const [selectWatchCurrencies, setSelectWatchCurrencies] = useState({});
    const [openWindowCurrencies, setOpenWindowCurrencies] = useState(false);
    const [tickers, setTickers] = useState({});
    const [currencies, setCurrencies] = useState([]);
    useEffect(() => {
        fetch('https://api.binance.com/api/v3/ticker/24hr')
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            .then(data => {
            setCurrencies(data);
        })
            .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }, []);
    useEffect(() => {
        const streamParams = Object.keys(selectWatchCurrencies).map(currency => {
            return `${currency.toLowerCase()}@ticker`;
        }).join('/');
        const socket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streamParams}`);
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.stream) {
                const ticker = data.data;
                setTickers(prev => ({
                    ...prev,
                    [ticker.s]: ticker,
                }));
            }
        };
        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };
        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        return () => {
            socket.close();
        };
    }, [selectWatchCurrencies]);
    const onSelectCurrency = useCallback((term) => {
        const symbols = Object.keys(term);
        setSelectWatchCurrencies(prevState => {
            const newState = { ...prevState };
            symbols.forEach(symbol => {
                newState[symbol] = {
                    symbol: term[symbol].symbol,
                    countTerm: term[symbol].countTerm
                };
            });
            return newState;
        });
    }, []);
    const onClickOpenWindowCurrencies = useCallback(() => setOpenWindowCurrencies(prev => !prev), []);
    const totalOpenPrice = useMemo(() => {
        return Object.values(tickers).reduce((sum, ticker) => {
            return sum + parseFloat(String(+ticker.o * (selectWatchCurrencies[ticker.s]?.countTerm)));
        }, 0);
    }, [tickers, selectWatchCurrencies]);
    return (_jsxs(_Fragment, { children: [_jsxs("header", { className: "header", children: [_jsx("img", { src: logo, alt: "\u043B\u043E\u0433\u043E\u0442\u0438\u043F", className: 'logo' }), _jsx(Button, { label: 'Добавить', onClick: onClickOpenWindowCurrencies })] }), _jsxs("main", { className: "main", children: [_jsx("div", { className: 'table_select_currencies', children: Object.values(tickers).map(item => {
                            const itemTotalOpenPrice = +item.o * (selectWatchCurrencies[item.s]?.countTerm);
                            const percentage = totalOpenPrice > 0 ? (itemTotalOpenPrice / totalOpenPrice) * 100 : 0;
                            const roundedPercentage = parseFloat(percentage.toFixed(2));
                            return (_jsx(SelectedTrackedCurrency, { symbol: item.s, price: +item.o, changePrice: item.p, count: selectWatchCurrencies[item.s]?.countTerm, portfolioPercentage: roundedPercentage }, item.s));
                        }) }), openWindowCurrencies &&
                        _jsx(Modal, { onSelectCurrency: onSelectCurrency, onClickCloseWindow: onClickOpenWindowCurrencies, currencies: currencies })] })] }));
}
export default App;
