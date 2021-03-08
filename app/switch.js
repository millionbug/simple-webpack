import React, { useState } from 'react'
import ReactDom from 'react-dom';

export function SwitchButton(props) {
    const [date, setDate] = useState(new Date());
    return <button type="button" onClick={props.onClick}>toggle</button>
}