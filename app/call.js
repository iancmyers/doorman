var twilio = require('twilio'),
    util = require('./util');

module.exports = function (req, res) {
  var twiml = new twilio.TwimlResponse(),
      config = req.config;

  if (twilio.validateExpressRequest(req, config.twilioAuthToken)) {

    if (config.introduction) {
      twiml.say(config.introduction);
    }

    if (config.choices) {
      twiml = util.announceChoices(twiml, config.choices);
    } else if (config.securityCode) {
      twiml = util.waitForCode(twiml);
    }

    if (config.phones) {
      twiml = util.placeCalls(twiml, config.phones);
    }

    res.type('text/xml');
    res.send(twiml.toString());
  } else {
    res.send(403);
  }
};
