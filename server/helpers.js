const nodemailer = require('nodemailer');

exports.sendEmail = (username, email) => {
  nodemailer.createTestAccount(() => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'thebeatbookhelp@gmail.com',
        pass: 'Manikstevetrent!',
      },
    });
    const mailOptions = {
      from: '"Thebeatbook" <thebeatbookhelp@gmail.com>', // sender address
      to: email, // list of receivers
      subject: `Welcome ${username} ✔`, // Subject line
      text: `Hello ${username}! Welcome to BeatBook!`, // plain text body
      html: `<b>Hello ${username}! Welcome to BeatBook!</b>`, // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
  });
};


exports.sendPasswordRecoveryEmail = (email, token) => {
  nodemailer.createTestAccount(() => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'thebeatbookhelp@gmail.com',
        pass: 'Manikstevetrent!',
      },
    });
    const mailOptions = {
      from: '"Thebeatbook" <thebeatbookhelp@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Password Recovery ✔', // Subject line
      text: `Hello ${email}! Welcome to BeatBook!`, // plain text body
      html: `<p>Click <a href=http://localhost:3000/password/recover/${email}/${token}>here</a> to reset your password</p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
  });
};

exports.sendConfirmBooking = (email, venue) => {
  nodemailer.createTestAccount(() => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'thebeatbookhelp@gmail.com',
        pass: 'Manikstevetrent!',
      },
    });
    const mailOptions = {
      from: '"Thebeatbook" <thebeatbookhelp@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Booking Notice ✔', // Subject line
      text: `Hello ${email}! Welcome to BeatBook!`, // plain text body
      html: `<p>Congratulations! ${venue} has confirmed your booking request!</p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
  });
};

exports.sendDenyBooking = (email, venue) => {
  nodemailer.createTestAccount(() => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'thebeatbookhelp@gmail.com',
        pass: 'Manikstevetrent!',
      },
    });
    const mailOptions = {
      from: '"Thebeatbook" <thebeatbookhelp@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Booking Notice ✔', // Subject line
      text: `Hello ${email}! Welcome to BeatBook!`, // plain text body
      html: `<p>Unfortunately ${venue} could not accept your booking request. Better Luck next time!</p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
  });
};

exports.sendRequestEmail = (venueEmail, artistName) => {
  nodemailer.createTestAccount(() => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'thebeatbookhelp@gmail.com',
        pass: 'Manikstevetrent!',
      },
    });
    const mailOptions = {
      from: '"Thebeatbook" <thebeatbookhelp@gmail.com>', // sender address
      to: venueEmail, // list of receivers
      subject: 'Request Notice ✔', // Subject line
      text: '', // plain text body
      html: `<p>Heads up! You have a new Request from ${artistName}</p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
  });
};
