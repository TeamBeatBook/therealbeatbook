import axios from 'axios';

const logoutState = () => ({ type: 'LOGOUT' });
export const logout = () => dispatch => axios({
  method: 'get',
  url: '/logout',
}).then(() => {
  dispatch(logoutState());
}).catch((err) => {
  console.error(err);
});


export const loadArtistPage = () => ({ type: 'LOADARTISTPAGE' });
export const loadVenuePage = () => ({ type: 'LOADVENUEPAGE' });
export const loadLoginPage = () => dispatch => dispatch(landingViewed());
export const loadHomePage = () => dispatch => dispatch(viewLanding());
const landingViewed = () => ({ type: 'LOADLOGINPAGE' });
const viewLanding = () => ({ type: 'LOADHOMEPAGE' });

export const submitLogin = (username, password, cb) => dispatch => axios({
  method: 'post',
  url: '/login',
  data: {
    username,
    password,
  },
}).then((res) => {
  if (res.data === 'your password is incorrect' || res.data === 'Username does not exist') {
    cb(res.data);
  } if (res.data !== 'your passwords dont match' && res.data !== 'Username does not exist') {
    const type = res.data[0].user_type;
    dispatch(setBookings(res.data[2]));
    if (type === 'artist') {
      dispatch(loadArtistPage(res.data));
      dispatch(setArtist(res.data[1].artist_id));
    } if (type === 'venue') {
      dispatch(loadVenuePage(res.data));
      dispatch(setVenue(res.data[1].venue_id));
    }
  }
});
export const setArtist = artistId => ({ type: 'SET_ARTISTID', payload: artistId });
export const setVenue = venueId => ({ type: 'SET_VENUEID', payload: venueId });
export const setBookings = bookings => ({ type: 'SET_BOOKINGS', payload: bookings });

export const addBook = booking => ({ type: 'ADD_BOOKING', payload: booking });
export const addBooking = booking => (dispatch) => {
  dispatch(addBook(booking));
};
// ************************************************* TOGGLE LOADING BEORE ANY ACTIONS ; STILL NEED TO WRITE IT***

const renderArtistCityList = list => ({ type: 'RENDERARTISTCITYLIST', payload: list });
export const getArtistsByCity = city => dispatch => axios({
  method: 'get',
  url: 'artist/city',
  params: {
    city,
  },
}).then((res) => {
  dispatch(renderArtistCityList(res.data));
}).catch((err) => {
  console.error(err);
});

export const isLoggedIn = () => dispatch => axios({
  method: 'get',
  url: '/isloggedin',
}).then((res) => {
  console.log(res.data);
  const type = res.data[0].user_type;
  dispatch(setBookings(res.data[2]));
  if (type === 'artist') {
    dispatch(loadArtistPage(res.data));
    dispatch(setArtist(res.data[1].artist_id));
    dispatch(landingViewed());
  } if (type === 'venue') {
    dispatch(loadVenuePage(res.data));
    dispatch(setVenue(res.data[1].artist_id));
    dispatch(landingViewed());
  }
}).catch((err) => {
  console.error(err);
});


export const checkLoginStatus = () => axios({
  method: 'get',
  url: '/checkloginstatus',
}).then((res) => {
  if (res.data === true) {
    return true;
  }
  return false;
});
