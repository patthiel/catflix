'use strict';

var Alexa = require('alex-sdk');
var rest = requre('rest');

var languageStrings = {
  'en-US': {
    'translation': {
      'SKILL_NAME': 'Cat Flix',
      'SEARCH_MSG': 'What film are you looking for?',
      'HELP_MSG': 'You can say search for a movie, or, you can say find a film',
      'HELP_REPROMPT': 'What can I help you with?',
      'STOP_MESSAGE': 'Peace out, cub scout'
    }
  }
};

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'LaunchRequest': () => {
    this.emit(':ask', this.t('SEARCH_MSG'));
  },

  'catFlixPrompt': () => {
    this.emit(':ask', this.t('SEARCH_MSG'));
  },

  'catFlixSearch': () => {
    couchPotatoSearch(this.event.request.intent);
  },

  'AMAZON.HelpIntent': () => {
    var speechOutput = this.t('HELP_MSG');
    var reprompt = this.t('HELP_REPROMPT');
    this.emit(':tell', speechOutput, reprompt);
  },

  'AMAZON.StopIntent': () => {
    var speechOutput = this.t('STOP_MESSAGE');
    this.emit(':tell', speechOutput);
  },

  'AMAZON.CancelIntent': () => {
    var speechOutput = this.t('STOP_MESSAGE');
    this.emit(':tell', speechOutput);
  }
};

function couchPotatoSearch() {

}
