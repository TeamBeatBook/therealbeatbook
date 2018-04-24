import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs, List, Modal, Popconfirm, message } from 'antd';
import axios from 'axios';
import * as actions from '../actions/index.js'; // eslint-disable-line
import EPKView from './epkView.jsx'; // eslint-disable-line
import VenueDetailView from './venueDetailView.jsx';

const moment = require('moment');

const { TabPane } = Tabs;
class Requests extends React.Component {
  constructor(props) {
    super(props);
    const { bookings } = this.props.store;
    this.state = {
      pending: bookings.filter(booking => booking.confirmed === 0 && booking.denied === 0),
      confirmed: bookings.filter(booking => booking.confirmed === 1 && booking.denied === 0),
      denied: bookings.filter(booking => booking.denied === 1),
      visible: false,
      booking_description: null, // eslint-disable-line
      booking_title: null,
      start_time: null,
      end_time: null,
      epkVisible: false,
      item: '',
    };
    this.onSeeEventClick = this.onSeeEventClick.bind(this);
    this.onSeeVenueDetailsClick = this.onSeeVenueDetailsClick.bind(this);
    this.onEpkClick = this.onEpkClick.bind(this);
  }

  onSeeEventClick(item) {
    this.setState({
      visible: true,
      booking_description: item.booking_description, // eslint-disable-line
      booking_title: item.booking_title,
      start_time: item.start_time,
      end_time: item.end_time,
      item,
    });
  }

  onConfirmClick(item) {
    axios.patch('/confirm', item)
      .then((res) => {
        const updatedBookings = res.data.bookings;
        this.props.actions.setBookings(updatedBookings);
        this.setState({
          pending: updatedBookings.filter(booking => booking.confirmed === 0 && booking.denied === 0),
          confirmed: updatedBookings.filter(booking => booking.confirmed === 1 && booking.denied === 0),
          denied: updatedBookings.filter(booking => booking.denied === 1),
        });
        message.success('This request has been confirmed! We have notified the Artist.');
      }).catch(err => console.error(err));
  }

  onSeeVenueDetailsClick(item) {
    Modal.info({
      title: 'Venue Details',
      content: <VenueDetailView venueId={item.venue_id} />,
      okText: 'Close',
      width: 600,
      maskClosable: true,
    });
  }

  onEpkClick(item) {
    console.log(item);
    this.setState({
      item,
      epkVisible: true,
    });
  }

  onDenyClick(item, denied) {
    axios.patch('/deny', item)
      .then((res) => {
        const updatedBookings = res.data.bookings;
        this.props.actions.setBookings(updatedBookings);
        this.setState({
          pending: updatedBookings.filter(booking => booking.confirmed === 0 && booking.denied === 0),
          confirmed: updatedBookings.filter(booking => booking.confirmed === 1 && booking.denied === 0),
          denied: updatedBookings.filter(booking => booking.denied === 1),
        });
        if (denied) {
          message.error('This request has been denied. We have notified the Artist.');
        } else {
          message.success('This request has been restored and is now in Pending.');
        }
      }).catch(err => console.log(err));
  }

  onDeleteClick(item) {
    axios.post('/booking', item)
      .then((res) => {
        const updatedBookings = res.data.bookings;
        this.props.actions.setBookings(updatedBookings);
        this.setState({
          pending: updatedBookings.filter(booking => booking.confirmed === 0 && booking.denied === 0),
          confirmed: updatedBookings.filter(booking => booking.confirmed === 1 && booking.denied === 0),
          denied: updatedBookings.filter(booking => booking.denied === 1),
        });
        message.error('This request has been deleted. It has been removed from the Venue\'s inbox.');
      }).catch(err => console.log(err));
  }

