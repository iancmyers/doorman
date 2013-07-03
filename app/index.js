module.exports = function (req, res) {
  res.send({
    app: 'doorman',
    url: req.protocol + '://' + req.headers.host + req.url,
    config: (req.config ? 'loaded' : 'not loaded'),
    timestamp: new Date().getTime()
  });
}