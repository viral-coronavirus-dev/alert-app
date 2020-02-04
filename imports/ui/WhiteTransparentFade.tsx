import React from 'react'

export default function WhiteTransparentFade(props) {
    return (
        <div className={"fixed w-full top-0 left-0 bg-white-to-transparent pointer-events-none"} style={{ height: "110px" }}>
        </div>
    );
}
