module.exports = {
  json2QueryString(params) {
    return encodeURI(
      Object.keys(params)
        .map(function (key) {
          return key + '=' + params[key];
        })
        .join('&'),
    );
  },
};
