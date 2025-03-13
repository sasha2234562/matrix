import './App.css'
import logo from './assets/matrix.svg'
import {useCallback, useEffect, useMemo, useState} from "react";
import {SelectedTrackedCurrency} from "./components/ui/selected-tracked-currency/selected-tracked-currency";
import {Button} from "./components/ui/button/button";
import {Modal} from "./components/ui/modal/modal";

export interface Currency {
    symbol: string;
    priceChange: string;
    priceChangePercent: string;
    weightedAvgPrice: string;
    prevClosePrice: string;
    lastPrice: string;
    lastQty: string;
    bidPrice: string;
    bidQty: string;
    askPrice: string;
    askQty: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    volume: string;
    quoteVolume: string;
    openTime: number;
    closeTime: number;
    firstId: number;
    lastId: number;
    count: number;
}

interface TickerData {
    e: string; // Event type
    E: number; // Event time
    s: string; // Symbol
    p: string; // Price change
    P: string; // Price change percent
    w: string; // Weighted average price
    x: string; // Last price
    c: string; // Current price
    Q: string; // Last quantity
    b: string; // Best bid price
    B: string; // Best bid quantity
    a: string; // Best ask price
    A: string; // Best ask quantity
    o: string; // Open price
    h: string; // High price
    l: string; // Low price
    v: string; // Total traded base asset volume
    q: string; // Total traded quote asset volume
    O: number; // Open time
    C: number; // Close time
    F: number; // First trade ID
    L: number; // Last trade ID
    n: number; // Number of trades
}

export interface Term {
    [x: string]: { symbol: string; countTerm: number; };
}

function App() {
    const [selectWatchCurrencies, setSelectWatchCurrencies] = useState<Term>({});
    const [openWindowCurrencies, setOpenWindowCurrencies] = useState(false);
    const [tickers, setTickers] = useState<{ [key: string]: TickerData }>({});
    const [currencies, setCurrencies] = useState<Currency[]>([]);

    useEffect(() => {
        fetch('https://api.binance.com/api/v3/ticker/24hr')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCurrencies(data)
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []);

    useEffect(() => {
        const streamParams = Object.keys(selectWatchCurrencies).map(currency => {
            return `${currency.toLowerCase()}@ticker`;
        }).join('/')

        const socket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streamParams}`);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.stream) {
                const ticker: TickerData = data.data;

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

    const onSelectCurrency = useCallback((term: Term) => {
        const symbols = Object.keys(term);
        setSelectWatchCurrencies(prevState => {
            const newState = {...prevState};
            symbols.forEach(symbol => {
                newState[symbol] = {
                    symbol: term[symbol].symbol,
                    countTerm: term[symbol].countTerm
                };
            });
            return newState;
        });
    }, []);

    const onClickOpenWindowCurrencies = useCallback(() => setOpenWindowCurrencies(prev => !prev), [])

    const totalOpenPrice = useMemo(() => {
        return Object.values(tickers).reduce((sum, ticker) => {
            return sum + parseFloat(String(+ticker.o * (selectWatchCurrencies[ticker.s]?.countTerm)));
        }, 0);
    }, [tickers, selectWatchCurrencies]);

    return (
        <>
            <header className="header">
                <img src={logo} alt="логотип" className={'logo'}/>
                <Button label={'Добавить'} onClick={onClickOpenWindowCurrencies}/>
            </header>
            <main className="main">
                <div className={'table_select_currencies'}>
                    {Object.values(tickers).map(item => {
                        const itemTotalOpenPrice = +item.o * (selectWatchCurrencies[item.s]?.countTerm);
                        const percentage = totalOpenPrice > 0 ? (itemTotalOpenPrice / totalOpenPrice) * 100 : 0;
                        const roundedPercentage = parseFloat(percentage.toFixed(2));
                        return (
                            <SelectedTrackedCurrency
                                key={item.s}
                                symbol={item.s}
                                price={+item.o}
                                changePrice={item.p}
                                count={selectWatchCurrencies[item.s]?.countTerm}
                                portfolioPercentage={roundedPercentage}
                            />
                        );
                    })}
                </div>
                {openWindowCurrencies &&
                    <Modal onSelectCurrency={onSelectCurrency} onClickCloseWindow={onClickOpenWindowCurrencies}
                           currencies={currencies}/>}
            </main>
        </>
    )
}

export default App
