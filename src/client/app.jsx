import React from "react";
import { render } from "react-dom";
import { routes } from "./routes";
import { Router, browserHistory } from "react-router";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reducers";
import { combineReducers } from "redux";
import Keycloak from "keycloak-js";
import "./styles/index.styl";
import NetworkService from "./network/NetworkService"

window.webappStart = () => {
  const initialState = window.__PRELOADED_STATE__;

  const store = createStore(rootReducer, initialState);

  var token = localStorage.getItem("token")

  console.log(initialState)

  if (!initialState.isGuest) {
    const kc = Keycloak('/keycloak.json');
    kc.init({ onLoad: 'check-sso', flow: 'implicit' }).success(authenticated => {
      console.log(authenticated);
      if (authenticated) {
        store.getState().keycloak = kc;
        localStorage.setItem("token", kc.token)
        NetworkService.getUserInfo().subscribe(
          function onNext(response) {
            if (response) {
              //response.status = "APPROVED"
              // response.customerInfoProgressDTO.progress.UPDATE_BANK_ACCOUNT.status = false
              // response.customerInfoProgressDTO.completedActions = 4
              store.getState().userInfo = response
              store.getState().fullName = response.firstname + " " + response.lastname
            } else {
              console.log("Failed")
            }
          },
          function onError(e) {
            console.log("onError")
          },
          function onCompleted() {
            render(
              <Provider store={store}>
                <Router history={browserHistory}>{routes}</Router>
              </Provider>
              ,
              document.querySelector(".js-content")
            );

          }
        )

        console.log(kc.token)
      } else {
        // show possibly other page here...
        kc.login();
      }
    });
  } else {
    render(
      <Provider store={store}>
        <Router history={browserHistory}>{routes}</Router>
      </Provider>
      ,
      document.querySelector(".js-content")
    );
  }

};
