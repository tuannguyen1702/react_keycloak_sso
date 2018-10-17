import {
    isEmail,
    shouldBeEqualTo,
    // checkUser,
} from '../../commons/forms/extension/vjf';



export const BankModel = {
    fields: {
        bank: {
            value: '',
            type: 'select',
            label: 'bank',
            placeholder: 'bank',
            options: {
                validateOnChange: true,
                options: [
                ]
            },
        },
        phoneNumber: {
            value: '',
            type: 'textbox',
            label: 'Receive payment information via SMS',
            placeholder: '901234567',
            options: {
                validateOnChange: true,
            },
        },
        anotherTipValue: {
            value: '',
            type: 'textbox',
            label: '',
            placeholder: 'Input the amount you want to tip',
            options: {
                validateOnChange: true,
            },
        },
        tipValue: {
            value: "",
            type: 'radio',
            label: 'bankID',
            placeholder: 'bankID',
            options: {
                validateOnChange: true,
            },
        },
    },
};

