import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Row, Col, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, Dropdown, DropdownMenu, DropdownItem, Button, Collapse, Navbar, NavbarToggler, NavbarBrand } from 'reactstrap';
import logo from "../../images/logo.svg";
import userDefault from "../../images/user-default.png";
import { browserHistory } from "react-router";
import { injectIntl, IntlProvider, FormattedMessage, addLocaleData } from 'react-intl';
import viLocaleData from 'react-intl/locale-data/vi'
import enLocaleData from 'react-intl/locale-data/en'
import viMessages from '../../langs/vi-VN.json';
import enMessages from '../../langs/en-US.json';

import NetworkService from "../../network/NetworkService"

addLocaleData(viLocaleData)
addLocaleData(enLocaleData)

const messages = {
  vi: viMessages,
  en: enMessages
}

class GuestLayout extends Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this);
    this.state = {
      user: "",
      dropdownOpen: false,
      locale: "vi",
      avatar: userDefault
    }
  }

  changeLang(lang) {
    this.setState({
      locale: lang
    });
  }

  toggle() {
    console.log(!this.state.dropdownOpen)
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  goToUrl(url) {
    browserHistory.push({
      pathname: url
    });
  }

  render() {
    var self = this
    const { keycloak, dispatch, children } = this.props;

    const logout = () => {
      keycloak.logout()
    }

    return (
      <IntlProvider locale={this.state.locale} messages={messages[this.state.locale]}>
        <div>
          <div className="header">
            <Container fluid={true}>
              <Row>
                <Col>
                  <Row>
                    <Col xs="12">
                      <h1>
                        <img src={logo} className="logo" alt="vinfin"
                          onClick={() => {
                            window.location = '//vinfin.io/'
                          }} />
                      </h1>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </div>
          <Container className="guest content" fluid={true}>
            <Row>
              <Col className="main-content">
                {children}
              </Col>
            </Row>
          </Container>
        </div>
      </IntlProvider>
    );
  }
}

GuestLayout.propTypes = {
  keycloak: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    keycloak: state.keycloak
  };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(GuestLayout);