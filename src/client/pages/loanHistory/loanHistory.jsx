import React, { Component } from "react";
import _ from 'lodash'
import PropTypes from "prop-types";
import { connect } from 'react-redux'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage, Table } from '../../components'
import { Observable } from 'rxjs/Observable'
import Rx from 'rxjs/Rx';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import { browserHistory } from "react-router";
import historyEmpty from "../../images/history-empty.png";
import locker from "../../images/locker.png";
import BottomPage from "../../layouts/share/_bottomPage";
import UserProfileProgress from "../../layouts/share/_userProgress";

class LoanHistoryComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loanList: null
        }


        this.loanListCol = [
            {
                name: <FormattedMessage id="Contract number" />,
                mapData: "hashId",
                binding: (data) => {
                    return <a className="high-light"
                        //onClick={() => this.historyDetail(data.id)} 
                        className={data.status.toLowerCase()}>{data.hashId}</a>
                }
            },
            {
                name: <FormattedMessage id="Loan package VND" />,
                mapData: "amount"
            },
            {
                name: <FormattedMessage id="Sign date" />,
                mapData: "applyDate",
                binding: (data) => {
                    return moment(data.applyDate).format("DD/MM/YYYY")
                }
            },
            {
                name: <FormattedMessage id="Expiration date" />,
                mapData: "latestRepaymentDate",
                binding: (data) => {
                    return moment(data.latestRepaymentDate).format("DD/MM/YYYY")
                }
            },
            {
                name: <FormattedMessage id="Status" />,
                mapData: "status",
                binding: (data) => {
                    return <div className={data.status.toLowerCase()}><FormattedMessage id={data.status} /></div>
                }
            },
            {
                name: "",
                mapData: "status",
                binding: (data) => {
                    return this.showBotton(data.status, data.id)
                }
            }
        ]
    }

    historyDetail(id) {
        browserHistory.push({
            pathname: "/loan-history/" + id
        });
    }


    showBotton(status, id) {
        var self = this
        var result = ""
        switch (status) {
            case "FUNDED":
            case "LATE":
            case "PARTIALLYPAID":
                result = <Button color="info" onClick={() => self.historyDetail(id)} className="full-width"><FormattedMessage id="Repay" /></Button>
                break
        }
        return result
    }

    componentDidMount() {
        var self = this
        var { userInfo } = self.props
        if (userInfo != null) {
            NetworkService.getLoanHistory(userInfo.id).subscribe(
                function onNext(response) {

                    var data = response.length > 0 ? response : []
                    self.setState({ loanList: data })
                },
                function onError(e) {
                    console.log("onError")
                },
                function onCompleted() {

                }
            )
        }

    }



    notify() { toast.info("Cập nhật thành công") }

    changeState(objState) {
        this.setState(objState)
    }

    goToUrl(url) {
        browserHistory.push({
            pathname: url
        });
    }

    renderEmptyHistory() {
        var self = this
        return <div className="empty-page empty-history">
            <div className="page-icon">
                <img className="empty-icon" src={historyEmpty} />
            </div>
            <div className="common-form">
                <h3 className="sub-title dark"><FormattedMessage id="You dont have loan history" /></h3>
                <Form>
                    <FormGroup>
                        <p><FormattedMessage id="Your profile has been verified, now you can start your first loan" /></p>
                    </FormGroup>
                    <FormGroup>
                        <Button onClick={() =>
                            self.goToUrl("/loan-registration")
                        } color="primary btn-shadow md-w"><FormattedMessage id="apply_loan" /></Button>
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

    mainReder() {
        var self = this
        var { userInfo } = self.props
        var { loanList } = self.state

        if (userInfo.status == "OPEN") {
            return self.renderUserProfileNotComplete()

        } else if (userInfo.status == "QUALIFIED") {
            return self.renderUserProfileCompleted()
        }
        else {
            return loanList != null ? (loanList.length > 0 ? <Table className="mobile-tbl" tableData={loanList} colData={self.loanListCol} /> : this.renderEmptyHistory()) : ""
        }

    }

    render() {
        var self = this
        var { userInfo } = self.props
        var { loanList } = self.state
        return (
            <div>
                <ToastContainer hideProgressBar={true} closeButton={false} style={{ top: "85px", textAlign: "center" }} />
                <div className={userInfo.status == "OPEN" ? " message-zone-container" : ""}>
                    <div className="main-title-container" >
                        <h2 className="main-title"><FormattedMessage id="loan_history" /></h2>
                    </div>
                    {userInfo && self.mainReder()}
                </div>
            </div>

        )
    }

}

LoanHistoryComponent.propTypes = {
    userInfo: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(LoanHistoryComponent)))