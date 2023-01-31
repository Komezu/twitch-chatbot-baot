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

  // Temporary easter egg!
  if (username in easterEgg) {
    chatbot.say(channel, `Hey @${channel.substring(1)}! Your friend @${username} just joined the chat!`);
  }
});

chatbot.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages
	if(self || tags.username === OPTIONS.identity.username) return;

  // Add message to user's count and check if first of session
  if (chatbot.tallyAndFlagFirst(channel, tags.username)) {
    // Play sound if first
    helpers.playFirstMessageSound();
    chatbot.say(channel, `Welcome to the channel, ${tags.username}! Type !commands for a list of chatbot commands.`)
  }

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
});

chatbot.on('chat', (channel, _tags, message, _self) => {
  // Execute command if available (not called on actions and whispers)
  chatbot.runCommand(channel, message.toLowerCase());
});
