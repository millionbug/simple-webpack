import React, { useState } from 'react'
import ReactDom from 'react-dom';
import SwitchButton from './switch.js';

export function App() {
    const [date, setDate] = useState(new Date());
    return <>
        当前时间是{date}
        <hr />
        <SwitchButton onClick={() => {setDate(new Date())}}></SwitchButton>
    </>
}