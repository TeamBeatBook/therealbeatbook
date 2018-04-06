const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('../database/index.js');
const passport = require('passport');
const helpers = require('./helpers.js');//eslint-disable-line
const app = express();
require('../server/config/passport')(passport);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '/../client/dist')));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true, limit: '50mb' }));
app.use(require('express-session')({
  secret: process.env.SESSION_PASSWORD || 'supersecretsecret',
  resave: false,
  saveUninitialized: false,
}));

const randomUrl = (length) => {
  let text = '';
  const possible = '$2a$10$yBVgx0p7IJJgfrswML8VVun9LprDc1.GYvav6sm3aQKsZOqM1gU8G';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.post('/forgot/password', (req, res) => {
  const token = randomUrl(40);
  db.addTokenToUser(req.body.email, token);
  helpers.sendPasswordRecoveryEmail(req.body.email, token);
  res.end('email sent');
});

app.post('/change/password', (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);
  db.changePassword(req.body.email, hash, req.body.token);
  res.send('changed password');
});


// Due to express, when you load the page, it doesnt make a get request to '/', it simply serves up the dist folder
app.post('/', (req, res) => {
  res.end();
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      // throw err;
      res.status(500).send(err);
    }
  });
  res.end();
});

app.post('/register/artist', async (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);
  const registration = await db.registerArtist(req.body.username, hash, req.body.email, req.body.city, req.body.state);
  if (registration === 'username already exists') {
    return res.send('username already exists');
  } if (registration === 'email already exists') {
    return res.send('email already exists');
  }
  helpers.sendEmail(req.body.username, req.body.email);
  const user = await db.getUser(req.body.username);
  req.login(user[0], () => {
    res.send(user);
  });
});

app.post('/register/venue', async (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);
  const registration = await db.registerVenue(req.body.username, hash, req.body.email, req.body.venueName, req.body.address, req.body.city, req.body.state, req.body.capacity);//eslint-disable-line
  if (registration === 'username already exists') {
    return res.send('Username already exists');
  } if (registration === 'email already exists') {
    return res.send('Email already exists');
  }
  helpers.sendEmail(req.body.username, req.body.email);
  const user = await db.getUser(req.body.username);
  req.login(user[0], () => {
    res.send(user);
  });
});

app.post('/login', async (req, res) => {
  const userInfo = await db.checkCredentials(req.body.username);
  if (userInfo.length) {
    const checkUser = userInfo[0];
    if (bcrypt.compareSync(req.body.password, checkUser.password)) {
      const user = await db.getUser(req.body.username);
      req.login(user[0], () => {
        res.send(user);
      });
    } else {
      res.send('your password is incorrect');
    }
  } else {
    res.send('Username does not exist');
  }
});

passport.serializeUser((user, done) => {
  done(null, user);
});

app.get('/isloggedin', async (req, res) => {
  if (req.session.passport && req.session.passport.user) {
    const userInfo = await db.getUser(req.session.passport.user.username);
    res.send(userInfo);
  } else {
    res.json([{ user_type: 'none' }]);
  }
});

app.get('/checkloginstatus', (req, res) => {
  if (req.session.passport && req.session.passport.user) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.get('/logout', (req, res) => {
  res.send();
});

/** ****************************** Calendar ********************************* */
app.post('/calendar', async (req, res) => {
  console.log('looking for artisid and venue name', req.body);
  const venueEmail = await db.getVenueEmail(req.body.venueId);
  const artistName = await db.getArtistName(req.body.artistId);
  helpers.sendRequestEmail(venueEmail, artistName);
  await db.addBooking(req.body);
  res.status(200).end();
});


app.get('/artist/city', async (req, res) => {
  const artistList = await db.getArtistsByCity(req.query.city);
  res.json(artistList);
});


/* ******************************** Venue *********************************** */
app.get('/venues', async (req, res) => {
  const { city } = req.query;
  const venues = await db.getVenuesByCity(city);
  res.status(200).send({ venues });
});

app.get('/venueCalendar', async (req, res) => {
  const { venue_id } = req.query;
  const venueCalendar = await db.getVenueBookings2(venue_id);
  res.status(200).send(venueCalendar);
});

app.patch('/confirm', async ({ body }, res) => {
  const email = await db.updateConfirmBooking(body);
  const venue = await db.getVenueNameById(body.venue_id);
  helpers.sendConfirmBooking(email, venue);
  const bookings = await db.getVenueBookings2(body.venue_id);
  res.status(200).send({ bookings });
});

app.patch('/deny', async ({ body }, res) => {
  const email = await db.updateConfirmBooking(body);
  const venue = await db.getVenueNameById(body.venue_id);
  helpers.sendDenyBooking(email, venue);
  await db.updateDenyBooking(body);
  const bookings = await db.getVenueBookings2(body.venue_id);
  res.status(200).send({ bookings });
});

app.post('/booking', async ({ body }, res) => {
  await db.deleteBooking(body.booking_id);
  const bookings = await db.getArtistBookings2(body.artist_id);
  res.status(200).send({ bookings });
});

app.get('/venueDetails', async (req, res) => {
  const venueDetails = await db.getVenueDetails(req.query.venue_id);
  res.status(200).send(venueDetails);
});

app.post('/updateVenue', async (req, res) => {
  db.updateVenue(req.body);
  res.status(200).send();
});

/* ******************************** EPK ************************************* */
app.post('/epkImgUpload', async (req, res) => {
  res.status(200).send();
});

app.post('/updateEPK', async (req, res) => {
  db.editEPK(req.body);
  res.status(200).send();
});

app.get('/epk', async (req, res) => {
  const epk = await db.getEpk(req.query.artistId);
  res.status(200).send({ epk });
});

app.get('/artist/epk', async (req, res) => {
  const epk = await db.getEpkData(req.query.username);
  res.status(200).send({ epk });
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/dist/index.html'));
});

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port 3000!');
});
