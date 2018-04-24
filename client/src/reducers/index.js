export const initialState = {
  artist: false,
  venue: false,
  artistId: '',
  venueId: '',
  bookings: [],
  loading: false,
  currentError: '',
  username: '',
  chosenArtist: '',
  searchedArtistCityList: [],
  landingViewed: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOADARTISTPAGE':
      return Object.assign({}, state, { artist: true, username: action.payload });
    case 'LOADVENUEPAGE':
      return Object.assign({}, state, { venue: true });
    case 'LOGOUT':
      return Object.assign({}, state, {
        artist: false, venue: false, username: '', searchedArtistCityList: [], chosenArtist: '', landingViewed: false,
      });
    case 'TOGGLE_LOADING':
      return Object.assign({}, state, { loading: !state.loading });
    case 'SET_BOOKINGS':
      return Object.assign({}, state, { bookings: action.payload });
    case 'SET_ARTISTID':
      return Object.assign({}, state, { artistId: action.payload });
    case 'SET_VENUEID':
      return Object.assign({}, state, { venueId: action.payload });
    case 'ADD_BOOKING':
      state.bookings.unshift(action.payload);
    case 'ERROR':
      return Object.assign({}, state, { currentError: action.payload });
    case 'LOADLOGINPAGE':
      return Object.assign({}, state, { landingViewed: true });
    case 'LOADHOMEPAGE':
      return Object.assign({}, state, { landingViewed: false });
    default:
      return state;
  }
};

export default reducer;
