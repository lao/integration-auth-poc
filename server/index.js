require('dotenv').config();
const express = require('express');
const avilableServices = require('./services');
const app = express();

CONSTS = {
  SERVER_PORT: 3001
}

// Set headers to allow cors
app.use(setAllowCorsHeaders);

/**
 * ENDPOINTS - AUTHORIZATION
 */
app.get('/integration/authorize/:service', integrationAuthorization);
app.post('/integration/oauth2/token/:service', integrationOauth2Token);

// Start server
app.listen(CONSTS.SERVER_PORT, () => {
  console.log(`Auth Integrations server listening on port ${CONSTS.SERVER_PORT}`);
});

function integrationAuthorization(req, res) {
  const { service } = req.params;

  if (service in avilableServices) {
    avilableServices[service].authorize(req, res);
  } else {
    res.status(404).send('Service not found');
  }
}

function integrationOauth2Token(req, res) {
  const { service } = req.params;
  
  if (service in avilableServices) {
    avilableServices[service].getToken(req, res);
  } else {
    res.status(404).send('Service not found');
  }
}

function setAllowCorsHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT,    PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
}
