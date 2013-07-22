Doorman [![Build Status](https://travis-ci.org/iancmyers/doorman.png?branch=master)](https://travis-ci.org/iancmyers/doorman)
=======

Doorman allows your apartment entry callbox to call multiple people, dial non-local numbers, and enables automatic entry with a configurable security code.

Installation
------------

Doorman is a NodeJS application that relies on Twilio. You can sign up for a Twilio developer account at https://www.twilio.com/try-twilio

Once you've signed up for your Twilio account, you will want to take note of your SID and Auth Token. You'll then want to configure the app to your liking by creating a YAML file which will live at `app/config.yml`. 

You will need to deploy the application to a publicly available server and specify the `/call` path on your application URL as your Twilio app's "Voice URL". (ex. `http://example.com/call`)

Configuration
-------------

There is an example that you can base it off of, with instructions and documentation at `app/config.yml.example`. Go ahead and copy that and adjust according to the documentation and your preferences. 

```bash
cp app/config.yml.example app/config.yml
```

You can also take a look at the test configs in `test/configs` to see various different configurations.

```yaml
# Doorman uses Twilio to handle all interactions over the phone. You can
# sign up for a developer account at https://www.twilio.com/try-twilio

# Your Twilio SID and AuthToken 
twilioSid: "1234567891011121314151617181920"
twilioAuthToken: "2019181716151413121110987654321"

# A short greeting that will be spoken when the visitor is initially connected
# to the application. (Optional)
introduction: "Welcome to a nerdy apartment!"

# You must un-comment either `choices` or `phones` (not both) as your method 
# for connecting the visitor to the residents. `choices` is good for letting 
# the visitor choose which resident to contact. `phones` is good for contacting 
# all residents at the same time.
#
# `choices` will present the visitor with a call-tree, with the number of each
# choice corresponding to the number the visitor must dial to connect to the 
# specified resident.
#
# choices:
#   1: 
#     message: "Press 1 if you are here to see the captain."
#     phones:
#       - "4155551010"
#       - "4155552020"
#   2:
#     message: "Press 2 if you are here to see the first mate."
#     phones:
#       - "4155553030"
#
# `phones` will call each number listed simultaneously. The visitor will be
# connected with 
#
# phones:
#   - "4155551010"
#   - "4155552020"
#   - "4155553030"

# A four-digit security code that can be used to buzz in the visitor without 
# having to contact the resident. During the greeting the visitor must hit '*'
# to indicate that they would like to use the security code. Once they are
# re-connected they may then enter the code.
securityCode: "1234"

# This is the digit that the resident would dial to buzz in a visitor. This is
# required if you are using `securityCode`.
openKey: "9"

# A short prompt to be spoken when the system is ready to accept a security 
# code (after the visitor has dials '*').
securityPrompt: "Please enter your four-digit secrity code."
```
