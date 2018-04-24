module.exports = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB,
  port: process.env.DB_PORT,
};

// export DB_HOST=thebeatbook.cf0tcwamdz9t.us-west-2.rds.amazonaws.com
// export DB_PORT=3306
// export DB_DB=beatbook
// export DB_PASSWORD=Manikstevetrent
// export DB_USER=thebeatbook
// run webpack webpack:  --config ./webpack.config.js --progress
// run server: pm2 start server/index.js -- --production
// kill server: pm2 kill
// add .env values: example: export DB_PORT=3306
// view .env values: printenv
