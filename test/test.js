var twilio = require('twilio'),
    request = require('supertest'),
    sinon = require('sinon'),
    assert = require('assert');

sinon.stub(twilio, 'validateExpressRequest', function () { return true; });

process.env.NODE_ENV = 'test';
var app = require('./../app/app');

describe('basic config', function () {
  beforeEach(function () {
    app.loadConfig('./../test/configs/basic.yml');
  });

  it('calls the specified phone numbers', function (done) {
    request(app.server)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/xml')
      .end(function (err, res) {
        assert.equal(res.text, '<?xml version="1.0" encoding="UTF-8"?><Response><Dial><Number>4155551234</Number><Number>4155555678</Number></Dial></Response>');
        done();
      });
  });
});

describe('basic config with security code', function () {
  beforeEach(function () {
    app.loadConfig('./../test/configs/basic-security.yml');
  });

  it('calls the specified phone numbers after waiting for a security code interrupt', function (done) {
    request(app.server)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/xml')
      .end(function (err, res) {
        assert.equal(res.text, '<?xml version="1.0" encoding="UTF-8"?><Response><Gather numDigits="1" timeout="3"></Gather><Dial><Number>4155551234</Number><Number>4155555678</Number></Dial></Response>');
        done();
      });
  });

  it('handles a security interrupt', function (done) {
    request(app.server)
      .post('/')
      .send({ Digits: '*' })
      .expect(200)
      .expect('Content-Type', 'text/xml')
      .end(function (err, res) {
        assert.equal(res.text, '<?xml version="1.0" encoding="UTF-8"?><Response><Gather numDigits="4"></Gather></Response>');
        done();
      });
  });

  it('plays the correct key tone when the security code is entered', function (done) {
    request(app.server)
      .post('/')
      .send({ Digits: '9022' })
      .expect(200)
      .expect('Content-Type', 'text/xml')
      .end(function (err, res) {
        assert.equal(res.text, '<?xml version="1.0" encoding="UTF-8"?><Response><Play>http://127.0.0.1:8000/public/tones/9.wav</Play></Response>');
        done();
      });
  });

  describe('config with introductions and prompts', function () {
    beforeEach(function () {
      app.loadConfig('./../test/configs/intros.yml');
    });

    it('greets the user when first called, then connects to phones', function (done) {
      request(app.server)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/xml')
        .end(function (err, res) {
          assert.equal(res.text, '<?xml version="1.0" encoding="UTF-8"?><Response><Say>Please hold while I connect you.</Say><Gather numDigits="1" timeout="3"></Gather><Dial><Number>4155551234</Number><Number>4155555678</Number></Dial></Response>');
          done();
        });
    });

    it('prompts your for the security code when recieving the security interrupt', function (done) {
      request(app.server)
        .post('/')
        .send({ Digits: '*' })
        .expect(200)
        .expect('Content-Type', 'text/xml')
        .end(function (err, res) {
          assert.equal(res.text, '<?xml version="1.0" encoding="UTF-8"?><Response><Gather numDigits="4"><Say>Please enter your four-digit secrity code.</Say></Gather></Response>');
          done();
        });
    });

  });

  describe('config with choices', function () {
    beforeEach(function () {
      app.loadConfig('./../test/configs/choices.yml');
    });

    it('greets the user and announces the choices', function (done) {
      request(app.server)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/xml')
        .end(function (err, res) {
          assert.equal(res.text, '<?xml version="1.0" encoding="UTF-8"?><Response><Say>Welcome to the Pirate Ship.</Say><Gather numDigits="1"><Say>Press 1 if you are here to see the captain.</Say><Say>Press 2 if you are here to see the first mate.</Say></Gather></Response>');
          done();
        });
    });

    it('accepts all of the choices presented and makes the appropriate calls', function (done) {
      request(app.server)
        .post('/')
        .send({ Digits: '1' })
        .expect(200)
        .expect('Content-Type', 'text/xml')
        .end(function (err, res) {
          assert.equal(res.text, '<?xml version="1.0" encoding="UTF-8"?><Response><Dial><Number>4155551010</Number><Number>4155552020</Number></Dial></Response>');

          request(app.server)
            .post('/')
            .send({ Digits: '2' })
            .expect(200)
            .expect('Content-Type', 'text/xml')
            .end(function (err, res) {
              assert.equal(res.text, '<?xml version="1.0" encoding="UTF-8"?><Response><Dial><Number>4155553030</Number></Dial></Response>');
              done();
            });
        });

    });

  });

});