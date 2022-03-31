const axios = require('axios');

module.exports = {
  dropbox: {
    authorize: (req, res) => {
      const client_id = process.env.REACT_APP_DROPBOX_CLIENT_ID;
      const callback = `http://localhost:3000/dropbox/callback&response_type=code`
      return res
        .status(301)
        .redirect(
          `https://www.dropbox.com/oauth2/authorize?client_id=${client_id}&redirect_uri=${callback}`
        );
    },
    getToken: (req, res) => {
      const params = new URLSearchParams();
      params.append("code", req.originalUrl.split("?code=")[1]);
      params.append("grant_type", "authorization_code");
      params.append("redirect_uri", "http://localhost:3000/dropbox/callback");
      params.append("client_id", process.env.REACT_APP_DROPBOX_CLIENT_ID);
      params.append("client_secret", process.env.REACT_APP_DROPBOX_CLIENT_SECRET);

      axios
        .post("https://api.dropboxapi.com/oauth2/token", params)
        .then(function (response) {
          res.send({
            ...response.data,
            service: 'dropbox'
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
