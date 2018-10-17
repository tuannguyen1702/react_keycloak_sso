import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import FriendVerifyModel from "./friendVerifyModel"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage } from '../../components'
import { browserHistory } from "react-router";

import FacebookLogin from 'react-facebook-login'

import friendVerifyImg from "../../images/friend-verify.png";
import friendVerifiedImg from "../../images/friend-verified.png";

class FriendVerifyComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            name: "",
            verified: false,
            error: false
        }
    }

    componentDidMount() {
        var self = this
        self.setState({
            id: self.props.location.query.id,
            name: self.props.location.query.name,
            verified: self.props.location.query.verified || false
        })

    }


    responseFacebook(response) {
        var self = this
        var data = {
            name: response.name,
            facebook: response.id,
        }

        NetworkService.friendVerify(this.state.id, data).subscribe(
            function onNext(response) {
                self.setState({ error: false })
                window.location = self.props.location.pathname + self.props.location.search + "&verified=true"
            },
            function onError(e) {
                if (e.response.status == 400) {
                    self.setState({ error: true })
                }
            },
            function onCompleted() {

            }
        )
    }


    render() {
        var self = this
        var mess_id = self.state.verified ? "friend_verified_message" : "friend_verify_message"
        return (
            <div>
                <div className="common-form">
                    <h2 className="main-title"><FormattedMessage id="friendVerify" /></h2>
                    <div>
                        <img className="mt-md mb-md" src={self.state.verified ? friendVerifiedImg : friendVerifyImg} />
                        <p>
                            <FormattedMessage id={mess_id} values={{ br: <br />, FirstName: <b>{self.state.name}</b>, FullName: <b>{self.state.name}</b> }} />
                        </p>

                        <Form>
                            <FormGroup>
                                {!self.state.verified && <FacebookLogin
                                    appId="369695906837320"
                                    fields="name,email,picture"
                                    callback={(response) => {
                                        self.responseFacebook(response)
                                    }
                                    }
                                    cssClass="fa-custom ico-btn-left fb-btn fa-facebook btn"
                                    textButton={<FormattedMessage id="friendVerify" />}
                                />}
                                <br />
                                <small hidden={!self.state.error} className="error"><FormattedMessage id="You cannot verify yourself" /></small>
                            </FormGroup>
                            <p>
                            Mọi thắc mắc về việc xác thực bạn bè và Vinfin bạn có thể truy cập các đường dẫn bên dưới để được hỗ trợ kịp thời.
                            </p>
                            <FormGroup>
                                <Button outline color="secondary" className="full-width ico-btn-left far fa-question-circle"
                                    onClick={() => {
                                        window.open('//vinfin.io/', '_blank')
                                    }}><FormattedMessage id="Frequently Asked Questions" /></Button>
                            </FormGroup>
                            <div>
                                <Button outline color="secondary" className="full-width ico-btn-left fab fa-whatsapp"
                                    onClick={() => {
                                        window.open('//vinfin.io/', '_blank')
                                    }}><FormattedMessage id="support" /></Button>
                            </div>
                            {/* <FormGroup>
                                <Button color="secondary" className="full-width"
                                    onClick={() => {
                                        window.open('//vinfin.io/', '_blank')
                                    }}><FormattedMessage id="Back Home Page" /></Button>
                            </FormGroup> */}
                        </Form>
                    </div>
                </div>
            </div>

        )
    }

}


export default injectIntl(observer(FriendVerifyComponent))