import React from 'react';
import axios from 'axios';
import { Form, Icon, Input, Button, Upload, message, Col, Row } from 'antd'; /* eslint-disable-line */
const FormItem = Form.Item;
const { TextArea } = Input;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    axios.get('/epk', {
      params: {
        artistId: this.props.artistID,
      },
    }).then(({ data }) => {
      const splitSupport = data.epk.artist_support ? data.epk.artist_support.split('||') : ['', '', ''];
      this.setState({
        artist_name: data.epk.artist_name,
        artist_description: data.epk.artist_description,
        artist_city: data.epk.artist_city,
        artist_state: data.epk.artist_state,
        artist_twitter: data.epk.artist_twitter,
        artist_facebook: data.epk.artist_facebook,
        artist_instagram: data.epk.artist_instagram,
        artist_support: splitSupport[0],
        artist_supportTwo: splitSupport[1],
        artist_supportThree: splitSupport[2],
        artist_contact: data.epk.artist_contact,
        artist_youtube: data.epk.artist_youtube,
        artist_spotify: data.epk.artist_spotify,
        artist_contactEmail: data.epk.artist_contactEmail,
        artist_website: data.epk.artist_website,
      });
    }).catch((err) => {
      console.error('error', err); /* eslint-disable-line */
    });
  }

  onClick() {
    const temp = `${this.state.artist_support}||${this.state.artist_supportTwo}||${this.state.artist_supportThree}`;
    const artist_id = this.props.artistID;
    const { imageUrl } = this.state;
    const { artist_twitter } = this.state;
    const { artist_facebook } = this.state;
    const { artist_instagram } = this.state;
    const artist_support = temp;
    const { artist_name } = this.state;
    const { artist_description } = this.state;
    const { artist_city } = this.state;
    const { artist_state } = this.state;
    const { artist_contact } = this.state;
    const { artist_youtube } = this.state;
    const { artist_spotify } = this.state;
    const { artist_contactEmail } = this.state;
    const { artist_website } = this.state;

    axios.post('/updateEPK', {
      artist_name,
      artist_description,
      artist_city,
      artist_state,
      artist_id,
      imageUrl,
      artist_twitter,
      artist_facebook,
      artist_instagram,
      artist_support,
      artist_contact,
      artist_youtube,
      artist_contactEmail,
      artist_website,
      artist_spotify,
    }).then(() => {
      message.success('Your EPK has been edited!');
    }).catch((err) => {
      message.error('Something went wrong with your EKP edit.');
      console.error(err);
    });
  }

  onChangeFacebook(e) {
    this.setState({ artist_facebook: e.target.value });
  }

  onChangeInstagram(e) {
    this.setState({ artist_instagram: e.target.value });
  }

  onChangeTwitter(e) {
    this.setState({ artist_twitter: e.target.value });
  }

  onChangeArtist(e) {
    this.setState({ artist_name: e.target.value });
  }

  onChangeCity(e) {
    this.setState({ artist_city: e.target.value });
  }

  onChangeState(e) {
    this.setState({ artist_state: e.target.value });
  }

  onChangeDescription(e) {
    this.setState({ artist_description: e.target.value });
  }

  onChangeSupport(e) {
    this.setState({ artist_support: e.target.value });
  }

  onChangeSupportTwo(e) {
    this.setState({ artist_supportTwo: e.target.value });
  }

  onChangeSupportThree(e) {
    this.setState({ artist_supportThree: e.target.value });
  }

  onChangeContact(e) {
    this.setState({ artist_contact: e.target.value });
  }

  onChangeContactEmail(e) {
    this.setState({ artist_contactEmail: e.target.value });
  }

  onChangeYoutube(e) {
    this.setState({ artist_youtube: e.target.value });
  }

  onChangeSpotify(e) {
    this.setState({ artist_spotify: e.target.value });
  }

  onChangeWebsite(e) {
    const index = e.target.value.indexOf('w');
    const web = e.target.value.slice(index, e.target.value.length);
    this.setState({ artist_website: web });
  }

  onChangeImage(info) {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }


  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const { imageUrl } = this.state;

    return (
      <Row gutter={40}>
        <Col span={8}>
          <FormItem> Band Name
            <Input
              className="band"
              placeholder={this.state.artist_name}
              onChange={val => this.onChangeArtist(val)}
            />
          </FormItem>
          <FormItem> Your City
            <Input
              className="city"
              placeholder={this.state.artist_city}
              onChange={val => this.onChangeCity(val)}
            />
          </FormItem>
          <FormItem> Your State
            <Input
              className="state"
              placeholder={this.state.artist_state}
              onChange={val => this.onChangeState(val)}
            />
          </FormItem>
          <FormItem> Contact Number
            <Input
              className="contact"
              placeholder={this.state.artist_contact}
              onChange={val => this.onChangeContact(val)}
            />
          </FormItem>
          <FormItem> Contact Email
            <Input
              className="contactEmail"
              placeholder={this.state.artist_contactEmail}
              onChange={val => this.onChangeContactEmail(val)}
            />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem> Band Bio
            <TextArea
              className="description"
              placeholder={this.state.artist_description}
              autosize={{ minRows: 4, maxRows: 18 }}
              style={{ width: '100%' }}
              onChange={val => this.onChangeDescription(val)}
            />
          </FormItem>
          <FormItem> If you liked our music try:
            <Input
              className="support"
              placeholder={this.state.artist_support}
              onChange={val => this.onChangeSupport(val)}
            />
          </FormItem>
          <FormItem>
            <Input
              className="supportTwo"
              placeholder={this.state.artist_supportTwo}
              onChange={val => this.onChangeSupportTwo(val)}
            />
          </FormItem>
          <FormItem>
            <Input
              className="supportThree"
              placeholder={this.state.artist_supportThree}
              onChange={val => this.onChangeSupportThree(val)}
            />
          </FormItem>
          <div> Change Image of your band.</div>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="/epkImgUpload"
            onChange={val => this.onChangeImage(val)}
          >
            {imageUrl ? <img src={imageUrl} width="100%" /> : uploadButton}
          </Upload>
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
          <FormItem>
            Facebook
            <Input
              prefix={<Icon type="facebook" style={{ color: 'rgba(0,0,0,.25)' }} />}
              className="facebook"
              placeholder={this.state.artist_facebook}
              onChange={val => this.onChangeFacebook(val)}
            />
          </FormItem>
          <FormItem>
            Instagram
            <Input
              prefix={<Icon type="instagram" style={{ color: 'rgba(0,0,0,.25)' }} />}
              className="instagram"
              placeholder={this.state.artist_instagram}
              onChange={val => this.onChangeInstagram(val)}
            />
          </FormItem>
          <FormItem>
            Twitter
            <Input
              prefix={<Icon type="twitter" style={{ color: 'rgba(0,0,0,.25)' }} />}
              className="twitter"
              placeholder={this.state.artist_twitter}
              onChange={val => this.onChangeTwitter(val)}
            />
          </FormItem>
          <FormItem>
            Youtube Embed
            <Input
              prefix={<Icon type="youtube" style={{ color: 'rgba(0,0,0,.25)' }} />}
              className="youtube"
              placeholder={this.state.artist_youtube}
              onChange={val => this.onChangeYoutube(val)}
            />
          </FormItem>
          <FormItem>
            Spotify Artist Link
            <Input
              prefix={<Icon type="sound" style={{ color: 'rgba(0,0,0,.25)' }} />}
              className="spotify"
              placeholder={this.state.artist_spotify}
              onChange={val => this.onChangeSpotify(val)}
            />
          </FormItem>
          <FormItem>
            Personal Website
            <Input
              prefix={<Icon type="desktop" style={{ color: 'rgba(0,0,0,.25)' }} />}
              className="website"
              placeholder={this.state.artist_website}
              onChange={val => this.onChangeWebsite(val)}
            />
          </FormItem>
        </Col>
      </Row>
    );
  }
}

const EPKEdit = Form.create()(NormalLoginForm);

export default EPKEdit;
