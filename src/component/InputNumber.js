const React = require('react')
const PropTypes = require('prop-types')
const Component = React.Component
const NS = require('./base/constant').NS
const Icon = require('./Icon').Icon
const klassName = require('./base/util').klassName

let _timer = null

class InputNumber extends Component {
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.handleMinus = this.handleMinus.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleHold = this.handleHold.bind(this)
        this.handleLoose = this.handleLoose.bind(this)
        const value = this.trimValue(this.props.value)
        this.state = {
            displayValue: value,
        }
    }


    componentWillReceiveProps(nextProps) {
        let value = this.trimValue(nextProps.value)
        if (value !== this.trimValue(this.props.value)) {
            this.setState({
                displayValue: value
            }, () => this.props.onChange(value));
        }
    }

    handleBlur(e) {
        let value = this.trimValue(e.target.value)
        this.setState({
            displayValue: value,
        }, () => {
            this.props.onChange(value)
        });
    }

    trimValue(value){
        let {int, min, max} = this.props
        value = Number(value)
        if (isNaN(value)) {
            return this.props.value || 0
        }

        if (value < min) {
            value = min
        }
        if (value > max) {
            value = max
        }

        if (int) {
            value = parseInt(value)
        }
        return value
    }

    handleHold(fn){
        _timer = setInterval(() => {
            fn.call(this)
        }, 100)
    }

    handleLoose(){
        clearInterval(_timer)
    }

    handleAdd(){
        let {step, max} = this.props
        const {displayValue} = this.state
        if (step + displayValue > max) {
            this.setState({
                displayValue: max,
            });
            return false
        }
        let value = Number((displayValue + step).toFixed(2))
        this.setState({
            displayValue: value
        }, () => this.props.onChange(value));
    }

    handleMinus(){
        let {step, min} = this.props
        const {displayValue} = this.state
        if (displayValue - step < min) {
            this.setState({
                displayValue: min,
            });
            return false
        }
        let value = Number((displayValue - step).toFixed(2))
        this.setState({
            displayValue: value
        }, () => {this.props.onChange(value)});
    }

    handleInput(e) {
        this.setState({
            displayValue: e.target.value
        });
    }

    render() {
        const {displayValue} = this.state
        const {style, className, showArrow, size} = this.props
        return (
            <span style={style} className={klassName(NS, size, className, 'input-number')}>
                <input type="text" className={`${NS} input`} 
                    onBlur={this.handleBlur}
                    value={displayValue}
                    onChange={this.handleInput}/>
                {
                    showArrow ? 
                    <span>
                        <span className="_counter" 
                            onMouseUp={this.handleLoose}
                            onMouseLeave={this.handleLoose}
                            onMouseDown={() => this.handleHold(this.handleAdd)}
                            onClick={this.handleAdd}>
                            <Icon>expand_less</Icon>
                        </span>
                        <span className="_counter" 
                            onMouseUp={this.handleLoose}
                            onMouseLeave={this.handleLoose}
                            onMouseDown={() => this.handleHold(this.handleMinus)}
                            onClick={this.handleMinus}>
                            <Icon>expand_more</Icon>
                        </span>
                    </span>
                    : null
                }
            </span>
        );
    }
}

InputNumber.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    int: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    size: PropTypes.oneOf(['small', 'large', 'mini', '', 'fluid']),
    showArror: PropTypes.bool,
}

InputNumber.defaultProps = {
    int: false,
    value: 0,
    max: Infinity,
    min: -Infinity,
    step: 1,
    size: '',
    showArrow: true,
}
module.exports = {
    InputNumber
}