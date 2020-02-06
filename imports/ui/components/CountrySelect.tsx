import Select from 'react-select'
import React, { Component } from 'react'
import countryList from 'react-select-country-list'

export default class CountrySelect extends Component {
    constructor(props) {
        super(props)

        this.options = countryList().getData()

        this.state = {
            onChange: props.onChange,
            options: this.options,
            value: props.value,
        }
    }

    changeHandler = value => {
        this.setState({ value })
        this.state.onChange(value)
    }

    render() {
        return (
            <Select
                options={this.state.options}
                value={this.state.value}
                onChange={this.changeHandler}
            />
        )
    }
}
