import Chatbot from './chatbot.js';
import OPTIONS from './options.js'
import * as helpers from './helpers.js';
import easterEgg from './easter-egg.js';

const chatbot = new Chatbot(OPTIONS);
chatbot.connect();

chatbot.on('join', (channel, username, self) => {
  // Ignore bot joining
  if (self) return;
  // Ignore channel owner joining
  if (username === channel.substring(1)) return;

  // Log new user's name in console
  console.log(`@${username} joined ${channel}`);
  // Play chat joining sound
  helpers.playJoinSound();

  // Temporary easter egg!
  if (username in easterEgg) {
    chatbot.say(channel, `Hey @${channel.substring(1)}! Your friend @${username} just joined the chat!`);
  }
});

chatbot.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages
	if(self) return;

  // Allow bot to bypass blocked words
  if (tags.username !== OPTIONS.identity.username) {
    // Check if message contains blocked words
    if (helpers.containsBlockedWord(message)) {
      // Delete message
      chatbot.deletemessage(channel, tags.id)
        .then(() => {
          // Tell user message was deleted
          chatbot.say(channel, `Sorry @${tags.username}, your message was deleted as it contained a blocked word.`);
        })
        .catch(err => console.log(err));
    }
  }

  // Execute command if message is command
  chatbot.runCommand(channel, message);
});
