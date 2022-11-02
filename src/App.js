import React from 'react';
import { useEffect } from 'react';
import { Block } from './Block';
import './index.css';
const tg = window.Telegram.WebApp;

function App() {
  useEffect(() => {
    tg.ready();// метод позволяет отследить, когда приложение готово к отображению.
  }, [])
  const Close = () => {
    tg.close()// метод закрывает приложение.
  }
  const [fromCurrency, setFromCurrency] = React.useState('EUR');//Переменная для исходной величины
  const [toCurrency, setToCurrency] = React.useState('USD');//Переменная для конвертированной величины
  const [fromPrice, setFromPrice] = React.useState(0);//Переменная, переключения ввода (левое поле ввода)
  const [toPrice, setToPrice] = React.useState(1);//Переменная, переключения ввода (правое поле ввода)
  // const [rates, setRates] = React.useState({});
  const ratesRef = React.useRef({});//Хук useRef позволяет сохранить некоторый объект, который можно можно изменять и который хранится в течение всей жизни компонента.
  const onChangeFromPrice = (value) => {//Функция изменения значения в левом поле ввода и вывода результата вычисления в правое
    //const result = (value / rates[fromCurrency]) * rates[toCurrency];
    const result = (value / ratesRef.current[fromCurrency]) * ratesRef.current[toCurrency];//Расчёт конвертации валюты
    setToPrice(result.toFixed(3));//Вывод результата в правое поле с округлением до тысячных
    setFromPrice(value);//Задание текущего значения левого поля
  }
  const onChangeToPrice = (value) => {//Функция изменения значения в правом поле ввода и вывода результата вычисления в левое
    const result = ratesRef.current[fromCurrency] / ratesRef.current[toCurrency] * value;//Расчёт конвертации валюты
    setFromPrice(result.toFixed(3));//Вывод результата в левое поле с округлением до тысячных
    setToPrice(value);//Задание текущего значения правого поля
  }
  React.useEffect(() => {//Он даёт возможность создавать условные изменения, ссылающиеся на состояние программы внутри функционального компонента
    fetch('https://cdn.cur.su/api/nbu.json').then((res) => res.json()).then((json) => {//Получение данных курса валют с удалённого сервера НБУ
      //setRates(json.rates);
      ratesRef.current = json.rates;//Получение данных из json
      onChangeToPrice(1);//Задание значения по умолчанию для левого поля
    }).catch((err) => {//Вывод ошибки передачи данных
      alert('Не удалось получить информацию');
    });
  }, []);
  React.useEffect(() => {//
    onChangeFromPrice(fromPrice);//Изменение в левом поле ввода
  }, [fromCurrency]);
  React.useEffect(() => {
    onChangeToPrice(toPrice);//Изменение в правом поле ввода
  }, [toCurrency])
  return (
    <div className="App">
      <Block value={fromPrice} currency={fromCurrency} onChangeCurrency={setFromCurrency} onChangeValue={onChangeFromPrice} />
      <Block value={toPrice} currency={toCurrency} onChangeCurrency={setToCurrency} onChangeValue={onChangeToPrice} />
    </div>
  );
}
export default App;

