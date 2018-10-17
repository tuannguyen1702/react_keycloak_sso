import React, { Component } from "react";
import ReactDOM from 'react-dom'
import _ from 'lodash'
import PropTypes from "prop-types";
import { connect } from 'react-redux'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { BaseInfoModel, BankModel, EmailModel, PhoneModel } from "./userProfileModel"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage } from '../../components'
import copy from 'copy-to-clipboard';
import { Observable } from 'rxjs/Observable'
import Rx from 'rxjs/Rx';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import { setUserInfo, updateFullName } from '../../actions'
import Recaptcha from 'react-recaptcha';
import UserProfileProgress from "../../layouts/share/_userProgress";

class UpdateProfileComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {

            userInfo: {
                avatar: "",
                userId: "",
                IDFront: "",
                IDBack: "",
                studentCardFront: "",
                studentCardBack: "",
                friendVerifyLink: "",
                endorsements: []

            },
            status: "OPEN",
            banks: [],
            hideVerifyMobile: true,
            hideVerifyEmail: true,
            isCloseEditBaseForm: true,
            isCloseEditEmailForm: true,
            isCloseEditPhoneForm: true,
            isCloseEditBankForm: true,
            openSendEmailCaptcha: false,
            openSendMobileCaptcha: false
        }

        this.initFormModel()

        this.recaptchaEmailInstance = null
        this.recaptchaMobileInstance = null
    }

    updateUserProfile(key, value) {
        var self = this
        self.props.userInfo[key] = value
        self.props.dispatch(setUserInfo(self.props.userInfo))
    }

    verifyCallback(response) {
        console.log(response);
    };

    componentDidMount() {
        var self = this

        Rx.Observable.forkJoin(
            NetworkService.getUserInfo(),
            NetworkService.getBanks(),
            function (lst1, lst2) {
                // const filteredLst1 = lst1.Data.map((x) => {
                //     return { value: x.Value, label: x.Text }
                // })
                const filteredLst2 = lst2.map((x) => {
                    return { value: x.id, text: x.name }
                })

                return {
                    userInfo: lst1,
                    banks: filteredLst2
                }
            }
        ).subscribe(
            function onNext(joinedResult) {
                //self.props.dispatch(setUserInfo(joinedResult.userInfo))

                self.setState({
                    userInfo: {
                        user: joinedResult.userInfo.firstname + " " + joinedResult.userInfo.lastname,
                        avatar: joinedResult.userInfo.avatarImage,
                        userId: joinedResult.userInfo.id,
                        IDFront: joinedResult.userInfo.governmentImageId1,
                        IDBack: joinedResult.userInfo.governmentImageId2,
                        studentCardFront: joinedResult.userInfo.studentImageId1,
                        studentCardBack: joinedResult.userInfo.studentImageId2,
                        endorsements: joinedResult.userInfo.endorsements,
                        friendVerifyLink: encodeURI(window.location.origin + "/guest/friend-verify?id=" + joinedResult.userInfo.id + "&name=" + joinedResult.userInfo.lastname + " " + joinedResult.userInfo.firstname)
                    },
                    banks: joinedResult.banks,
                    status: joinedResult.userInfo.status
                })

                self.baseInfoForm.$("firstName").value = joinedResult.userInfo.firstname
                self.baseInfoForm.$("lastName").value = joinedResult.userInfo.lastname
                if (joinedResult.userInfo.birthDate) {
                    self.baseInfoForm.$("birthDate").value = moment(joinedResult.userInfo.birthDate)
                }
                self.baseInfoForm.$("gender").value = joinedResult.userInfo.gender || 1
                self.baseInfoForm.$("facebookLink").value = self.state.userInfo.friendVerifyLink
                self.baseInfoForm.setValueForReset()


                if (joinedResult.userInfo.phoneNumber) {
                    self.phoneForm.$("phone").value = joinedResult.userInfo.phoneNumber.replace(/[+]84/i, "")
                }
                self.phoneForm.setValueForReset()

                if (joinedResult.userInfo.email) {
                    self.emailForm.$("email").value = joinedResult.userInfo.email
                }
                self.emailForm.setValueForReset()

                if (joinedResult.banks.length > 0) {
                    self.bankForm.$("bank").value = joinedResult.userInfo.bankId || joinedResult.banks[0].value

                    self.bankForm.$("bankAccountName").value = joinedResult.userInfo.accountName || ""
                    self.bankForm.$("bankID").value = joinedResult.userInfo.accountNumber || ""
                    self.bankForm.setValueForReset()
                }

                const targetNode = ReactDOM.findDOMNode(self.refs[self.props.location.hash])
                window.scrollTo(0, targetNode.offsetTop);
            },
            function onError() {

            },
            function onCompleted() {

            }
            )

        // NetworkService.getUserInfo().subscribe(
        //     function onNext(response) {
        //         if (response) {
        //             self.setState({
        //                 user: response.firstname + " " + response.lastname,
        //                 avatar: response.avatarImage,
        //                 userId: response.id,
        //                 IDFront: response.frontNationalIdCardImage,
        //                 IDBack: response.backNationalIdCardImage,
        //                 studentCardFront: response.frontStudentCardImage,
        //                 studentCardBack: response.backStudentCardImage,
        //                 friendVerifyLink: window.location.origin + "/guest/friend-verify?id=" + response.id + "&name=" + response.lastname + " " + response.firstname
        //             })

        //             self.baseInfoForm.$("facebookLink").value = self.state.userInfo.friendVerifyLink

        //         } else {
        //             console.log("Failed")
        //         }
        //     },
        //     function onError(e) {
        //         console.log("onError")
        //     },
        //     function onCompleted() {

        //     }
        // )
    }

    scrollTo(hash) {
        const targetNode = ReactDOM.findDOMNode(this.refs[hash])
        window.scrollTo(0, targetNode.offsetTop);
    }

    initFormModel() {
        var self = this
        self.baseInfoForm = new FormModel({ ...BaseInfoModel }, { name: 'User Profile' })

        self.baseInfoForm.onSuccess = function (form) {
            NetworkService.updateCustomer(self.state.userInfo.userId, form.values()).subscribe(
                function onNext(response) {
                    self.baseInfoForm.setValueForReset()
                    self.notify()
                    self.setState({ isCloseEditBaseForm: true })
                    self.props.dispatch(setUserInfo(response))
                },
                function onError(e) {
                    console.log("onError")
                },
                function onCompleted() {

                }
            )
        }

        self.phoneForm = new FormModel({ ...PhoneModel }, { name: 'Phone User Profile' })

        self.phoneForm.onSuccess = function (form) {
            NetworkService.updatePhoneOrEmail(self.state.userInfo.userId, "%2B84" + form.values().phone, form.values().phoneVerifyCode).subscribe(
                function onNext(response) {
                    self.phoneForm.setValueForReset()
                    self.notify()
                    self.phoneForm.$("phoneVerifyCode").clear()
                    self.props.dispatch(setUserInfo(response))
                    self.setState({ hideVerifyMobile: true, isCloseEditPhoneForm: true })
                },
                function onError(e) {
                    form.$("phoneVerifyCode").invalidate("verify_code_wrong");
                },
                function onCompleted() {

                }
            )
        }
        self.emailForm = new FormModel({ ...EmailModel }, { name: 'Email User Profile' })

        self.emailForm.onSuccess = function (form) {
            NetworkService.updatePhoneOrEmail(self.state.userInfo.userId, form.values().email, form.values().emailVerifyCode).subscribe(
                function onNext(response) {
                    self.emailForm.setValueForReset()
                    self.notify()
                    self.emailForm.$("emailVerifyCode").clear()
                    self.props.dispatch(setUserInfo(response))
                    self.setState({ hideVerifyEmail: true, isCloseEditEmailForm: true })
                },
                function onError(e) {
                    form.$("emailVerifyCode").invalidate("verify_code_wrong");
                },
                function onCompleted() {

                }
            )
        }

        self.bankForm = new FormModel({ ...BankModel }, { name: 'Bank User Profile' })

        self.bankForm.onSuccess = function (form) {
            NetworkService.updateBankAccount(self.state.userInfo.userId, form.values()).subscribe(
                function onNext(response) {
                    self.bankForm.setValueForReset()
                    self.notify()
                    self.props.dispatch(setUserInfo(response))
                    self.setState({ isCloseEditBankForm: true })
                },
                function onError(e) {

                },
                function onCompleted() {

                }
            )
        }
    }

    uploadImage(files, fileName, uploadCompleted) {
        var userId = this.state.userInfo.userId
        if (files[0]) {
            NetworkService.uploadImage(userId, files[0], fileName).subscribe(
                function onNext(response) {
                    uploadCompleted()
                },
                function onError(e) {
                    console.log("onError")
                },
                function onCompleted() {

                }
            )
        }

    }

    sendCode(value) {
        var userId = this.state.userInfo.userId
        NetworkService.sendVerifyCode(userId, value).subscribe(
            function onNext(response) {

            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )
    }

    copyFacebookLink() {
        copy(this.state.userInfo.friendVerifyLink)
    }

    sendMobileCode() {
        var self = this
        var value = "+84" + self.phoneForm.$("phone").value
        //self.setState({ hideVerifyMobile: !self.state.hideVerifyMobile })
        if (!self.phoneForm.$("phone").errorSync) {
            var userId = this.state.userInfo.userId
            NetworkService.sendVerifyCode(userId, value).subscribe(
                function onNext(response) {
                    self.notify("Gửi mã xác nhận thành công")
                    self.setState({ hideVerifyMobile: false, openSendMobileCaptcha: false })
                    self.recaptchaMobileInstance.reset()
                },
                function onError(e) {

                },
                function onCompleted() {

                }
            )
        }

    }

    sendEmailCode() {
        var self = this
        //self.setState({ hideVerifyEmail: !self.state.hideVerifyEmail })
        var value = self.emailForm.$("email").value
        if (!self.emailForm.$("email").errorSync) {
            var userId = this.state.userInfo.userId
            NetworkService.sendVerifyCode(userId, value).subscribe(
                function onNext(response) {
                    self.notify("Gửi mã xác nhận thành công")
                    self.setState({ hideVerifyEmail: false, openSendEmailCaptcha: false })
                    self.recaptchaEmailInstance.reset()
                },
                function onError(e) {

                },
                function onCompleted() {

                }
            )
        }
    }

    notify(message) { toast.info(message || "Cập nhật thành công") }

    changeState(objState) {
        this.setState(objState)
    }

    showStatus(status) {
        if (status == "OPEN") {
            return <span className="status"><FormattedMessage id="not_yet_verify" /></span>
        } else if (status == "QUALIFIED") {
            return <span className="status qualified"><i className="far fa-clock"></i> <FormattedMessage id="qualified" /></span>
        } else {
            return <span className="status verified"><i className="fas fa-check"></i> <FormattedMessage id="verified" /></span>
        }

    }

    friendConfirmed(data) {
        return <div>{data.map((item, index) => {
            return <div key={index}>- <a href={"https://www.facebook.com/" + item.facebook}>{item.name}</a></div>
        })}</div>
    }

    render() {
        var self = this
        var { userInfo } = self.props
        var { hideVerifyMobile, hideVerifyEmail, isCloseEditBaseForm, isCloseEditEmailForm, isCloseEditPhoneForm, isCloseEditBankForm, mesZoneFixed } = self.state
        return (
            <div>
                <ToastContainer hideProgressBar={true} closeButton={false} style={{ top: "85px", textAlign: "center" }} />
                <div className="message-zone-container">
                    {userInfo.status == "OPEN" && <UserProfileProgress className="user-page" callBackScroll={(hash) => self.scrollTo(hash)} progressData={userInfo.customerInfoProgressDTO} />}

                    <div className="common-form">

                        <div className="main-title-container">
                            <h2 className="main-title"><FormattedMessage id="user_profile" /></h2>{self.showStatus(userInfo.status)}
                        </div>
                        <div>
                            <p>
                                <FormattedMessage id="update_user_profile_message" />
                            </p>
                            <h3 ref="#user-info" className="sub-title"><FormattedMessage id="user_info" /></h3>{isCloseEditBaseForm && <Button className="edit-btn fa-custom" color="link"
                                onClick={() => { self.changeState({ isCloseEditBaseForm: false }) }}
                            ><FormattedMessage id="edit" /></Button>}
                            <Form>
                                <div className={isCloseEditBaseForm ? "close-edit-mode" : ""}>
                                    <Row>
                                        <Col xs="12" sm="6">
                                            <TextField field={self.baseInfoForm.$("firstName")} />
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <TextField field={self.baseInfoForm.$("lastName")} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <DatePicker className="date-picker full-width" field={self.baseInfoForm.$("birthDate")} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Select className="icon-left gender-icon" field={self.baseInfoForm.$("gender")} />
                                        </Col>
                                    </Row>

                                    <Collapse isOpen={!isCloseEditBaseForm}>
                                        <FormGroup>
                                            <Button color="info"
                                                onClick={self.baseInfoForm.onSubmit.bind(this)}
                                            ><FormattedMessage id="save" /></Button>
                                            <Button color="link"
                                                onClick={() => {
                                                    self.baseInfoForm.resetValues()
                                                    self.changeState({ isCloseEditBaseForm: true })
                                                }
                                                }
                                            ><FormattedMessage id="cancel" /></Button>
                                        </FormGroup>
                                    </Collapse>
                                </div>
                                <h3 ref="#contact" className="sub-title"><FormattedMessage id="contact_info" /></h3>
                                <div className={isCloseEditPhoneForm ? "close-edit-mode" : "active-block"}>
                                    <Row>
                                        <Col>
                                            <TextField className="icon-left mobile-icon vi-mobile" field={self.phoneForm.$("phone")} />
                                            {isCloseEditPhoneForm && <Button className="edit-btn fa-custom inline" color="link"
                                                onClick={() => self.changeState({ isCloseEditPhoneForm: false })}
                                            ><FormattedMessage id="edit" /></Button>}
                                        </Col>
                                    </Row>
                                    <Collapse isOpen={!isCloseEditPhoneForm && hideVerifyMobile ? true : false}>
                                        <p>
                                            <FormattedMessage id="vinfin_will_send_to_mobile" />
                                        </p>
                                        <FormGroup>
                                            <Button color="info"
                                                onClick={self.sendMobileCode.bind(this)}
                                            ><FormattedMessage id="send_verify_code" /><i className="fas fa-arrow-right"></i></Button>
                                            <Button className="fa-custom" color="link"
                                                onClick={() => {
                                                    self.phoneForm.resetValues()
                                                    self.changeState({ isCloseEditPhoneForm: true })
                                                }
                                                }
                                            ><FormattedMessage id="cancel" /></Button>
                                        </FormGroup>
                                    </Collapse>
                                    <Collapse isOpen={!self.state.hideVerifyMobile}>
                                        <p>
                                            <FormattedMessage id="input_verify_code_for_phone" />
                                        </p>
                                        <Row>
                                            <Col xs="6">
                                                <TextField field={self.phoneForm.$("phoneVerifyCode")} />
                                            </Col>
                                            <Col xs="6" className="pt-lg no-padding-left">
                                                <Button color="info"
                                                    onClick={self.phoneForm.onSubmit.bind(this)}
                                                ><FormattedMessage id="confirm" /></Button>
                                                <Button className="fa-custom" color="link"
                                                    onClick={() => {
                                                        self.phoneForm.resetValues()
                                                        self.phoneForm.$("phoneVerifyCode").clear()
                                                        self.changeState({ isCloseEditPhoneForm: true, hideVerifyMobile: true })
                                                    }
                                                    }
                                                ><FormattedMessage id="cancel" /></Button>
                                            </Col>
                                        </Row>
                                        <Collapse isOpen={self.state.openSendMobileCaptcha}>
                                            <FormGroup>
                                                <label className="form-control-label"><FormattedMessage id="Please confirm you are not a robot to resend the verify code" /></label>
                                                <Recaptcha
                                                    elementID="mobileCaptcha"
                                                    sitekey="6LdcAE0UAAAAAHtx9fYQS7ttupIQZu5u5umrkOXL"
                                                    render="explicit"
                                                    hl="vi"
                                                    type="image"
                                                    ref={e => self.recaptchaMobileInstance = e}
                                                    verifyCallback={self.sendMobileCode.bind(this)}
                                                />
                                            </FormGroup>
                                        </Collapse>
                                        <p>
                                            <FormattedMessage id="dont_receive_message" /> <a className="link" onClick={() => {
                                                self.setState({ openSendMobileCaptcha: true })
                                            }}><FormattedMessage id="resend" /></a>
                                        </p>
                                    </Collapse>
                                </div>
                                <div className={isCloseEditEmailForm ? "close-edit-mode" : "active-block"}>
                                    <Row>
                                        <Col>
                                            <TextField className="icon-left email-icon" field={self.emailForm.$("email")} />
                                            {isCloseEditEmailForm && <Button className="edit-btn fa-custom inline" color="link"
                                                onClick={() => self.changeState({ isCloseEditEmailForm: false })}
                                            ><FormattedMessage id="edit" /></Button>}
                                        </Col>
                                    </Row>
                                    <Collapse isOpen={!isCloseEditEmailForm && hideVerifyEmail ? true : false}>
                                        <p>
                                            <FormattedMessage id="vinfin_will_send_to_email" />
                                        </p>
                                        <FormGroup>
                                            <Button color="info"
                                                onClick={self.sendEmailCode.bind(this)}
                                            ><FormattedMessage id="send_verify_code" /><i className="fas fa-arrow-right"></i></Button>
                                            <Button className="fa-custom" color="link"
                                                onClick={() => {
                                                    self.emailForm.resetValues()
                                                    self.changeState({ isCloseEditEmailForm: true })
                                                }
                                                }
                                            ><FormattedMessage id="cancel" /></Button>
                                        </FormGroup>
                                    </Collapse>
                                    <Collapse isOpen={!self.state.hideVerifyEmail}>
                                        <p>
                                            <FormattedMessage id="input_verify_code_for_email" />
                                        </p>
                                        <Row>
                                            <Col xs="6">
                                                <TextField field={self.emailForm.$("emailVerifyCode")} />
                                            </Col>
                                            <Col xs="6" className="pt-lg no-padding-left">
                                                <Button color="info"
                                                    onClick={self.emailForm.onSubmit.bind(this)}
                                                ><FormattedMessage id="confirm" /></Button>
                                                <Button className="fa-custom" color="link"
                                                    onClick={() => {
                                                        self.emailForm.resetValues()
                                                        self.emailForm.$("emailVerifyCode").clear()
                                                        self.changeState({ isCloseEditEmailForm: true, hideVerifyEmail: true })
                                                    }
                                                    }
                                                ><FormattedMessage id="cancel" /></Button>
                                            </Col>

                                        </Row>
                                        <Collapse isOpen={self.state.openSendEmailCaptcha}>
                                            <FormGroup>
                                                <label className="form-control-label"><FormattedMessage id="Please confirm you are not a robot to resend the verify code" /></label>
                                                <Recaptcha
                                                    elementID="emailCaptcha"
                                                    sitekey="6LdcAE0UAAAAAHtx9fYQS7ttupIQZu5u5umrkOXL"
                                                    render="explicit"
                                                    hl="vi"
                                                    type="image"
                                                    ref={e => self.recaptchaEmailInstance = e}
                                                    verifyCallback={self.sendEmailCode.bind(this)}
                                                />
                                            </FormGroup>
                                        </Collapse>
                                        <p>
                                            <FormattedMessage id="dont_receive_message" /> <a className="link" onClick={() => {
                                                self.setState({ openSendEmailCaptcha: true })
                                            }}><FormattedMessage id="resend" /></a>
                                        </p>
                                    </Collapse>
                                </div>
                                <h3 ref="#bank" className="sub-title"><FormattedMessage id="bankAccount" /></h3>{isCloseEditBankForm && <Button className="edit-btn fa-custom" color="link"
                                    onClick={() => self.changeState({ isCloseEditBankForm: false })}
                                ><FormattedMessage id="edit" /></Button>}
                                <div className={isCloseEditBankForm ? "close-edit-mode" : ""}>
                                    <Row>
                                        <Col>
                                            <Select className="icon-left bank-icon" field={self.bankForm.$("bank")} options={self.state.banks} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <TextField className="icon-left card-icon" field={self.bankForm.$("bankID")} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <TextField className="icon-left user-icon" field={self.bankForm.$("bankAccountName")} />
                                        </Col>
                                    </Row>
                                    <Collapse isOpen={!isCloseEditBankForm}>
                                        <FormGroup>
                                            <Button color="info"
                                                onClick={self.bankForm.onSubmit.bind(this)}
                                            ><FormattedMessage id="save" /></Button>
                                            <Button color="link"
                                                onClick={() => {
                                                    self.bankForm.resetValues()
                                                    self.changeState({ isCloseEditBankForm: true })
                                                }
                                                }
                                            ><FormattedMessage id="cancel" /></Button>
                                        </FormGroup>
                                    </Collapse>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="sub-title"><FormattedMessage id="document_copy" /></h3>
                    <Form>
                        <p>
                            <FormattedMessage id="upload_image_message" values={{ br: <br /> }} />
                        </p>
                        <div ref="#id">
                            <FormGroup>
                                <Label><FormattedMessage id={"ID_copy"} /></Label>
                                <Row>
                                    <Col xs="12" sm="6">
                                        <FormGroup>
                                            <UploadImage defaultImg={self.state.userInfo.IDFront} description={"choose_image"} callbackDrop={(files, onCompleted) => {
                                                self.uploadImage(files, "GOVERNMENTID-1", onCompleted)
                                            }} />
                                            <div className="text-center">Mặt trước</div>
                                        </FormGroup>
                                    </Col>
                                    <Col xs="12" sm="6">
                                        <FormGroup>
                                            <UploadImage defaultImg={self.state.userInfo.IDBack} label="" description={"choose_image"} callbackDrop={(files, onCompleted) => {
                                                self.uploadImage(files, "GOVERNMENTID-2", onCompleted)
                                            }} />
                                            <div className="text-center">Mặt sau</div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </div>
                        <div ref="#student-card">
                            <FormGroup >
                                <Label><FormattedMessage id={"student_card_copy"} /></Label>
                                <Row>
                                    <Col xs="12" sm="6">
                                        <FormGroup>
                                            <UploadImage defaultImg={self.state.userInfo.studentCardFront} description={"choose_image"} callbackDrop={(files, onCompleted) => {
                                                self.uploadImage(files, "STUDENTID-1", onCompleted)
                                            }} />
                                            <div className="text-center">Mặt trước</div>
                                        </FormGroup>
                                    </Col>
                                    <Col xs="12" sm="6">
                                        <FormGroup>
                                            <UploadImage defaultImg={self.state.userInfo.studentCardBack} label="" description={"choose_image"} callbackDrop={(files, onCompleted) => {
                                                self.uploadImage(files, "STUDENTID-2", onCompleted)
                                            }} />
                                            <div className="text-center">Mặt sau</div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </div>
                    </Form>
                </div>
                <div ref="#facebook" className="common-form">
                    <div>
                        <h3 className="sub-title"><FormattedMessage id="facebook_friend_verify" /></h3>
                        <Form>
                            <p>
                                <FormattedMessage id="facebook_friend_link_message" /><br />
                                <FormattedMessage id="You must have 3 confirmations" />
                                <span className="high-light">{self.state.userInfo.endorsements.length > 0 &&
                                    <div><FormattedMessage id="List friend confirmed" />
                                        {self.friendConfirmed(self.state.userInfo.endorsements)}
                                    </div>}</span>
                            </p>
                            <Row>
                                <Col xs="8" sm="9">
                                    <TextField readOnly={true} hidelabel={true} field={self.baseInfoForm.$("facebookLink")} />
                                </Col>
                                <Col xs="4" sm="3" className="no-padding-left">
                                    <Button color="secondary" className="full-width" onClick={self.copyFacebookLink.bind(this)}><FormattedMessage id="copy" /></Button>
                                </Col>
                            </Row>
                            {/* <FormGroup>
                                <Button color="info" className="full-width"><FormattedMessage id="send_info" /></Button>
                            </FormGroup> */}
                        </Form>
                    </div>
                </div>
            </div>

        )
    }

}

UpdateProfileComponent.propTypes = {
    userInfo: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(UpdateProfileComponent)))