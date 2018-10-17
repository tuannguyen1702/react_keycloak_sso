import React from "react";
import _ from 'lodash'
import FormModel from '../../commons/forms/_.extend'
import LoginModel from "./loginModel"
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import FormGeneration from "../../components/FormGeneration"
import TextField from '../../components/textField/TextField'
import { Label, Input, FormGroup } from 'reactstrap';
import { IntlProvider, FormattedMessage } from "react-intl";
import messages from "../../langs/index"
import { Table } from '../../components'
//import MultiLanguage from 'react-redux-multilang'
import { connect } from 'react-redux'

class LoginPage extends React.Component {
    constructor(props) {
        super(props)
        this.initFormModel()

        this.state = {
            byeMsg: "Bye...",
            isByeVisible: false
        }

    }

    initFormModel() {
        var self = this
        self.fm = new FormModel({ ...LoginModel }, { name: 'Login Form' })

        self.fm.onSuccess = function (form) {
            //console.log(form.values())
            //   NetworkService.login(form.values(), 1).subscribe(
            //       function onNext(response) {
            //           if (response.Result) {
            //               console.log(response.Data)
            //               localStorage.setItem("token", response.Data)
            //           } else {
            //               console.log("Failed")
            //           }
            //       },
            //       function onError(e) {
            //           console.log("onError")
            //       },
            //       function onCompleted() {

            //           console.log("onCompleted")
            //           NetworkService.fetchProfile().subscribe(
            //               function onNext(response) {
            //                   if (response.Result) {
            //                       console.log("Profile")

            //                   } else {
            //                       console.log("Failed")
            //                   }
            //               },
            //               function onError(e) {
            //                   console.log("onError")
            //               },
            //               function onCompleted() {
            //                   console.log("onCompleted -Profile")
            //               },
            //           )
            //       }
            //   )
        }
    }



    render() {
        var form = this.fm
        const tableDataDafault = [
            {
                id: "aaaaaaa",
                name: 'John Smith',
                status: 'Employed',
            },
            {
                id: "bbbbbb",
                name: 'John Smith',
                status: 'Employed',
            },
            {
                id: "cccccc",
                name: 'John Smith',
                status: 'Employed',
            }, {
                id: "ddddddd",
                name: 'John Smith',
                status: 'Employed',
            }
        ];

        // const translate = new MultiLanguage({
        //     en: {
        //         text: 'text here',
        //         deep: {
        //             text: 'deep text here'
        //         }
        //     },
        //     ru: {
        //         text: 'текст тут',
        //         deep: {
        //             text: 'вложенный текст тут'
        //         }
        //     }
        // })

        const col = [
            {
                name: "#",
                binding: (value, index) => {
                    return index + 1
                }
            },

            {

                name: "Name", mapData: "name",
                binding: (value, index) => {
                    return <button type="button" onClick={() => {
                        alert(value.id)
                    }}>{value["name"]}</button>
                }
            },
            {
                name: "Status", mapData: "status"
            }
        ];

        return (
            <IntlProvider>
                <div className="abcd">
                    <FormGeneration form={form} model={LoginModel.fields} />
                    <br />
                    <button type="submit" onClick={form.onSubmit}>Submit</button>
                    <button type="button" onClick={form.onClear}>Clear</button>
                    <button type="button" onClick={form.onReset}>Reset</button>

                    <Table tableData={tableDataDafault} colData={col} />

                    {/* <div>
                    <p>{translate.text}</p>
                    <p>{translate.deep.text}</p>
                </div> */}
                </div>


            </IntlProvider>

        )
    }



}


export default observer(LoginPage)