  render() {
    const { confirmed, pending, denied } = this.state;
    const isArtist = this.props.store.artist;

    return (
      <div>
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="Confirmed" key="1">
            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={confirmed}
              renderItem={(item) => {
                let name;
                let titleFunction;
                const time = item.start_time || '';
                if (isArtist === true) {
                  name = item.venue_name;
                  titleFunction = this.onSeeVenueDetailsClick;
                } else {
                  name = item.artist_name;
                  titleFunction = this.onSeeEventClick;
                }
                return (
                  <List.Item actions={[<a onClick={() => this.onSeeEventClick(item)} >See Event Details</a>]}>
                    <List.Item.Meta
                      title={<a onClick={() => titleFunction(item)} >{name}</a>}
                      description={item.booking_description}
                    />
                    <Modal
                      visible={this.state.visible}
                      onOk={() => this.setState({ visible: false })}
                      onCancel={() => this.setState({ visible: false })}
                      // cancelText="Edit event"
                      title={this.state.booking_title}
                    >
                      <em>{name}</em>
                      <div>Playing {`${moment(this.state.start_time).local().format('MMMM Do YYYY')} `}
                           from {`${moment(this.state.start_time).local().format('h:mm a')} `}
                           til {`${moment(this.state.end_time).local().format('h:mm a')}`}
                      </div>
                    </Modal>
                    <div>Gig on: {moment(time).local().format('MMM Do')}</div>
                  </List.Item>
                  );
              }}
            />
          </TabPane>
          <TabPane tab="Pending" key="2">
            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={pending}
              renderItem={(item) => {
                let name;
                let titleFunction;
                const time = item.start_time || '';
                const subtab = [];
                if (isArtist === true) {
                  name = item.venue_name;
                  titleFunction = this.onSeeVenueDetailsClick;
                  subtab.push(
                    <a onClick={() => this.onSeeVenueDetailsClick(item)}>
                      See Venue Details
                    </a>,
                    <Popconfirm
                      title="Are you sure you want to delete this request?"
                      onConfirm={() => this.onDeleteClick(item)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <a href="#" >Delete Request</a>
                    </Popconfirm>,
                  );
                } else {
                  name = item.artist_name;
                  titleFunction = this.onEpkClick;
                  subtab.push(
                    <Popconfirm
                      title="Are you sure you want to confirm this show?"
                      onConfirm={() => this.onConfirmClick(item)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <a href="#" >Confirm Event</a>
                    </Popconfirm>,
                    <a onClick={() => this.onSeeEventClick(item)}> View Details</a>,
                    <a onClick={() => this.onEpkClick(item)}>See EPK</a>,
                    <Popconfirm
                      title="Are you sure you want to deny this request?"
                      onConfirm={() => this.onDenyClick(item)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <a href="#" >Deny</a>
                    </Popconfirm>);
                }
                return (
                  <List.Item actions={subtab}>
                    <List.Item.Meta
                      title={<a onClick={() => titleFunction(item)} >{name}</a>}
                      description={item.booking_description}
                    />
                    <div>
                      Trying to gig: {moment(time).local().format('MMM Do')} at {moment(time).local().format('h:mm a')}
                    </div>
                  </List.Item>
                );
              }}
            />
          </TabPane>
          <TabPane tab="Denied" key="3">
            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={denied}
              renderItem={(item) => {
                let name;
                const time = item.start_time || '';
                const subtab = [];
                if (isArtist === true) {
                  name = item.venue_name;
                } else {
                  name = item.artist_name;
                  subtab.push(
                    <Popconfirm
                      title="Are you sure you want to Restore this request (it will move to Pending)?"
                      onConfirm={() => this.onDenyClick(item, false)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <a href="#" >Restore Request</a>
                    </Popconfirm>,
                    <a onClick={() => this.onSeeEventClick(item)}> View Details</a>,
                    <a onClick={() => this.onEpkClick(item)}>See EPK</a>);
                }
                return (
                  <List.Item actions={subtab}>
                    <List.Item.Meta
                      title={<em>{name}</em>}
                      description={<em>{item.booking_description}</em>}
                    />
                    <div><em>Attempted to gig: {moment(time).local().format('MMM Do')}</em></div>
                  </List.Item>
                );
              }}
            />
          </TabPane>
        </Tabs>
        <Modal
          visible={this.state.epkVisible}
          maskClosable
          onOk={() => this.setState({ epkVisible: false })}
          onCancel={() => this.setState({ epkVisible: false })}
          width="70%"
        >
          <EPKView artist={this.state.item.artist_id} />
        </Modal>
        <Modal
          visible={this.state.visible}
          maskClosable
          onOk={() => this.setState({ visible: false })}
          onCancel={() => this.setState({ visible: false })}
          title={this.state.booking_title}
        >
          <em>{this.state.item.artist_name}</em>
          <div>
            Requesting to play {`${moment(this.state.start_time).format('MMMM Do YYYY')} `}
            from {`${moment(this.state.start_time).local().format('h:mm a')} `}
            til {`${moment(this.state.end_time).local().format('h:mm a')}`}
          </div>
        </Modal>
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


export default connect(mapStateToProps, mapDispatchToProps)(Requests);
