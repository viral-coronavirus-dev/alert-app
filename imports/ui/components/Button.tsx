import React from 'react'

export default class DonateTodayButton extends React.Component<{
    href: string,
    color: string,
    target?: string,
}> {
    render() {
        return (
            <a href={this.props.href}
               target={this.props.target}
               className={`display-block bg-${this.props.color} text-white py-2 px-3 rounded cursor-pointer`}>
                {this.props.children}
            </a>
        )
    }
}
