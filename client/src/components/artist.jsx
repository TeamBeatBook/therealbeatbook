import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import * as actions from '../actions/index.js';
import calendar from './calendar.jsx';
import Requests from './requests.jsx';
import SearchVenues from './searchVenues.jsx';
import EPKEdit from './epkEdit.jsx';
import EPKView from './epkView.jsx';
import logo from '../../../beatbooklogo.png';

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class Artist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: '1',
    };
  }

  onSelect(info) {
    if (info.key === '6') {
      this.props.actions.logout();
    } else {
      this.setState({ key: info.key });
    }
  }

  view() {
    const { key } = this.state;
    const artist = this.props.store.artistId;
    const artist2 = parseInt(artist.toString()); /* eslint-disable-line */
    const { bookings } = this.props.store;
    const filteredBookings = bookings.length > 0 ? bookings.filter(booking => booking.denied !== 1) : [];
    if (key === '1') {
      return calendar(filteredBookings, true, artist2, null, this.props.actions.addBooking);
    }
    if (key === '2') {
      return (<SearchVenues />);
    }
    if (key === '3') {
      return (<Requests />);
    }
    if (key === '4') {
      return (<EPKView artist={artist} />);
    }
    if (key === '5') {
      return (<EPKEdit artistID={artist} />);
    }
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider>
          <div className="logo" />
          <Menu
            theme="dark"
            defaultSelectedKeys={['1']}
            mode="inline"
            onSelect={info => this.onSelect(info)}
          >
            <Menu.Item key="1">
              <Icon type="calendar" />
              <span>Calendar</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="search" />
              <span>Find Venue</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="folder" />
              <span>My Requests</span>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={<span>
                <Icon type="team" />
                <span>EPK</span>
                </span> /* eslint-disable-line */}>
              <Menu.Item key="4">View</Menu.Item>
              <Menu.Item key="5">Edit</Menu.Item>
            </SubMenu>
            <Menu.Item key="6">
              <Icon type="logout" />
              <span>Logout</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item />
            </Breadcrumb>
            <div style={{
                padding: 24,
                background: '#fff',
                minHeight: 360,
              }}/* eslint-disable-line */>
              {this.view()}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <img src={logo} style={{height: 20}} alt="" />
            <div style={ {fontSize: 14,fontFamily: "'Baumans', cursive",color: 'black', display: 'inline-block',}}>beatbook</div>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = state => (
  { store: state }
);

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(actions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(Artist);
