module.exports = {

  announceChoices: function (twiml, choices) {
    twiml.gather({ numDigits: 1 }, function () {
      for (var key in choices) {
        this.say(choices[key].message);
      }
    });
    return twiml;
  },

  placeCalls: function (twiml, phones) {
    twiml.dial(function () {
      for (var i = 0; i < phones.length; i++) {
        this.number(phones[i]);
      }
    });
    return twiml;
  },

  securityPrompt: function (twiml, prompt) {
    twiml.gather({ numDigits: 4 }, function () {
      if (prompt) {
        this.say(prompt);
      }
    });
    return twiml;
  },

  playTone: function (twiml, url) {
    twiml.play(url);
    return twiml;
  },

  waitForCode: function (twiml) {
    twiml.gather({ numDigits: 1, timeout: 3 });
    return twiml;
  }

};
