import { Client } from 'tmi.js';
import { OPTIONS } from './options.js'
import * as helpers from './helpers.js';

const client = new Client(OPTIONS);
client.connect();

client.on('join', (_channel, username, self) => {
  // Ignore bot joining
  if (self) return;
  // Log new user's name
  console.log(`@${username} joined your channel`);
  // Play chat joining sound
  helpers.playJoinSound();
});

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages
	if(self) return;

  // Allow bot to bypass blocked words
  if (tags.username !== process.env.BOT_USERNAME) {
    // Check if message contains blocked words
    if (helpers.containsBlockedWord(message)) {
      // Delete message
      client.deletemessage(channel, tags.id)
        .then(() => {
          // Tell user message was deleted
          client.say(channel, `Sorry @${tags.username}, your message was deleted as it contained a blocked word.`);
        })
        .catch(err => console.log(err));
    }
  }

  // Test command: check if bot is in chat
  if (message === '!bot') {
    client.say(channel, 'Bot is here!');
  }
});
