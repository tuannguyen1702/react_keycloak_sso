import {
    isEmail,
    shouldBeEqualTo,
    // checkUser,
} from '../../commons/forms/extension/vjf';

export const LoanModel = {
    fields: {
        loanPurpose: {
            value: [],
            type: 'checkbox',
            label: 'loanPurpose',
            placeholder: 'loanPurpose',
            options: {
                validateOnChange: true,
            },
        },
        anotherPurpose: {
            value: false,
            type: 'checkbox',
            label: "Another purpose",
            placeholder: '',
            options: {
                validateOnChange: true,
            },
        },
        anotherPurposeText: {
            value: '',
            type: 'textarea',
            label: 'anotherPurpose',
            placeholder: '',
            options: {
                validateOnChange: true,
            },
        }, 
        agreementLoanTerms: {
            value: null,
            type: 'checkbox',
            rules: 'required|accepted',
            label: "Confirmation of agreement with the service use agreement from Vinfin",
            placeholder: '',
            options: {
                validateOnChange: true,
            },
        },
    },
};

export const BankModel = {
    fields: {
        bank: {
            value: '',
            type: 'textbox',
            label: 'bank',
            placeholder: 'bank',
            options: {
                validateOnChange: true,
                options: [
                ]
            },
        },
        bankAccountName: {
            value: '',
            type: 'textbox',
            label: 'bankAccountName',
            placeholder: 'bankAccountName',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        bankID: {
            value: '',
            type: 'textbox',
            label: 'bankID',
            placeholder: 'bankID',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
    },
};