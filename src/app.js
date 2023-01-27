require('dotenv').config();

const tmi = require('tmi.js');
const { BLOCKED_WORDS } = require('./constants');

const options = {
  options: { debug: true },
	identity: {
		username: process.env.BOT_USERNAME,
		password: `oauth:${process.env.OAUTH_TOKEN}`
	},
	channels: [ process.env.CHANNEL_NAME ]
}

const client = new tmi.Client(options);

client.connect();

client.on('message', (channel, userstate, message, self) => {
	// Ignore echoed messages
	if(self) return;

  // Allow bypass of blocked words for bot itself
  if (userstate.username === process.env.BOT_USERNAME) return;

  // Monitor and delete messages with blocked words
  checkTwitchChat(channel, userstate, message);
});

function checkTwitchChat(channel, userstate, message) {
  // Check if message contains blocked word
  message = message.toLowerCase();
  const shouldDeleteMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()));

  if (shouldDeleteMessage) {
    // Delete message
    client.deletemessage(channel, userstate.id);
    // Tell user message was deleted
    client.say(channel, `@${userstate.username}, sorry, your message was deleted.`);
  }
}
