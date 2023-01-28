require('dotenv').config();

const tmi = require('tmi.js');
const sound = require('sound-play');
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

client.on('join', (channel, username, self) => {
  // Ignore bot joining
  if (self) return;

  // Play chat joining sound
  playJoinSound(username);
});

client.on('message', (channel, userstate, message, self) => {
	// Ignore echoed messages
	if(self) return;

  // Allow bypass of blocked words for bot itself
  if (userstate.username === process.env.BOT_USERNAME) return;

  if (message === '!bot') {
    client.say(channel, 'Bot is here!');
  }

  // Monitor and delete messages with blocked words
  checkTwitchChat(channel, userstate, message);
});

function checkTwitchChat(channel, userstate, message) {
  // Check if message contains blocked word
  message = message.toLowerCase();
  const shouldDeleteMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()));

  if (shouldDeleteMessage) {
    // Delete message
    client.deletemessage(channel, userstate.id)
      .then(() => {
        // Tell user message was deleted
        client.say(channel, `Sorry @${userstate.username}, your message was deleted. Don't say bad words!`);
      })
      .catch(err => console.log(err));
  }
}

function playJoinSound(username) {
  sound.play(`${__dirname}/../sound-files/magic-mallet.mp3`)
    .then(() => console.log(username))
    .catch(err => console.log(err));
}
