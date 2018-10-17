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

class MasterLayout extends Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this);
    this.state = {
      user: "",
      dropdownOpen: false,
      locale: "vi",
      avatar: props.userInfo != null ? props.userInfo.avatarImageId : userDefault,
      menuShow: '',
    }
  }

  changeLang(lang) {
    this.setState({
      locale: lang
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  componentDidMount() {
    // var self = this
    // NetworkService.getUserInfo().subscribe(
    //   function onNext(response) {
    //     if (response) {
    //       self.setState({ user: response.firstname + " " + response.lastname, avatar: response.avatarImageId })
    //       self.props.dispatch(setUserInfo(response))
    //     } else {
    //       console.log("Failed")
    //     }
    //   },
    //   function onError(e) {
    //     console.log("onError")
    //   },
    //   function onCompleted() {

    //   }
    // )
  }

  goToUrl(url) {
    this.showMenu()
    browserHistory.push({
      pathname: url
    });
  }

  showMenu() {
    this.setState({ menuShow: !this.state.menuShow ? "show" : "" })
  }

  logout() {
    const { keycloak } = this.props;
    localStorage.removeItem("token")
    keycloak.logout()
  }

  render() {
    var self = this
    const { keycloak, dispatch, children, userInfo } = this.props;

    return (
      <IntlProvider locale={this.state.locale} messages={messages[this.state.locale]}>
        {userInfo != null ?
          <div>
            <div className="header">
              <Container fluid={true}>
                <Row>
                  <Col>
                    <Row>
                      <Col xs="6">
                        <h1>
                          <img src={logo} className="logo" alt="vinfin"
                            onClick={() => {
                              browserHistory.push({
                                pathname: "/"
                              })
                            }} />
                        </h1>
                      </Col>
                      <Col xs="6" className="text-right">
                        {/* <Button color="link" onClick={() => this.changeLang("en")}>EN</Button>
                        <Button color="link" onClick={() => this.changeLang("vi")}>VI</Button> */}
                        <div className={"menu-btn d-none " + self.state.menuShow} color="link" onClick={() => self.showMenu()}>
                          <span></span>
                        </div>
                        <div className="avatar-container d-none d-md-block">
                          <div className="avatar"><img src={self.state.avatar} onError={() => {
                            self.setState({ avatar: userDefault })
                          }} alt="vinfin" /></div>
                          <Dropdown className="dropdown-name" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle tag="span" caret>
                              {userInfo.firstname + " " + userInfo.lastname}
                            </DropdownToggle>
                            <DropdownMenu right={true}>
                              <DropdownItem>
                                <Button color="link" onClick={() => self.logout()}><FormattedMessage id="Logout" /></Button>
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>

                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Container>
            </div>
            <Container className="content" fluid={true}>
              <Row>
                <Col className={"sidebar " + self.state.menuShow}>
                  <Nav vertical>
                    <NavItem>
                      <Button onClick={() => self.goToUrl("/loan-registration")} color="pec btn-shadow md-w"><FormattedMessage id="apply_loan" /></Button>
                    </NavItem>
                    <NavItem>
                      <NavLink onClick={() => self.goToUrl("/user-profile")}><i className="fa fa-old fa-user-o" aria-hidden="true"></i><FormattedMessage id="user_profile" /></NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink onClick={() => self.goToUrl("/loan-history")}><i className="far fa-clock" aria-hidden="true"></i><FormattedMessage id="loan_history" /></NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="http://vinfin.io/" target="_blank"><i className="far fa-question-circle" aria-hidden="true"></i><FormattedMessage id="FAQ" /></NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="http://vinfin.io/" target="_blank"><i className="fab fa-whatsapp" aria-hidden="true"></i><FormattedMessage id="support" /></NavLink>
                    </NavItem>
                    <NavItem className="d-block d-md-none">
                      <hr className="my-4" />
                    </NavItem>
                    <NavItem className="d-block d-md-none">
                      <NavLink onClick={() => self.logout()}><FormattedMessage id="Logout" /></NavLink>
                    </NavItem>

                    {/* <NavItem>
                    <NavLink href="#"><i className="far fa-envelope" aria-hidden="true"></i><FormattedMessage id="request_friend" /></NavLink>
                  </NavItem> */}
                  </Nav>
                </Col>
                <Col className="main-content">
                  {children}
                </Col>
              </Row>
            </Container>
          </div>
          : <div></div>}

      </IntlProvider>
    );
  }
}

MasterLayout.propTypes = {
  keycloak: PropTypes.object,
  userInfo: PropTypes.object,
  fullName: PropTypes.string,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    keycloak: state.keycloak,
    userInfo: state.userInfo,
    fullName: state.fullName
  };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(MasterLayout);