import {
    isEmail,
    shouldBeEqualTo,
    // checkUser,
} from '../../commons/forms/extension/vjf';

export default {
    fields: {
        firstName: {
            value: '',
            type:'text',
            label: 'firstName',
            placeholder: 'inputFirstName',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        lastName: {
            value: '',
            type:'text',
            label: 'lastName',
            placeholder: 'inputLastName',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        birthDate:{
            value: '',
            label: 'birthDate',
            type:'data',
            placeholder: 'DD/MM/YYYY',
            rules: 'required',
            options: {
                validateOnChange: true
            },
        },
        gender:{
            value: '',
            label: 'gender',
            type:'select',
            placeholder: 'select options',
            rules: 'required',
            options: {
                validateOnChange: true,
                options:[
                    {value:1,text:"male"},
                    {value:2,text:"female"},
                ]
            },
        },
        phone: {
            value: '',
            type:'textbox',
            label: 'phone',
            placeholder: '090 1234567',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        verifyCode:{
            value: '',
            type:'textbox',
            label: 'verifyCode',
            placeholder: '',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        email:{
            value: '',
            type:'textbox',
            label: 'email',
            placeholder: 'vinfin@gmail.com',
            rules: 'required|email',
            options: {
                validateOnChange: true,
            },
        },
        facebookLink:{
            value: '',
            type:'textbox',
            label: '',
            placeholder: '',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        bank:{
            value: '',
            type:'select',
            label: 'bank',
            placeholder: 'bank',
            options: {
                validateOnChange: true,
                options:[
                    {value:1,text:"male"},
                    {value:2,text:"female"},
                ]
            },
        },
        bankAccountName:{
            value: '',
            type:'textbox',
            label: 'bankAccountName',
            placeholder: 'bankAccountName',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        bankID:{
            value: '',
            type:'textbox',
            label: 'bankID',
            placeholder: 'bankID',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
    },
};