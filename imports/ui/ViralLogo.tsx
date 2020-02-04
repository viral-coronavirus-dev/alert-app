import React from 'react'

export default class ViralLogo extends React.Component {
    render() {
        return (
            <div className={"fixed top-0 left-0 ml-3"} style={{ maxWidth: '100px' }}>
                <picture>
                    <source srcSet={"/logo_transparent.webp"} type={"image/webp"} />
                    <img src={"/logo_transparent.png"} alt={"Corona Virus Alert App"} />
                </picture>
            </div>
        )
    }
}
