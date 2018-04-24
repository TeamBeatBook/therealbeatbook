import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, notification, Icon } from 'antd';
import axios from 'axios';
import { withRouter } from 'react-router';
import * as actions from '../actions/index.js';
import ArtistRegisterForm from './artistregisterform.jsx';

const logo = 'https://cdn3.iconfinder.com/data/icons/business-vol-2/72/57-512.png';
const ArtistRegisterFormContainer = Form.create()(ArtistRegisterForm);


class ArtistRegister extends React.Component {
  constructor(props) {
    super(props);
  }


  goBackToLogin() {
    this.props.history.replace('/');
  }

  registerArtist(username, password, email, city, state) {
    axios.post('/register/artist', {
      username,
      password,
      email,
      city,
      state,
    }).then((res) => {
      if (res.data === 'username already exists' || res.data === 'email already exists') {
        notification.open({ message: res.data });
      } else {
        this.actions.loadArtistPage(res.data);
        this.actions.setArtist(res.data[1].artist_id);
        this.history.replace('/');
      }
    }).catch((err) => {
      console.error('error', err)/* eslint-disable-line */;
    });
  }

  render() {
    return (
      <div>
        <a style={styles.goBack} onClick={() => this.goBackToLogin()}>
          <Icon type="arrow-left" style={styles.backArrow} />
          <div style={styles.backText}>Back to Login</div>
        </a>
        <div style={styles.registerbox}>
          <img src={logo} style={styles.logo} alt="" />
          <div style={styles.registerform}>
            <ArtistRegisterFormContainer registerArtist={this.registerArtist} />
          </div>
        </div >
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArtistRegister));

const styles = {
  logo: {
    filter: 'invert(1)',
    height: 75,
    width: 75,
    position: 'relative',
    marginBottom: 20,
  },
  registerform: {
    position: 'relative',
    width: '50%',
    left: '25%',
  },
  registerbox: {
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
