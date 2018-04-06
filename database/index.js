const configEnv = require('./config.js');
const configLocal = require('../config.js');
// const moment = require('moment');


const knex = require('knex')({
  client: 'mysql',
  connection: configEnv.user ? configEnv : configLocal,
});

const checkCredentials = username => knex.select().from('users')
  .where(knex.raw(`LOWER(username) = LOWER('${username}')`));

const addUsers = async (username, password, email, userType) => {
  const userQuery = await knex.select().from('users')
    .where(knex.raw(`LOWER(username) = LOWER('${username}')`));
  const emailQuery = await knex.select().from('users')
    .where(knex.raw(`LOWER(email) = LOWER('${email}')`));
  if (userQuery.length) {
    return 'username already exists';
  } else if (emailQuery.length) {
    return 'email already exists';
  }
  return knex('users').insert({
    username, password, email, user_type: userType,
  });
};

const getUserID = async (username) => {
  const id = await knex.select('user_id').from('users').where('username', username);
  return id[0].user_id;
};

const registerArtist = async (username, password, email, city, state) => {
  const result = await addUsers(username, password, email, 'artist');
  if (result === 'username already exists' || result === 'email already exists') {
    return result;
  }
  const id = await getUserID(username);
  return knex('artists').insert({
    artist_name: username, artist_city: city, artist_state: state, user_id: id,
  });
};

const registerVenue = async (username, password, email, venueName, address, city, state, capacity) => {
  const result = await addUsers(username, password, email, 'venue');
  if (result === 'username already exists' || result === 'email already exists') {
    return result;
  }
  const id = await getUserID(username);
  return knex('venues').insert({
    venue_name: venueName, venue_address: address, venue_city: city, venue_state: state, capacity, user_id: id,
  });
};

const getUser = async (username) => {
  const user = await knex.select('*').from('users').where('username', username);
  let bookings;
  if (user[0].user_type === 'artist') {
    const artist = await getArtist(user[0].user_id);
    bookings = await getArtistBookings2(artist.artist_id);
    return [user[0], artist, bookings];
  }
  const venue = await getVenueById(user[0].user_id);
  bookings = await getVenueBookings2(venue.venue_id);
  return [user[0], venue, bookings];
};

const getArtist = async (userId) => {
  const artist = await knex.select('*').from('artists').where('artists.user_id', userId);
  return artist[0];
};

const getVenueById = async (userId) => {
  const venue = await knex.select('*').from('venues').where('venues.user_id', userId);
  return venue[0];
};

const getVenueDetails = async (venue_id) => {
  const venue = await knex.select('*').from('venues').where('venue_id', venue_id);
  return venue[0];
};

const updateVenue = async (info) => {
  await knex('venues').where('venue_id', info.venueId).update({
    venue_city: info.venue_city,
    venue_state: info.venue_state,
    venue_name: info.venue_name,
    venue_address: info.venue_address,
    capacity: info.capacity,
    venue_stage: info.venue_stage,
    venue_description: info.venue_description,
    venue_website: info.venue_website,
  });
};

const getVenuesByCity = city => knex.select('*').from('venues').where('venues.venue_city', city);

const addBooking = async (info) => {
  await knex('bookings').insert({
    artist_id: info.artistId,
    venue_id: info.venueId || 0,
    start_time: info.start_time,
    end_time: info.end_time,
    booking_description: info.booking_description,
    booking_title: info.booking_title,
  });
};


const getVenueEmail = async (venueId) => {
  const userId = await knex.select('user_id').from('venues').where('venue_id', venueId);
  const venueEmail = await knex.select('email').from('users').where('user_id', userId[0].user_id);
  return venueEmail[0].email;
};

const getArtistName = async (artistId) => {
  const artistName = await knex.select('artist_name').from('artists').where('artist_id', artistId);
  return artistName[0].artist_name;
};

const getVenueNameById = async (venueId) => {
  const venue = await knex.select('venue_name').from('venues').where('venue_id', venueId);
  return venue[0].venue_name;
};

const updateConfirmBooking = async (info) => {
  const toggle = info.confirmed === 0 ? 1 : 0;
  await knex('bookings').where('booking_id', info.booking_id).update({
    confirmed: toggle,
  });
  return sendConfirmBookingEmail(info);
};

const sendConfirmBookingEmail = async (info) => {
  const userId = await knex.select('user_id').from('artists').where('artists.artist_id', info.artist_id);
  const email = await knex.select('email').from('users').where('user_id', userId[0].user_id);
  return email[0].email;
};

const updateDenyBooking = async (info) => {
  const toggle = info.denied === 0 ? 1 : 0;
  await knex('bookings').where('booking_id', info.booking_id).update({
    denied: toggle,
  });
};

const deleteBooking = async (bookingId) => {
  await knex('bookings').where('booking_id', bookingId).del();
};

const editEPK = async (info) => {
  const id = info.artist_id;
  await knex('artists').where('artist_id', id).update({
    artist_name: info.artist_name,
    artist_description: info.artist_description,
    artist_city: info.artist_city,
    artist_state: info.artist_state,
    imageUrl: info.imageUrl,
    artist_twitter: info.artist_twitter,
    artist_facebook: info.artist_facebook,
    artist_instagram: info.artist_instagram,
    artist_support: info.artist_support,
    artist_contact: info.artist_contact,
    artist_youtube: info.artist_youtube,
    artist_spotify: info.artist_spotify,
    artist_contactEmail: info.artist_contactEmail,
    artist_website: info.artist_website,
  });
};

const getVenueBookings2 = async venueId => knex.column(knex.raw('b.*, a.artist_name')).select()
  .from(knex.raw('bookings b'))
  .innerJoin(knex.raw('artists a using (artist_id)'))
  .where(knex.raw(`b.venue_id = ${venueId}`))
  .orderBy('b.start_time', 'desc');

const getArtistBookings2 = async artistId => knex.column(knex.raw('b.*, v.venue_name')).select()
  .from(knex.raw('bookings b'))
  .innerJoin(knex.raw('venues v using (venue_id)'))
  .where(knex.raw(`b.artist_id = ${artistId}`))
  .orderBy('b.start_time', 'desc');

const getEpk = async (artistId) => {
  const artist = await knex.select('*').from('artists').where('artists.artist_id', artistId);
  return artist[0];
};

const getEpkData = async (username) => {
  const artist = await knex.select('*').from('artists').where('artists.artist_name', username);
  return artist[0];
};

const addTokenToUser = async (email, token) => {
  await knex('users').where('email', email).update({
    password: token,
  });
};

const changePassword = async (email, password, token) => {
  await knex('users').where('password', token).update({
    password,
  });
};

module.exports = {
  registerArtist,
  registerVenue,
  getUser,
  checkCredentials,
  addBooking,
  getVenueById,
  getVenuesByCity,
  getEpk,
  getVenueBookings2,
  getArtistBookings2,
  updateConfirmBooking,
  updateDenyBooking,
  editEPK,
  getEpkData,
  getVenueDetails,
  updateVenue,
  deleteBooking,
  addTokenToUser,
  changePassword,
  getVenueNameById,
  getVenueEmail,
  getArtistName,
};
