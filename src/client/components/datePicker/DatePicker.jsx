import React from 'react';
import { Label, Input, FormText, FormGroup } from 'reactstrap';
import { observer } from 'mobx-react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import DatePicker from 'react-datepicker';
import moment from 'moment';


class DatePickerComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    translate(intl, idM) {
        var message = idM
        const text = message ? intl.formatMessage({ id: message }) : '';
        return text;
    }

    handleChange(date) {
        this.props.field.value = date
    }

    render() {

        const { field, type = null, placeholder = null, className = "" } = this.props

        return (
            <FormGroup>
                <Label>{field.label && <FormattedMessage id={field.label} />}</Label>
                <div className={className}>
                    <DatePicker className={"form-control " + className}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        selected={field.value == "" ? null : field.value}
                        dateFormat={field.placeholder}
                        onChange={this.handleChange.bind(this)}
                        placeholderText={field.placeholder} />
                    <small className="error">
                        {field.error && <FormattedMessage id={field.error} />}
                    </small>
                </div>
            </FormGroup>
        )
    }
}
DatePickerComponent.propTypes = {
    intl: intlShape.isRequired
}
export default injectIntl(observer(DatePickerComponent))