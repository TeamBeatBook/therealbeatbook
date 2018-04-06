import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Checkbox, Modal, Col, message } from 'antd';
import { withRouter } from 'react-router';
import axios from 'axios';
import * as actions from '../actions/index.js';

const FormItem = Form.Item;


class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registerModalStatus: false,
      forgotPasswordModalStatus: false,
      email: '',
    };
  }


  submitLogin(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submitLogin(values.userName, values.password);
      }
    });
  }

  sendEmail() {
    this.closeForgotPasswordModal();
    message.success(`Sending email to ${this.state.email}`);
    axios.post('/forgot/password', {
      email: this.state.email,
    }).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }


  openForgotPasswordModal() {
    this.setState({ forgotPasswordModalStatus: true });
  }

  closeForgotPasswordModal() {
    this.setState({ forgotPasswordModalStatus: false });
  }

  openRegisterModal() {
    this.setState({ registerModalStatus: true });
  }

  closeRegisterModal() {
    this.setState({ registerModalStatus: false });
  }

  loadArtistRegisterPage() {
    this.closeRegisterModal();
    this.props.history.replace('/artistregister');
  }

  loadVenueRegisterPage() {
    this.closeRegisterModal();
    this.props.history.replace('/venueregister');
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={styles.container}>
        <Modal
          visible={this.state.registerModalStatus}
          onCancel={() => this.closeRegisterModal()}
          footer={null}
          style={{ textAlign: 'center' }}
        >
          <Button style={styles.modalButton} key="venue" onClick={() => this.loadVenueRegisterPage()}>Venue</Button>
          <div style={styles.modalButton} />
          <Button style={styles.modalButton} key="artist" onClick={() => this.loadArtistRegisterPage()}>Artist</Button>
        </Modal>
        <Modal
          visible={this.state.forgotPasswordModalStatus}
          onCancel={() => this.closeForgotPasswordModal()}
          // footer={null}
          title="You will recieve a Password Recovery email"
          onOk={() => this.sendEmail()}
          style={{ textAlign: 'center' }}
        >
          <Input style={styles.modalInput} placeholder="Enter your Email" onChange={e => this.setState({ email: e.target.value })} />
        </Modal>

        <Form onSubmit={e => this.submitLogin(e)} className="login-form">
          <Col span={24}>
            <FormItem>
              {getFieldDecorator('userName', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input
                className="logininput"
                id="username"
                prefix={<Icon type="user" style={{ color: 'rgba(255,255,255,1)' }} />}
                placeholder="Username"
                style={styles.input}
              />)}
            </FormItem>
          </Col>

          <Col span={24}>
            <FormItem>
              {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                className="logininput"
                prefix={<Icon type="lock" style={{ color: 'rgba(255,255,255,1)' }} />}
                type="password"
                placeholder="Password"
                style={styles.input}
              />)}
            </FormItem>
          </Col>

          <FormItem>
            {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox style={styles.anchor}>Remember me</Checkbox>,
          )}
            <a onClick={() => this.openForgotPasswordModal()} style={styles.anchor}>Forgot password</a>
            <Button type="primary" htmlType="submit" className="login-form-button" style={styles.button}>
            Log in
            </Button>
            <a onClick={() => this.openRegisterModal()} style={styles.anchor}>Register Here!</a>
          </FormItem>

        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => (
  { store: state } // eslint-disable-line
);

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(actions, dispatch) }
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginForm));


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
