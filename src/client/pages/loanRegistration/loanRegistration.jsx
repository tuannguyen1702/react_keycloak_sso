import React, { Component } from "react";
import _ from 'lodash'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { LoanModel, BankModel } from "./loanModel"
import { injectIntl, FormattedMessage, FormattedRelative } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage, FlipClock, CheckboxList, Checkbox, FormatNumber } from '../../components'
import { Observable } from 'rxjs/Observable'
import Rx from 'rxjs/Rx';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import loanEmpty from "../../images/loan-empty.png";
import locker from "../../images/locker.png";
import historyEmpty from "../../images/history-empty.png";
import successIcon from "../../images/success-icon.png";
import BottomPage from "../../layouts/share/_bottomPage";
import { Scrollbars } from 'react-custom-scrollbars';
import { browserHistory } from "react-router";
import UserProfileProgress from "../../layouts/share/_userProgress";
import { setUserInfo } from '../../actions'

class LoanRegistrationComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            status: "",
            productId: null,
            activeRegistrationForm: false,
            quantity: 0,
            amount: 100000,
            appliedQuantity: 0,
            tipsOption: "",
            description: "",
            eligibleApplicants: "",
            interestRate: null,
            lateInterestRate: null,
            startApplyDate: null,
            endApplyDate: null,
            latestFundDate: null,
            latestRepaymentDate: null,
            showAnotherPurpose: false,
            loanPurposes: [],
            registerSuccess: false

        }

        this.initFormModel()

    }

    initFormModel() {
        var self = this
        self.loanForm = new FormModel({ ...LoanModel }, { name: 'LoanModel' })

        self.loanForm.onSuccess = function (form) {
            var { userInfo } = self.props
            NetworkService.loans(userInfo.id, self.state.productId, userInfo.bankAccountId, form.values()).subscribe(
                function onNext(response) {
                    self.setState({ registerSuccess: true })
                    var userInfo = self.props.userInfo
                    userInfo.status = "INPROCESSING"
                    self.props.dispatch(setUserInfo(userInfo))
                },
                function onError(e) {
                },
                function onCompleted() {

                }
            )
        }
    }

    componentDidMount() {
        var self = this
        NetworkService.getLoanProducts().subscribe(
            function onNext(response) {
                if (response.length > 0) {
                    var current = moment(new Date()).format('x')
                    var status = response[0].startApplyDate > current ? 'wait' : 'open'

                    self.setState({
                        productId: response[0].id,
                        amount: response[0].amount,
                        quantity: response[0].quantity,
                        appliedQuantity: response[0].appliedQuantity,
                        tipsOption: response[0].tipsOption,
                        description: response[0].description,
                        eligibleApplicants: response[0].eligibleApplicants,
                        interestRate: response[0].interestRate,
                        lateInterestRate: response[0].lateInterestRate,
                        startApplyDate: response[0].startApplyDate,
                        endApplyDate: response[0].endApplyDate,
                        latestFundDate: response[0].latestFundDate,
                        latestRepaymentDate: response[0].latestRepaymentDate,
                        status: status
                    })

                } else {
                    self.setState({
                        status: 'empty'
                    })
                }
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )

        Rx.Observable.forkJoin(
            NetworkService.getLoanPurposes(),
            function (lst1) {

                const filteredLst = lst1.map((x) => {
                    return { value: x.id, text: x.reason }
                })

                return {
                    loanPurposes: filteredLst
                }
            }
        ).subscribe(
            function onNext(joinedResult) {
                self.setState({
                    loanPurposes: joinedResult.loanPurposes
                })
            },
            function onError() {

            },
            function onCompleted() {

            }
            )
    }


    notify() { toast.info("Cập nhật thành công") }

    changeState(objState) {
        this.setState(objState)
    }

    renderEmptyLoan() {
        var { userInfo } = this.props
        return <div className="empty-page">
            <div className="page-icon">
                <img className="empty-icon" src={loanEmpty} />
            </div>
            <div className="common-form">
                <h3 className="sub-title dark"><FormattedMessage id="Dont Have Loan Package" /></h3>
                <Form>
                    <FormGroup>
                        <p>Gói vay mới của Vinfin hiện tại chưa được mở. Trước khi gói vay mới được mở chúng tôi sẽ thông báo cho bạn qua email <span className="email">{userInfo.email}</span>.</p>
                        <BottomPage />
                    </FormGroup>
                </Form>
            </div>
        </div>
    }

    renderUserProfileNotComplete() {
        var { userInfo } = this.props
        return <div>
            <UserProfileProgress progressData={userInfo.customerInfoProgressDTO} />
            <div className="empty-page">
                <div className="page-icon">
                    <img className="empty-icon" src={locker} />
                </div>
                <div className="common-form">
                    <h3 className="sub-title dark"><FormattedMessage id="Your userprofile is not completed" /></h3>
                    <Form>
                        <FormGroup>
                            <p>Bạn cần hoàn thành hồ sơ để được đăng ký gói vay.</p>
                            <Button onClick={() => {
                                browserHistory.push({
                                    pathname: "/user-profile"
                                })
                            }} color="primary"><FormattedMessage id="Updating user profile" /> <i className="fas fa-arrow-right"></i></Button>
                            <br /><br />
                            <BottomPage />
                        </FormGroup>
                    </Form>
                </div>
            </div>
        </div>
    }

    renderUserProfileCompleted() {
        var self = this
        var { userInfo } = this.props
        return <div className="empty-page empty-history">
            <div className="page-icon">
                <img className="empty-icon" src={historyEmpty} />
            </div>
            <div className="common-form">
                <h3 className="sub-title dark"><FormattedMessage id="Your profile is complete" /></h3>
                <Form>
                    <FormGroup>
                        <p>Vinfin sẽ tiến hành xét duyệt hồ sơ và thông báo đến bạn kết quả trong khoảng 24h thông qua email <span className="email">{userInfo.email}</span></p>
                        <BottomPage />
                    </FormGroup>
                </Form>
            </div>
        </div>
    }

    renderLoanInprocessing() {
        var { userInfo } = this.props
        return <div className="empty-page">
            <div className="page-icon">
                <img className="empty-icon" src={locker} />
            </div>
            <div className="common-form">
                <h3 className="sub-title dark"><FormattedMessage id="You are inprocessing for this package" /></h3>
                <Form>
                    <FormGroup>
                        <p>Bạn chỉ có thể đăng ký vay 1 lần cho mỗi gói vay. Bạn kiểm tra Lịch sử vay và thanh toán khoản vay cũ để có thể bắt đầu đăng ký gói vay mới. Trước khi gói vay mới được mở chúng tôi sẽ thông báo cho bạn qua email <span className="email">{userInfo.email}</span>.</p>
                        <BottomPage />
                    </FormGroup>
                </Form>
            </div>
        </div>
    }

    renderLoanIndebt() {
        var { userInfo } = this.props
        return <div className="empty-page">
            <div className="page-icon">
                <img className="empty-icon" src={locker} />
            </div>
            <div className="common-form">
                <h3 className="sub-title dark"><FormattedMessage id="You have not paid your old loan" /></h3>
                <Form>
                    <FormGroup>
                        <p>Vui lòng kiểm tra lịch sử vay và thanh toán khoản vay trước đó để có thể tiếp tục đăng ký vay:</p>
                        <Button onClick={() => {
                            browserHistory.push({
                                pathname: "/loan-history"
                            })
                        }} color="primary"><FormattedMessage id="Go to the history" /> <i className="fas fa-arrow-right"></i></Button>
                        <br /><br />
                        <BottomPage />
                    </FormGroup>
                </Form>
            </div>
        </div>
    }

    renderLoanLaunching() {
        var self = this
        var { status, quantity, appliedQuantity, startApplyDate, endApplyDate, amount } = self.state
        return <div>
            <div>
                <div className="loan-banner">
                    <div className={status}>
                        {status == "open" ? <div className="banner-content">
                            <label><FormattedMessage id="LoanPackage" /></label>
                            <label className="value"><FormatNumber value={amount} afterText=" Vnđ" toFixed={0} /></label>
                            <label className="from-to-date"><FormattedMessage id="FromToDate" values={{ from: moment(self.state.startApplyDate).format("DD/MM/YYYY"), to: moment(self.state.endApplyDate).format("DD/MM/YYYY") }} /></label>
                            <label><FormattedMessage id="NumberOfLoan" /></label>
                            <label className="applied-number">{(quantity - appliedQuantity) + "/" + quantity} <FormattedMessage id="LoanPackage" /></label>
                        </div> : <div className="banner-content">
                                <label><FormattedMessage id="LoanOpening" /></label>
                                <label className="value"><FormatNumber value={amount} afterText=" Vnđ" toFixed={0} /></label>
                                <label><FormattedMessage id="TimeCountDown" /></label>
                                <FlipClock className="lbl-bottom" endDate={new Date(self.state.startApplyDate)}
                                    endCountDownHandle={() => {
                                        self.setState({ status: "open" })
                                    }} />
                            </div>}
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <h3 className="sub-title"><FormattedMessage id="LoanDetail" /></h3>
                    <Form>
                        <FormGroup>
                            <Label><FormattedMessage id="Introduce" /></Label>
                            <label className="form-text">{self.state.description}</label>
                        </FormGroup>
                        <FormGroup>
                            <Label><FormattedMessage id="LoanDuration" /></Label>
                            {self.state.startApplyDate && <label className="form-text">{moment(self.state.startApplyDate).format("DD/MM/YYYY")} - {moment(self.state.endApplyDate).format("DD/MM/YYYY")}</label>}
                        </FormGroup>
                        <FormGroup>
                            <Label><FormattedMessage id="LoanStart" /></Label>
                            {self.state.latestFundDate && <label className="form-text">{moment(self.state.latestFundDate).format("DD/MM/YYYY")}</label>}
                        </FormGroup>
                        <FormGroup>
                            <Label><FormattedMessage id="LoanRepay" /></Label>
                            {self.state.latestRepaymentDate && <label className="form-text">{moment(self.state.latestRepaymentDate).format("DD/MM/YYYY")}</label>}
                        </FormGroup>
                        <FormGroup>
                            <Label><FormattedMessage id="EligibleApplicants" /></Label>
                            {self.state.eligibleApplicants && <label className="form-text" dangerouslySetInnerHTML={{ __html: self.state.eligibleApplicants.replace(/\n/g, '<br/>') }}></label>}
                        </FormGroup>
                        <FormGroup>
                            <Button disabled={status != "open" ? true : false} size="lg" onClick={() => self.setState({ activeRegistrationForm: true })} color="primary btn-shadow md-w"><FormattedMessage id="apply_loan" /></Button>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        </div>
    }

    renderSuccess() {
        var self = this
        var { userInfo } = this.props
        return <div className="empty-page success">
            <div className="page-icon">
                <img className="empty-icon" src={successIcon} />
            </div>
            <div className="common-form">
                <h3 className="sub-title dark"><FormattedMessage id="Register successfully" /></h3>
                <Form>
                    <FormGroup>
                        <p>Sau khi hồ sơ vay được duyệt bạn sẽ được thông báo qua email <span className="email">{userInfo.email}</span></p>
                        <BottomPage />
                    </FormGroup>
                </Form>
            </div>
        </div>
    }

    renderLoanRegistration() {
        var self = this
        var { userInfo } = self.props
        if (userInfo) {
            BankModel.fields.bank.value = userInfo.bankName
            BankModel.fields.bankAccountName.value = userInfo.accountName
            BankModel.fields.bankID.value = userInfo.accountNumber
        }

        self.bankForm = new FormModel({ ...BankModel }, { name: 'Bank User Profile' })

        var { status, quantity, appliedQuantity, startApplyDate, endApplyDate, showAnotherPurpose, loanPurposes } = self.state

        return <div>
            <div className="common-form">
                <div><FormattedMessage id="Please select the purpose of your loan" /></div>
                <div>
                    <h3 className="sub-title"><FormattedMessage id="Loan purpose" /></h3>
                    <p><FormattedMessage id="You can choose one or more" /></p>
                    <Form>
                        <CheckboxList className="mobile-style check-right bg-checked" options={loanPurposes} value={self.loanForm.$("loanPurpose").value} name="loanPurpose" />
                        <Checkbox className="mobile-style check-right bg-checked" field={self.loanForm.$("anotherPurpose")} onChange={(value) => {
                            self.setState({ showAnotherPurpose: value })
                        }} />
                        <Collapse isOpen={showAnotherPurpose}>
                            <TextField hidelabel={true} field={self.loanForm.$("anotherPurposeText")} />
                        </Collapse>
                    </Form>
                    <h3 className="sub-title"><FormattedMessage id="Your bank information" /></h3>
                    <p><FormattedMessage id="Vinfin supports receiving money through Internetbanking" /></p>
                    <Form className="close-edit-mode">
                        <Row>
                            <Col>
                                <TextField className="icon-left bank-icon" field={self.bankForm.$("bank")} />
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
                    </Form>
                    <h3 className="sub-title"><FormattedMessage id="Loan terms" /></h3>
                    <Form>
                        <FormGroup className="pannel-scroll">
                            <Scrollbars
                                style={{ height: 300 }}>
                                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                            </Scrollbars>
                        </FormGroup>
                        <FormGroup>
                            <Checkbox className="mobile-style lg-circle-check" field={self.loanForm.$("agreementLoanTerms")} />
                        </FormGroup>
                        <FormGroup>
                            <Button onClick={self.loanForm.onSubmit.bind(this)} color="info" className="full-width"><FormattedMessage id="send_info" /></Button>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        </div>
    }

    renderLoan() {
        if (this.state.activeRegistrationForm) {
            return this.renderLoanRegistration()
        } else {
            return this.renderLoanLaunching()
        }
    }

    mainReder() {
        var self = this
        var { status, quantity, appliedQuantity, startApplyDate, endApplyDate } = self.state
        var { userInfo } = self.props
        //userInfo.status = "INDEBT"

        if (userInfo.status == "INPROCESSING") {
            return self.renderLoanInprocessing()
        } else if (userInfo.status == "INDEBT") {
            return self.renderLoanIndebt()
        } else if (userInfo.status == "OPEN") {
            return self.renderUserProfileNotComplete()
        } else if (userInfo.status == "QUALIFIED") {
            return self.renderUserProfileCompleted()
        }
        else if (userInfo.status == "APPROVED") {
            return status != "" ? (status != "empty" ? self.renderLoan() : self.renderEmptyLoan()) : ""
        } else {
            return self.renderEmptyLoan()
        }

    }

    render() {
        var self = this
        var { status, quantity, appliedQuantity, startApplyDate, endApplyDate, registerSuccess } = self.state
        var { userInfo } = self.props
        return (
            <div>{userInfo != null ? <div>
                <ToastContainer hideProgressBar={true} closeButton={false} style={{ top: "85px", textAlign: "center" }} />
                <div className={"main-title-container" + (userInfo.status == "OPEN" ? " message-zone-container" : "")}>
                    <h2 className="main-title"><FormattedMessage id="apply_loan" /></h2>
                    {
                        registerSuccess ? self.renderSuccess() : self.mainReder()
                    }
                </div>

            </div> : <div></div>}</div>

        )
    }

}


LoanRegistrationComponent.propTypes = {
    userInfo: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(LoanRegistrationComponent)))