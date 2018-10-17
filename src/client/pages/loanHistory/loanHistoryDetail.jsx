import React, { Component } from "react";
import _ from 'lodash'
import PropTypes from "prop-types";
import { connect } from 'react-redux'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { BankModel } from "./loanHistoryDetailModel"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card, Alert } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage, Table, RadioButton, FormatNumber } from '../../components'
import { Observable } from 'rxjs/Observable'
import Rx from 'rxjs/Rx';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import { browserHistory } from "react-router"
import Recaptcha from 'react-recaptcha';

class LoanHistoryDetailComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loanDetail: null,
            tipsOption: [],
            vinfinBankAccounts: null,
            vinfinBankAccountForSelect: null,
            showAnotherTipValue: false,
            captChaNotVerify: true
        }

        this.total = 0

        this.initFormModel()
    }
    initFormModel() {
        var self = this

        if (self.props.userInfo) {
            BankModel.fields.phoneNumber.value = self.props.userInfo.phoneNumber.replace('+84', '') || ''
        }

        self.bankForm = new FormModel({ ...BankModel }, { name: 'Bank User Profile' })

        self.bankForm.onSuccess = function (form) {
            var data = form.values()
            data.amount = self.total
            var accountSelect = self.state.vinfinBankAccounts[data.bank == "" ? 0 : data.bank]
            data.bankAccountId = accountSelect.id
            data.loanId = self.props.params["id"]

            //console.log(self.total)
            NetworkService.sendBill(self.props.userInfo.id, data).subscribe(
                function onNext(response) {
                    self.notify()
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
        var id = self.props.params["id"]

        Rx.Observable.forkJoin(
            NetworkService.loanDetail(id),
            NetworkService.getBankAccountVinFin(),
            function (lst1, lst2) {

                const filteredLst2 = lst2.map((x, y) => {
                    return { value: y, text: x.bankName }
                })

                var tipsOption = []

                if (lst1.tipsOption) {
                    const tipsOptionArray = lst1.tipsOption.split(";")

                    tipsOption = tipsOptionArray.map((x) => {
                        var newValue = parseInt(parseInt(x) - lst1.transactionFee)
                        return { value: newValue, text: <FormatNumber value={newValue} toFixed={0} /> }
                    })
                    tipsOption.push({ value: -1, text: <FormattedMessage id="Orther" /> })

                }

                return {
                    loanDetail: lst1,
                    tipsOption: tipsOption,
                    vinfinBankAccounts: lst2,
                    vinfinBankAccountForSelect: filteredLst2
                }
            }
        ).subscribe(
            function onNext(joinedResult) {

                if (joinedResult.tipsOption.length > 0) {
                    self.bankForm.$("tipValue").value = joinedResult.tipsOption[0].value
                }

                self.setState({
                    loanDetail: joinedResult.loanDetail,
                    tipsOption: joinedResult.tipsOption,
                    vinfinBankAccounts: joinedResult.vinfinBankAccounts,
                    vinfinBankAccountForSelect: joinedResult.vinfinBankAccountForSelect
                })
            },
            function onError() {

            },
            function onCompleted() {

            }
            )
    }


    notify() { toast.info("Gửi tin nhắn thành công") }

    render() {
        var self = this
        var { userInfo } = self.props
        var { loanDetail, vinfinBankAccounts, tipsOption, showAnotherTipValue, vinfinBankAccountForSelect, captChaNotVerify } = self.state
        if (loanDetail != null) {
            self.total = loanDetail.amount + loanDetail.transactionFee
            if (self.bankForm.$("tipValue").value != "") {
                if (self.bankForm.$("tipValue").value > -1) {
                    self.total = self.total + self.bankForm.$("tipValue").value
                }
                else {
                    self.total = (parseInt(self.bankForm.$("anotherTipValue").value) || 0) + self.total
                }

            }
        }
        var bankSelect = null
        if (vinfinBankAccounts != null) {
            if (self.bankForm.$("bank").value != "") {
                bankSelect = vinfinBankAccounts[self.bankForm.$("bank").value]
            } else {
                bankSelect = vinfinBankAccounts[0]
            }
        }


        return (
            <div>
                <ToastContainer hideProgressBar={true} closeButton={false} style={{ top: "85px", textAlign: "center" }} />
                <div>
                    <div className="main-title-container">
                        <h2 className="main-title"><FormattedMessage id="Loan payment" /></h2>
                    </div>
                    {loanDetail && <Form className="common-form">
                        <div className="alert alert-primary" role="alert">
                            <Row >
                                <Col xs="8">
                                    <span className="font-weight-bold"><FormattedMessage id="Contract number" /></span>
                                </Col>
                                <Col xs="4" className="text-right text-primary">
                                    {loanDetail.hashId}
                                </Col>
                            </Row>
                        </div>
                        <h3 className="sub-title"><FormattedMessage id="Payment Information" /></h3>
                        <Row >
                            <Col xs="8">
                                <span className="font-weight-bold"><FormattedMessage id="Amount to pay" /></span>
                            </Col>
                            <Col xs="4" className="text-right text-primary">
                                <span className="font-weight-bold"><FormatNumber value={loanDetail.amount} toFixed={0} /></span>
                            </Col>
                        </Row>
                        <hr className="my-4" />
                        <Row>
                            <Col xs="8">
                                <label className="font-weight-bold"><FormattedMessage id="Transfer fees" /></label><br />
                                <FormattedMessage id="Include a fee to transfer Vinfin to you" />
                            </Col>
                            <Col xs="4" className="text-right text-primary">
                                <span className="font-weight-bold"><FormatNumber value={loanDetail.transactionFee} toFixed={0} /></span>
                            </Col>
                        </Row>
                        <hr className="my-4" />
                        <Row>
                            <Col xs="12">
                                <label className="font-weight-bold"><FormattedMessage id="Tip" /></label><br />
                                <label><FormattedMessage id="The cost will be used for those who are experiencing difficulties" /></label>
                            </Col>
                            <Col xs="12">
                                <RadioButton className="mobile-style check-right bg-checked inline-select check-top sm-circle-check hide-uncheck" field={self.bankForm.$("tipValue")} options={tipsOption}
                                    onChange={(e) => {
                                        if (e < 0) {
                                            self.setState({ showAnotherTipValue: true })
                                        }
                                        else {
                                            self.setState({ showAnotherTipValue: false })
                                        }
                                    }}
                                />
                            </Col>
                            <Col xs="12">
                                <Collapse isOpen={showAnotherTipValue}>
                                    <TextField className="mt-md" hidelabel={true} field={self.bankForm.$("anotherTipValue")} />
                                </Collapse>
                            </Col>
                        </Row>
                        <hr className="my-4" />
                        <Row>
                            <Col xs="8">
                                <label className="font-weight-bold text-danger"><h5><FormattedMessage id="Tip" /></h5></label><br />
                            </Col>
                            <Col xs="4" className="text-right">
                                <label className="font-weight-bold text-danger"><h5><FormatNumber value={self.total} toFixed={0} /></h5></label>
                            </Col>
                        </Row>
                        <h3 className="sub-title"><FormattedMessage id="Vinfin bank account" /></h3>
                        <Row>
                            <Col>
                                {<Select className="icon-left bank-icon" field={self.bankForm.$("bank")} options={vinfinBankAccountForSelect} />}
                            </Col>
                        </Row>
                        {bankSelect && <div className="alert alert-secondary" role="alert">
                            <FormGroup>
                                <Label><FormattedMessage id="Receiver" />:</Label>
                                <label className="form-text">{bankSelect.accountName}</label>
                            </FormGroup>
                            <FormGroup>
                                <Label><FormattedMessage id="bankID" />:</Label>
                                {<label className="form-text">{bankSelect.accountNumber}</label>}
                            </FormGroup>
                            {/* <FormGroup>
                                <Label><FormattedMessage id="LoanStart" /></Label>
                                {<label className="form-text">{bankSelect.bankCode}</label>}
                            </FormGroup> */}
                            <div>
                                <Label><FormattedMessage id="Content" />:</Label>
                                {<label className="form-text">{loanDetail.hashId}</label>}
                            </div>
                        </div>}

                        <FormGroup className="btn-right-textbox">
                            <TextField disabled className="icon-left mobile-icon vi-mobile" field={self.bankForm.$("phoneNumber")} />
                        </FormGroup>
                        <FormGroup>
                            <label className="form-control-label"><FormattedMessage id="Please confirm you are not a robot to resend the message" /></label>
                            <Recaptcha
                                elementID="mobileCaptcha"
                                sitekey="6LdcAE0UAAAAAHtx9fYQS7ttupIQZu5u5umrkOXL"
                                render="explicit"
                                hl="vi"
                                type="image"
                                verifyCallback={() => {
                                    self.setState({ captChaNotVerify: false })
                                }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Button disabled={captChaNotVerify} color="info"
                                onClick={self.bankForm.onSubmit.bind(this)}
                            ><FormattedMessage id="Send" /></Button>
                        </FormGroup>
                        <FormGroup>
                            <Button color="secondary" onClick={() => {
                                browserHistory.push("/loan-history")
                            }} className="full-width"><FormattedMessage id="Back to history" /></Button>
                        </FormGroup>
                    </Form>}
                </div>
            </div>

        )
    }

}

LoanHistoryDetailComponent.propTypes = {
    userInfo: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(LoanHistoryDetailComponent)))