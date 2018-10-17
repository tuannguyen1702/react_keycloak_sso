import React from 'react';
import { Label, Input, FormText, FormGroup } from 'reactstrap';
import { observer } from 'mobx-react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

class TextFieldComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    translate(intl, idM) {
        var message = idM
        const text = message ? intl.formatMessage({ id: message }) : '';
        return text;
    }

    onBlur(e) {
        const { onBlur } = this.props
        if (onBlur) {
            onBlur(e)
        }
    }

    render() {

        const { field, className = '', type = null, placeholder = null, hidelabel = false, disabled = false, readonly = false } = this.props

        return (
            <FormGroup>
                {field.label && !hidelabel && <Label><FormattedMessage id={field.label} /></Label>}
                <div className={className}>
                    <span className="icon"></span>
                    <Input {...field.bind({ type }) }
                        onBlur={this.onBlur.bind(this)}
                        disabled={disabled}
                        placeholder={this.translate(this.props.intl, field.placeholder)}
                    >
                    </Input>
                    <small className="error">
                        {field.error && <FormattedMessage id={field.error} />}
                    </small>
                </div>
            </FormGroup>
        )
    }
}
TextFieldComponent.propTypes = {
    intl: intlShape.isRequired
}
export default injectIntl(observer(TextFieldComponent))