import React from 'react'
import NetworkManager from './NetworkManager';
import { Request } from './Request';
import { API, HttpMethod } from './API';
import moment from 'moment'

class NetworkService {
    login(form, loginCount) {
        const request = new Request(API.getFullUrl(API.login), HttpMethod.post, "application/json", {
            EmailAddress1: form.username,
            Password: form.password,
            LoginCount: loginCount
        })
        request.isAuth = false
        return NetworkManager.call(request)
    }

    fetchProfile() {
        const request = new Request(API.getFullUrl(API.fetchProfile), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getAvatar() {
        const request = new Request(API.getFullUrl(API.getAvatar), HttpMethod.get, "image/png")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getUserInfo() {
        const request = new Request(API.getFullUrl(API.getUserInfo), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    sendVerifyCode(user_id, value) {
        var data = {
            code: value
        }
        const request = new Request(API.getFullUrl(API.sendVerifyCode) + user_id + "/verify?", HttpMethod.get, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getBankAccountVinFin() {
        var data = {
            "isTenant.equals": true, 
            "enable.equals": true
        }
        const request = new Request(API.getFullUrl(API.getBankAccountVinFin), HttpMethod.get, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    updatePhoneOrEmail(user_id, value, token) {
        const request = new Request(API.getFullUrl(API.sendVerifyCode) + user_id + "/verify?code=" + value + "&token=" + token, HttpMethod.post, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getBanks() {
        const request = new Request(API.getFullUrl(API.getBanks), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    updateBankAccount(user_id, form) {
        var data = {
            accountNumber: form.bankID,
            accountName: form.bankAccountName,
            bankId: parseInt(form.bank),
            customerId: user_id
        }
        const request = new Request(API.getFullUrl(API.updateBankAccount), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    updateCustomer(user_id, form) {
        var data = {
            firstname: form.firstName,
            lastname: form.lastName,
            birthDate: form.birthDate.format('x'), //get timestamp format
            gender: form.gender,
            id: user_id
        }
        const request = new Request(API.getFullUrl(API.updateCustomer), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    loans(user_id, productId , customerAccountId, form) {
        var reasons = []

        if(form.loanPurpose.length > 0)
        {
            form.loanPurpose.map((x) => {
                reasons.push({id: x})
            })
        }


        var data = {
            productId: productId,
            customerAccountId: customerAccountId,
            otherReason: form.anotherPurposeText,
            reasons: reasons,
            customerId: user_id,
            applyDate: moment(new Date()).format('x')
        }
        const request = new Request(API.getFullUrl(API.loans), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    friendVerify(user_id, form) {
        var data = {
            name: form.name,
            facebook: form.facebook,
            type:"FRIEND",
            customerId: user_id
        }
        const request = new Request(API.getFullUrl(API.friendVerify), HttpMethod.post, "application/json", data)
        request.isAuth = false
        return NetworkManager.call(request)
    }

    uploadImage(user_id, file, file_name) {
        var data = new FormData();
        data.append(file_name, file)
        data.append('id', user_id)
        const request = new Request(API.getFullUrl(API.uploadImage), HttpMethod.post, "multipart/form-data", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getLoanProducts() {
        const request = new Request(API.getFullUrl(API.getLoanProducts), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getLoanPurposes() {
        const request = new Request(API.getFullUrl(API.getLoanPurposes), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getLoanHistory(user_id) {
        var data = {
            "customerId.equals": user_id,
            page: 0,
            size: 20,
            sort:"applyDate,desc"
        }
        const request = new Request(API.getFullUrl(API.getLoanHistory), HttpMethod.get, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    loanDetail(id) {
        const request = new Request(API.getFullUrl(API.loanDetail + id), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    sendBill(user_id, form) {
        var data = {
            phoneNumber: "+84" + form.phoneNumber,
            amount: form.amount,
            loanId: parseInt(form.loanId),
            bankAccountId: form.bankAccountId,
            customerId: user_id
        }
        const request = new Request(API.getFullUrl(API.sendBill), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    
}

var networkServiceInstance = new NetworkService()
export default networkServiceInstance
