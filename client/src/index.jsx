import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import * as actions from './actions/index.js';
import Home from './components/homepage.jsx';
import ArtistRegister from './components/artistregister.jsx';
// import ArtistRegisterBeta from './components/artistregisterbeta.jsx';
import VenueRegister from './components/venueregister.jsx';
// import Test from './components/test.jsx';
import EPKView from './components/epkView.jsx';
// import Artist from './components/artist.jsx';
import reducer from './reducers/index.js';
import PasswordRecovery from './components/passwordrecovery.jsx';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';//eslint-disable-line

const store = createStore(reducer, applyMiddleware(thunk));
const Base = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/artistregister" component={ArtistRegister} />
        <Route exact path="/venueregister" component={VenueRegister} />
        <Route path="/artist/:username" component={EPKView} /* render={() => (actions.checkLoginStatus() === true ? (<Artist />) : <EPKView />)} */ />
        <Route path="http://thebeatbook.com/password/recover/:email/:token" component={PasswordRecovery} />
      </Switch>
    </Router>
  </Provider>
);

const render = () => {
  ReactDOM.render(<Base store={store} />, document.getElementById('app'));
};

store.subscribe(render);
render();
