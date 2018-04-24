import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Icon } from 'antd';
import axios from 'axios';
import { withRouter } from 'react-router';
import * as actions from '../actions/index.js';

class EPKView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artistId: this.props.artist,
      imageUrl: '',
    };
  }

  componentDidMount() {
    return this.props.artist ?
      this.getArtistById() :
      this.getArtistByName();
  }

  getArtistById() {
    axios.get('/epk', {
      params: {
        artistId: this.state.artistId,
      },
    }).then(({ data }) => {
      if (data.epk.imageUrl !== null) {
        data.epk.imageUrl = Buffer.from(data.epk.imageUrl); /* eslint-disable-line */
      }
      let splitYoutube = data.epk.artist_youtube ? data.epk.artist_youtube.split('/') : '';
      const sliceSpot = data.epk.artist_spotify ? data.epk.artist_spotify.slice(32) : '';
      splitYoutube = `https://www.youtube.com/embed/${splitYoutube[splitYoutube.length - 1]}`;
      this.setState({
        artist_name: data.epk.artist_name,
        artist_description: data.epk.artist_description,
        artist_city: data.epk.artist_city,
        artist_state: data.epk.artist_state,
        artist_twitter: data.epk.artist_twitter,
        artist_facebook: data.epk.artist_facebook,
        artist_instagram: data.epk.artist_instagram,
        artist_support: data.epk.artist_support,
        artist_contact: data.epk.artist_contact,
        imageUrl: data.epk.imageUrl,
        artist_youtube: splitYoutube,
        artist_spotify: sliceSpot,
        artist_contactEmail: data.epk.artist_contactEmail,
        artist_website: data.epk.artist_website,
      });
    }).catch((err) => {
      console.error('error', err); /* eslint-disable-line */
    });
  }

  getArtistByName() {
    axios.get('/artist/epk', {
      params: {
        username: this.props.match.params.username,
      },
    }).then(({ data }) => {
      if (data.epk.imageUrl !== null) {
        data.epk.imageUrl = Buffer.from(data.epk.imageUrl); /* eslint-disable-line */
      }
      let splitYoutube = data.epk.artist_youtube ? data.epk.artist_youtube.split('/') : '';
      const sliceSpot = data.epk.artist_spotify ? data.epk.artist_spotify.slice(32) : '';
      splitYoutube = `https://www.youtube.com/embed/${splitYoutube[splitYoutube.length - 1]}`;
      this.setState({
        artist_name: data.epk.artist_name,
        artist_description: data.epk.artist_description,
        artist_city: data.epk.artist_city,
        artist_state: data.epk.artist_state,
        artist_twitter: data.epk.artist_twitter,
        artist_facebook: data.epk.artist_facebook,
        artist_instagram: data.epk.artist_instagram,
        artist_support: data.epk.artist_support,
        artist_contact: data.epk.artist_contact,
        imageUrl: data.epk.imageUrl,
        artist_youtube: splitYoutube,
        artist_spotify: sliceSpot,
      });
    }).catch((err) => {
      console.error(err);
    });
  }


  mapSupport() {
    const splitSupport = this.state.artist_support ? this.state.artist_support.split('||') : [];
    if (splitSupport.length) {
      return splitSupport.map((support, i) => {// eslint-disable-line
        if (support.length) {
          return (
            <h2 key={i}>{/* eslint-disable-line */}
              <Icon type='right' style={{ color: 'rgba(0,0,0,.25)' }} /> {support}{/* eslint-disable-line */}
            </h2>
          );
        }
      });
    }
  }

  render() {
    return (
      <div >
        <Row align="bottom" type="flex" gutter={32}>
          <Col span={4}><img src={this.state.imageUrl} width="100%" /></Col>
          <Col span={16}>
            <h1 style={{
              fontSize: '3vw',
              fontFamily: "'Roboto Condensed', sans-serif",
             }
           }>
              {this.state.artist_name} - {this.state.artist_city}, {this.state.artist_state}
            </h1>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col span={4}>
            {this.state.artist_facebook &&
              <h2 style={{ color: 'rgba(0,0,0,.25)', fontSize: '1.2vw' }}>
                <Icon type="facebook" style={{ color: 'rgba(0,0,0,.25)' }} />
                <a
                  href={`https://www.facebook.com/${this.state.artist_facebook}`}
                  style={{
                    color: 'rgba(0,0,0,.25)',
                    fontSize: '1.2vw',
                    fontFamily: "'Roboto Condensed', sans-serif",
                  }}
                  target="_blank"
                >{this.state.artist_facebook}
                </a>
              </h2>
            }
            {this.state.artist_twitter &&
              <h2 style={{ color: 'rgba(0,0,0,.25)', fontSize: '1.2vw' }}>
                <Icon type="twitter" style={{ color: 'rgba(0,0,0,.25)' }} />
                <a
                  href={`https://twitter.com/${this.state.artist_twitter}`}
                  style={{
                    color: 'rgba(0,0,0,.25)',
                    fontSize: '1.2vw',
                    fontFamily: "'Roboto Condensed', sans-serif",
                  }}
                  target="_blank"
                >{this.state.artist_twitter}
                </a>
              </h2>
            }
            {this.state.artist_instagram &&
              <h2 style={{ color: 'rgba(0,0,0,.25)', fontSize: '1.2vw' }}>
                <Icon type="instagram" style={{ color: 'rgba(0,0,0,.25)' }} />
                <a
                  href={`https://www.instagram.com/${this.state.artist_instagram}`}
                  style={{
                    color: 'rgba(0,0,0,.25)',
                    fontSize: '1.2vw',
                    fontFamily: "'Roboto Condensed', sans-serif",
                  }}
                  target="_blank"
                > {this.state.artist_instagram}
                </a>
              </h2>
            }
            {this.state.artist_website &&
              <h2 style={{ color: 'rgba(0,0,0,.25)', fontSize: '1.2vw' }}>
                <Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)' }} />
                <a
                  href={`https://${this.state.artist_website}`}
                  style={{
                    color: 'rgba(0,0,0,.25)',
                    fontSize: '1.2vw',
                    fontFamily: "'Roboto Condensed', sans-serif",
                  }}
                  target="_blank"
                > {this.state.artist_website}
                </a>
              </h2>
            }
          </Col>
          <Col span={16}>
            <h1 style={{ fontSize: '1.5vw', fontFamily: "'Roboto Condensed', sans-serif" }}>
              Similar Bands
            </h1>
            <p style={{ fontSize: '0.8vw', fontFamily: "'Roboto Condensed', sans-serif" }}>
              {this.mapSupport()}
            </p>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col span={4} />
          <Col span={16}>
            <h1 style={{ fontSize: '1.5vw', fontFamily: "'Roboto Condensed', sans-serif" }}>
              Band Bio
            </h1>
            <p style={{ fontSize: '1.05vw', fontFamily: "'Roboto Condensed', sans-serif" }}>
              {this.state.artist_description}
            </p>
          </Col>
        </Row>
        <br />
        <Row gutter={32}>
          <Col span={4} />
          <Col span={16}>
            {this.state.artist_youtube &&
              <iframe
                title="youtube"
                width="100%"
                height="315"
                src={this.state.artist_youtube}
                frameBorder="0"
                allowFullScreen
              />
            }
            <br />
            {this.state.artist_spotify &&
              <iframe
                title="spotify"
                src={`https://open.spotify.com/embed?uri=spotify:artist:${this.state.artist_spotify}`}
                width="100%"
                height="380"
                frameBorder="0"
                allowTransparency="true"
              />
            }
          </Col>
        </Row>
        <Row gutter={32}>
          <Col span={4} />
          <Col span={16}>
            <h1 style={{ fontSize: '1.5vw', fontFamily: "'Roboto Condensed', sans-serif", textAlign: 'center' }}>
            Contact
            </h1>
            <p style={{ fontSize: '1.05vw', fontFamily: "'Roboto Condensed', sans-serif", textAlign: 'center' }}>
            Email: {this.state.artist_contactEmail} <br />
            Number: {this.state.artist_contact}
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => (
    { store: state } // eslint-disable-line
);

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(actions, dispatch) } /* eslint-disable-line */
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EPKView));
