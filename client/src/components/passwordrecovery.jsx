import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Modal, Input, notification, message } from 'antd';
import axios from 'axios';
// import * as actions from '../actions/index.js';

class PasswordRecovery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmPassword: '',
      modalStatus: true,
    };
  }

  componentDidMount() {
    console.log(this.props.match.params);
  }

  passwordCheck() {
    return this.state.password === this.state.confirmPassword ?
      this.changePassword() :
      this.passwordError();
  }

  changePassword() {
    this.setState({ modalStatus: false });
    message.success('Your Password has been changed! You can close this window!');
    axios.post('/change/password', {
      email: this.props.match.params.email,
      password: this.state.password,
      token: this.props.match.params.token,
    }).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  passwordError() {
    notification.open({
      message: 'Error',
      description: 'Your Passwords do Not match',
    });
  }

  notify() {
    notification.open({
      message: 'Change your password or close this Window',
    });
  }

  render() {
    return (
      <div>
        <Modal
          visible={this.state.modalStatus}
          onCancel={() => this.notify()}
          // footer={null}
          title="Please enter your new Password"
          onOk={() => this.passwordCheck()}
          style={{ textAlign: 'center' }}
        >
          <Input style={styles.modalInput} placeholder="Enter Password" onChange={e => this.setState({ password: e.target.value })} />
          <Input style={styles.modalInput} placeholder="Confirm Password" onChange={e => this.setState({ confirmPassword: e.target.value })} />
        </Modal>
      </div>
    );
  }
}


export default withRouter(connect()(PasswordRecovery));

const styles = {
  container: {
    display: 'inline-block',
  },
  input: {
    height: 50,
  },
  button: {
    height: 50,
    backgroundColor: '#e6005c',
    borderRadius: 25,
    borderColor: 'Transparent',
    fontSize: 17,
  },
  anchor: {
    color: 'white',
  },
  modalButton: {
    width: '30%',
    display: 'inline-block',
  },
  modalInput: {
    width: '75%',
  },
};

