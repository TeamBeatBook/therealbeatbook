import React from 'react';
import $ from 'jquery';
import 'fullcalendar';
import { Modal, Form, Input, TimePicker, message } from 'antd';
import axios from 'axios';

const moment = require('moment')/* eslint-disable-line */; // check back in a couple days

const Calendar = (bookings, editable, artistId, venueId, saveToStore, venueName) => {
  $(function () { /* eslint-disable-line */
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay',
      },

      droppable: true,
      selectable: true,
      selectHelper: true,
      unselectAuto: false,
      nowIndicator: true,
      height: window.innerHeight * 0.87,

      select(start, end) { /* eslint-disable-line */
        if (editable) {
          let momentStart = start;
          let momentEnd = end;
          const setStart = (value) => { momentStart = value; };
          const setEnd = (value) => { momentEnd = value; };
          Modal.confirm({
            title: 'Event Info',
            content: (
              <div>
                <Form layout="horizontal">
                  <Form.Item label="Event Title" required="true">
                    <Input className="title" placeholder="Name Your Proposed Event Here" />
                  </Form.Item>
                  <Form.Item label="Event Description">
                    <Input className="description" placeholder="Give some details about the event here..." />
                  </Form.Item>
                  <Form.Item label="Start Time">
                    <TimePicker
                      className="start"
                      defaultValue={moment(start, 'HH:mm')}
                      format="HH:mm"
                      minuteStep={15}
                      onChange={value => setStart(value)}
                    />
                  </Form.Item>
                  <Form.Item label="End Time">
                    <TimePicker
                      className="end"
                      defaultValue={end.subtract(1, 'm')}
                      format="HH:mm"
                      minuteStep={15}
                      onChange={value => setEnd(value)}
                    />
                  </Form.Item>
                </Form>
              </div>
            ),
            onOk() {
              message.success('Your booking request has been sent!');
              const title = $('.title').val();
              const description = $('.description').val();
              const startTime = momentStart.local().format();
              const endTime = momentEnd.local().format();
              if (title) {
                $('#calendar').fullCalendar(
                  'renderEvent',
                  {
                    title,
                    start: startTime,
                    end: endTime,
                    description,
                    allDay: false,
                  },
                  true,
                );
                const newLocalBooking = {
                  booking_title: title,
                  booking_description: description,
                  start_time: startTime,
                  end_time: endTime,
                  artistId,
                  venueId,
                  venue_name: venueName,
                  confirmed: 0,
                  denied: 0,
                };
                const newUTCBooking = Object.assign({}, newLocalBooking, {
                  start_time: momentStart.utc().format(),
                  end_time: momentEnd.utc().format(),
                });
                saveToStore(newLocalBooking);
                axios.post('/calendar', newUTCBooking).then(() => {
                }).catch((err) => {
                  console.error(err);
                });
              } else {
                alert('You need a title'); /* eslint-disable-line */
              }
            },
            onCancel() {},
          });
        }
        $('#calendar').fullCalendar('unselect');
      },

      events(start, end, timezone, callback) {
        const events = [];
        if (bookings) {
          bookings.forEach((event) => {
            const startLocal = moment.utc(event.start_time).local().format();
            const endLocal = moment.utc(event.end_time).local().format();
            const calendarColor = event.confirmed === 1 ? '#81c784' : '#90a4ae';
            const subtext = event.venue_name ? event.venue_name : event.artist_name;
            events.push({
              title: event.booking_title,
              description: `${event.booking_description} - ${subtext} `,
              start: startLocal,
              end: endLocal,
              id: event.booking_id,
              color: calendarColor,
            });
          });
        }
        callback(events);
      },

      minTime: '6:00:00',
      maxTime: '26:00:00',

      eventClick(event) {
        Modal.info({
          title: event.title,
          maskClosable: true,
          content: (
            <div>
              <div>{event.description}</div>
              <div>{event.start.format('MMMM Do, h:mm a')} - {event.end.format('h:mm a')}</div>
            </div>
          ),
          onOk() {},
        });
      },
    });
  });

  return (
    <div>
      <div id="calendar" />
    </div>
  );
};

export default Calendar;
