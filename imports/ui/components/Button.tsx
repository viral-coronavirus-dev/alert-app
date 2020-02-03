import React from 'react'

export default class DonateTodayButton extends React.Component<{
    href?: string,
    color: string,
    target?: string,
    disabled?: boolean,
    onClick?: Function,
}> {
    render() {
        return (
            <a href={this.props.href}
               target={this.props.target}
               onClick={(() => !this.props.disabled && this.props.onClick()}
               className={`
                        display-block bg-${this.props.color} text-white py-2 px-3 rounded 
                        ${this.props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}>
                {this.props.children}
            </a>
        )
    }
}
