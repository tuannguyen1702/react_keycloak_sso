
const DOMAIN = "192.168.1.149:8080/vinfin/";
const DOMAINIMAGE = "192.168.1.149:8080/vinfin/";

const API = {
    
    domain: "http:"+'//'+DOMAIN,
    domainws: DOMAIN + "ws/alarm",

    login: 'api/login/dologin',
    
    fetchProfile:'api/Profile/getMyProfile',
    getUserInfo: "api/customers/info",
    uploadImage: "api/customers/upload",
    getBanks: "api/banks",
    updateBankAccount: "api/customers/account",
    updateCustomer: "api/customers",
    updatePhoneOrEmail: "api/customers/",
    friendVerify: "api/customers/endorsement",
    sendVerifyCode: "api/customers/",
    getLoanProducts: "api/loan-products",
    getLoanPurposes: "api/loan-purposes",
    loans: "api/loans",
    loanDetail: "api/loans/",
    getBankAccountVinFin: "api/bank-accounts?",
    getLoanHistory: "api/loans?",
    sendBill: "api/payments/sendBill",

    getFullUrl: function (api) {
        return this.domain + api
    }
};

const HttpMethod = {
    post: "post",
    get: "get",
    put: "put",
    delete: "delete"
};

export {API, HttpMethod};
