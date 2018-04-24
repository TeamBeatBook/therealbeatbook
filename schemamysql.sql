drop database if exists beatbook;

create database beatbook;
use beatbook;



DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS venues;
DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS bookings;

CREATE TABLE users
(
  user_id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(25) NOT NULL,
  password VARCHAR(60) NOT NULL,
  email VARCHAR(255) DEFAULT NULL,
  facebook_id VARCHAR(255) DEFAULT NULL,
  user_type VARCHAR(10) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id)
);


CREATE TABLE venues
(
  venue_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  venue_name VARCHAR(50) NOT NULL,
  venue_description VARCHAR(8000) DEFAULT NULL,
  capacity INT NOT NULL,
  venue_city VARCHAR(25),
  venue_state VARCHAR(25),
  venue_address VARCHAR (25),
  venue_stage VARCHAR(1000) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  venue_website VARCHAR(50),
  PRIMARY KEY (venue_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);


CREATE TABLE artists
(
  artist_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  artist_name VARCHAR(50) NOT NULL,
  artist_description VARCHAR(8000) DEFAULT NULL,
  artist_city VARCHAR(25),
  artist_state VARCHAR(25),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  imageUrl LONGBLOB,
  artist_facebook VARCHAR(50),
  artist_twitter VARCHAR(50),
  artist_instagram VARCHAR(50),
  artist_support VARCHAR(8000),
  artist_contact VARCHAR(100),
  artist_youtube VARCHAR(100),
  artist_spotify VARCHAR(100),
  artist_contactEmail VARCHAR(40),
  artist_website VARCHAR(50),
  PRIMARY KEY (artist_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE bookings
(
  booking_id INT NOT NULL AUTO_INCREMENT,
  artist_id INT DEFAULT 0,
  venue_id INT DEFAULT 0,
  booking_title VARCHAR(50),
  start_time VARCHAR(50),
  end_time VARCHAR(50),
  booking_description VARCHAR(8000),
  confirmed boolean DEFAULT FALSE,
  denied boolean DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (booking_id),
  FOREIGN KEY (artist_id) REFERENCES artists (artist_id),
  FOREIGN KEY (venue_id) REFERENCES venues (venue_id)
);

-- POSSIBLY MAKE CITY/STATE TABLES FOR CATEGORIZATION AND REFERENCE CITY_id AND STATE_id IN VENUES TABLE

-- ---
-- Test Data
--
-- ---

-- insert into users
--   (user_id, username, password)
-- VALUES
--   (1, 'yaboi', '$2a$10$MCRlmB8bUswMTqKG.kURCu2pu8ipopli2LLaO5OODNokt44cpLZ56'),
--   (2, 'Gepeto', '$2a$10$pKgnmkFU5W7D70ekyEurruql72IonF7c5MiPlfnHrc9ywjrAF89Ou');

-- insert into artists
--   (artist_id, user_id, artist_name, artist_description, user_type)
-- VALUES
--   (1, 1, 'Trouble', 'turbofunk', 'artist');

-- insert into bookings(artist_id, venue_id, booking_title, start_time, end_time, booking_description, confirmed) values (1,1,'Rubber Duckython', '2018-03-23T9:00:00','2018-03-23T17:00:00','The bestest conference for all your Rubber Ducky needs', 0);
-- insert into bookings(artist_id, venue_id, booking_title, start_time, end_time, booking_description, confirmed) values (1,1,'Rubber Ducky Dynasty', '2018-03-24T9:00:00','2018-03-24T17:00:00','Not sure if a rubber ducky will come to a duck whistle?', 0);
-- insert into bookings(artist_id, venue_id, booking_title, start_time, end_time, booking_description, confirmed) values (1,2,'The Fellowship of the Rubber Ducky', '2018-03-25T9:00:00','2018-03-25T17:00:00','You must through the Rubber Ducky into the bath Frodo', 0);
-- insert into venues
--   (venue_id, user_id, venue_name, venue_description, capacity)
-- VALUES
--   (1, 2, 'Vulcan', 'sixth street venue', 700);
