import React from 'react';
import axios from 'axios';
import { Form, Icon, Input, Button, Upload, message, Col, Row } from 'antd'; /* eslint-disable-line */
const FormItem = Form.Item;
const { TextArea } = Input;

class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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
      console.error(err);
    });
  }

  onChangeVenueName(e) {
    this.setState({ venue_name: e.target.value });
  }

  onChangeCapacity(e) {
    this.setState({ capacity: e.target.value });
  }

  onChangeVenueDescription(e) {
    this.setState({ venue_description: e.target.value });
  }

  onChangeStage(e) {
    this.setState({ venue_stage: e.target.value });
  }

  onChangeVenueAddress(e) {
    this.setState({ venue_address: e.target.value });
  }

  onChangeVenueState(e) {
    this.setState({ venue_state: e.target.value });
  }

  onChangeVenueCity(e) {
    this.setState({ venue_city: e.target.value });
  }

  onChangeWebsite(e) {
    this.setState({ venue_website: e.target.value });
  }

  onClick() {
    const { venueId } = this.props;
    const { capacity } = this.state;
    const { venue_stage } = this.state;
    const { venue_address } = this.state;
    const { venue_city } = this.state;
    const { venue_description } = this.state;
    const { venue_name } = this.state;
    const { venue_state } = this.state;
    const { venue_website } = this.state;

    axios.post('/updateVenue', {
      capacity,
      venue_stage,
      venue_address,
      venue_city,
      venue_description,
      venue_name,
      venue_state,
      venueId,
      venue_website,
    }).then(() => {
      message.success('Your venue details have been edited!');
    }).catch((err) => {
      console.error(err);
    });
  }

  render() {
    return (
      <Row gutter={40}>
        <Col span={8}>
          <FormItem> Venue Name
            <Input
              className="venue_name"
              placeholder={this.state.venue_name}
              onChange={val => this.onChangeVenueName(val)}
            />
          </FormItem>
          <FormItem> Venue Capacity
            <Input
              className="capacity"
              placeholder={this.state.capacity}
              onChange={val => this.onChangeCapacity(val)}
            />
          </FormItem>
          <FormItem> Venue Website
            <Input
              placeholder={this.state.venue_website}
              className="venue_website"
              onChange={val => this.onChangeWebsite(val)}
            />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem> Venue Description
            <TextArea
              className="venue_description"
              placeholder={this.state.venue_description}
              autosize={{ minRows: 4, maxRows: 18 }}
              onChange={val => this.onChangeVenueDescription(val)}
            />
          </FormItem>
          <FormItem> Venue Stage Details
            <TextArea
              className="venue_stage"
              placeholder={this.state.venue_stage}
              autosize={{ minRows: 4, maxRows: 18 }}
              onChange={val => this.onChangeStage(val)}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => this.onClick()}
              className="login-form-button"
            >
              Save Changes
            </Button>
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem> Venue Address
            <Input
              placeholder={this.state.venue_address}
              className="venue_address"
              onChange={val => this.onChangeVenueAddress(val)}
            />
          </FormItem>
          <FormItem> Venue City
            <Input
              placeholder={this.state.venue_city}
              className="venue_city"
              onChange={val => this.onChangeVenueCity(val)}
            />
          </FormItem>
          <FormItem> Venue State
            <Input
              placeholder={this.state.venue_state}
              className="venue_state"
              onChange={val => this.onChangeVenueState(val)}
            />
          </FormItem>
        </Col>
      </Row>
    );
  }
}

const VenueDetails = Form.create()(NormalLoginForm);

export default VenueDetails;
