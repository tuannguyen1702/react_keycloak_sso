import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import NetworkService from "../../network/NetworkService"
import { FormattedMessage } from 'react-intl';

class DashboardComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            avatar: ""
        }
    }

    componentDidMount() {
        var self = this
        // NetworkService.getAvatar().subscribe(
        //     function onNext(response) {
        //         if (response) {
        //             //console.log(new Buffer(response, 'binary').toString('base64'))
        //             self.setState({ avatar: "data:image/png;base64," + response })
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

    render() {
        return (
            <div style={{innerHeight: "1000px"}}><h1>Hồ sơ cá nhân</h1><br />
            
                {/* <img src={this.state.avatar} alt="Red dot" /> */}
            </div>

        )
    }

}


export default DashboardComponent