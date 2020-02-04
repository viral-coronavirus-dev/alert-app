import React from 'react'

export default function Input(props) {
    return (
        <input type={props.type ? props.type : 'text'}
               className={"w-full p-3 placeholder-uppercase rounded border-solid border border-black"}
               placeholder={props.placeholder}
               onChange={props.onChange} />
    );
}
