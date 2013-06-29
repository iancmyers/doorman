var twilio = require('twilio'),
    util = require('./util');

module.exports = function (req, res) {
  var twiml = new twilio.TwimlResponse(),
      selectedDigits = req.body.Digits,
      config = req.config;

  if (twilio.validateExpressRequest(req, config.twilioAuthToken)) {

    // User wants to enter a security code. Play security prompt and gather
    // security code.
    if (selectedDigits == "*") {
      twiml = util.securityPrompt(twiml, config.securityPrompt);
    } 

    // Security code has been entered, play the tone to open the door.
    else if (selectedDigits == config.securityCode) {
      var url = req.protocol + "://" + req.get('host') + 
        '/public/tones/' + config.openKey + '.wav';
      twiml = util.playTone(twiml, url);
    }

    // User has selected an option from the directory. Place the appropraite
    // calls.
    else if (config.choices[selectedDigits]) {
      var choice = config.choices[selectedDigits];
      twiml = util.placeCalls(twiml, choice.phones);
    }

    // No valid choice was made.
    else {
      res.redirect('/')
    }

    res.type('text/xml');
    res.send(twiml.toString());

  } else {
    res.send();
  } 
};
