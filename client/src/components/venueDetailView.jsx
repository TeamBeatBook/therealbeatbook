import React from 'react';
import axios from 'axios';
import { Row, Col } from 'antd';

class VenueDetailView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    axios.get('/venueDetails', {
      params: {
        venue_id: this.props.venueId,
      },
    }).then(({ data }) => {
      this.setState({
        capacity: data.capacity,
        venue_stage: data.venue_stage,
        venue_address: data.venue_address,
        venue_city: data.venue_city,
        venue_description: data.venue_description,
        venue_name: data.venue_name,
        venue_state: data.venue_state,
        venue_website: data.venue_website,
      });
    }).catch((err) => {
        console.error(err); /* eslint-disable-line */
    });
  }

  render() {
    const venueName = this.state.venue_name ? this.state.venue_name : '(Not provided)';
    const venueAddress = this.state.venue_address ? this.state.venue_address : '(Address not provided)';
    const venueCapacity = this.state.capacity ? this.state.capacity : '(Not provided)';
    const venueDescription = this.state.venue_description ? this.state.venue_description : '(Not provided)';
    const venueStage = this.state.venue_stage ? this.state.venue_stage : '(Not provided)';
    const venueWebsite = this.state.venue_website ? this.state.venue_website : '(Not provided)';
    return (
      <div>
        <Row type="flex" gutter={2}>
          <Col span={5}><p>Venue Name:</p></Col>
          <Col span={19}>{venueName}</Col>
        </Row>
        <br />
        <Row type="flex" gutter={2}>
          <Col span={5}><p>Location:</p></Col>
          <Col span={19}>{venueAddress} - {this.state.venue_city}, {this.state.venue_state}</Col>
        </Row>
        <br />
        <Row type="flex" gutter={2}>
          <Col span={5}><p>Capacity:</p></Col>
          <Col span={19}>{venueCapacity}</Col>
        </Row>
        <br />
        <Row type="flex" gutter={2}>
          <Col span={5}><p>Desctiption:</p></Col>
          <Col span={19}>{venueDescription}</Col>
        </Row>
        <br />
        <Row type="flex" gutter={2}>
          <Col span={5}><p>Stage Info:</p></Col>
          <Col span={19}>{venueStage}</Col>
        </Row>
        <br />
        <Row type="flex" gutter={2}>
          <Col span={5}><p>Website:</p></Col>
          <Col span={19}>{venueWebsite}</Col>
        </Row>
      </div>
    );
  }
}

export default VenueDetailView;
