import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, notification, Icon } from 'antd';
import * as actions from '../actions/index.js';
import LoginForm from './loginform.jsx';
import logo from '../../../beatbooklogo.png';

const LoginFormContainer = Form.create()(LoginForm); // component for antd loginform

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  submitLogin(username, password) {
    this.actions.submitLogin(username, password, (badResults) => {
      notification.open({ message: badResults });
    });
  }

  goBackToHome() {
    this.props.actions.loadHomePage();
  }

  render() {
    return (
      <div>
        <a style={styles.goBack} onClick={() => this.goBackToHome()}>
          <Icon type="arrow-left" style={styles.backArrow} />
          <div style={styles.backText}>Back to Home</div>
        </a>
        <div style={styles.loginbox} >
          <img src={logo} style={styles.logo} alt="" />
          <div style={styles.loginform}>
            <LoginFormContainer submitLogin={this.submitLogin} />
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => (
  { store: state }
);

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(actions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(Login);


const styles = {
  logo: {
    filter: 'invert(1)',
    height: 75,
    width: 75,
    position: 'relative',
    marginBottom: 20,
  },
  loginform: {
    position: 'relative',
    width: '50%',
    left: '25%',
  },
  loginbox: {
    backgroundColor: 'Transparent',
    position: 'absolute',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: 'Transparent',
    width: '50%',
    height: '90%',
    left: '25%',
    top: '5%',
    textAlign: 'center',
  },
  log: {
    display: 'inline-block',
  },
  backArrow: {
    fontSize: 20,
    color: 'white',
    display: 'inline-block',
  },
  backText: {
    fontSize: 15,
    display: 'inline-block',
    color: 'white',
    font: 'Roboto',
  },
  goBack: {
    position: 'absolute',
    top: '2%',
    left: '2%',
  },
};
