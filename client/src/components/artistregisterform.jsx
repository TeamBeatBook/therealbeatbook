import React from 'react';
import { Form, Icon, Input, Button, Col, notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import * as actions from '../actions/index.js';

const FormItem = Form.Item;

class ArtistRegisterForm extends React.Component {
  registerArtist(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.password !== values.confirmPassword) {
          return notification.open({ message: 'Passwords do not match' });
        }
        this.props.registerArtist(
          values.username,
          values.password,
          values.email,
          values.city,
          values.state);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div style={styles.container}>
        <Form onSubmit={e => this.registerArtist(e)} className="login-form">
          <Col span={24}>
            <FormItem >
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your Username!' }],
              })(<Input
                className="registerinput"
                id="username"
                prefix={<Icon type="user" style={{ color: 'rgba(255,255,255,1)' }} />}
                placeholder="Username"
                style={styles.input}
              />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem>
              {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(<Input
              className="registerinput"
              prefix={<Icon type="lock" style={{ color: 'rgba(255,255,255,1)' }} />}
              type="password"
              placeholder="Password"
              style={styles.input}
            />,
          )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem>
              {getFieldDecorator('confirmPassword', {
              rules: [{ required: true, message: 'Please confirm your Password' }],
            })(<Input
              className="registerinput"
              prefix={<Icon type="lock" style={{ color: 'rgba(255,255,255,1)' }} />}
              type="password"
              placeholder="Confirm Password"
              style={styles.input}
            />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem>
              {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your Email!' }],
            })(<Input
              className="registerinput"
              prefix={<Icon type="lock" style={{ color: 'rgba(255,255,255,1)' }} />}
              type="email"
              placeholder="Email"
              style={styles.input}
            />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem>
              {getFieldDecorator('city', {
              rules: [{ required: true, message: 'Please input your City!' }],
            })(<Input
              className="registerinput"
              prefix={<Icon type="lock" style={{ color: 'rgba(255,255,255,1)' }} />}
              type="city"
              placeholder="City"
              style={styles.input}
            />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem>
              {getFieldDecorator('state', {
              rules: [{ required: true, message: 'Please input your State!' }],
            })(<Input
              className="registerinput"
              prefix={<Icon type="lock" style={{ color: 'rgba(255,255,255,1)' }} />}
              type="state"
              placeholder="State"
              style={styles.input}
            />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button" style={styles.button}>
                Register
              </Button>
            </FormItem>
          </Col>
        </Form>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArtistRegisterForm));

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
};
