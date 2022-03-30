require('dotenv').config()
const express = require('express');
const axios = require('axios')

const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT,    PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/integration/oauth2/token', (req, res) => {
    const params = new URLSearchParams();
    params.append("code", req.originalUrl.split('?code=')[1])
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", "http://localhost:3000/callback");
    params.append("client_id", process.env.REACT_APP_DROPBOX_CLIENT_ID);
    params.append("client_secret", process.env.REACT_APP_DROPBOX_CLIENT_SECRET);

    axios
      .post("https://api.dropboxapi.com/oauth2/token", params)
      .then(function (response) {
        console.log(response.data)
        res.send(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
});

app.get('/integration/authorize', (req, res) => {
    res.status(301).redirect('https://www.dropbox.com/oauth2/authorize'+`?client_id=${process.env.REACT_APP_DROPBOX_CLIENT_ID}&redirect_uri=http://localhost:3000/callback&response_type=code`)
})

app.listen(3001, () => {
    console.log('Auth Integrations server listening on port 3001');
});
