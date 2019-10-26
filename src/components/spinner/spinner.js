import React from 'react';
import './spinner.scss';

export default function Spinner() {
    return (<div className="sk-three-bounce ">
        <div className="sk-child sk-bounce1"/>
        <div className="sk-child sk-bounce2"/>
        <div className="sk-child sk-bounce3"/>
    </div>)
}
