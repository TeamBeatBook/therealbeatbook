import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/index.js';
import Login from './login.jsx';
import Artist from './artist.jsx';
import Venue from './venue.jsx';
import LandingPage from './landingpage.jsx';


class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.actions.isLoggedIn();
  }


  render() {
    return (
      <div className="loginpage">
        {!this.props.store.landingViewed &&
          <LandingPage />
        }
        {!this.props.store.artist && !this.props.store.venue && this.props.store.landingViewed &&
          <Login />
        }
        {this.props.store.artist &&
          <Artist />
        }
        {this.props.store.venue &&
          <Venue />
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
