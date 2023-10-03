const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

const app = express();
const port = 5000;

const privateKey = fs.readFileSync(
  "/home/admin/conf/web/ssl.lagueslo.com.key",
  "utf8"
);
const certificate = fs.readFileSync(
  "/home/admin/conf/web/ssl.lagueslo.com.crt",
  "utf8"
);
const ca = fs.readFileSync("/home/admin/conf/web/ssl.lagueslo.com.ca", "utf8");
app.use(
  cors({
    origin: "https://lagueslo.com",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => {
  console.log(`HTTPS Server running on https://lagueslo.com:${port}`);
});

require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const connection = mysql.createConnection(dbConfig);

app.get("/users", (req, res) => {
  connection.query("SELECT ID, Name FROM userInfo", (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results);
  });
});
