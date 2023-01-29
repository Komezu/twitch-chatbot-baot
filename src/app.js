import { Client } from 'tmi.js';
import { OPTIONS } from './options.js'
import command from './commands.js';
import * as helpers from './helpers.js';
import easterEgg from './easter-egg.js';

const client = new Client(OPTIONS);
client.connect();

client.on('join', (channel, username, self) => {
  // Ignore bot joining
  if (self) return;
  // Ignore channel owner joining
  if (username === channel.substring(1)) return;

  // Log new user's name
  console.log(`@${username} joined your channel`);
  // Play chat joining sound
  helpers.playJoinSound();

  // Temporary easter egg!
  if (username in easterEgg) {
    client.say(channel, `Uh-oh! @${username} has invaded this channel!`);
  }
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

  // Make bot reply if message is a command
  const botReply = command(channel, tags, message);
  if (botReply) {
    client.say(channel, botReply);
  }
});
