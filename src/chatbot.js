import { Client } from 'tmi.js';
import * as helpers from './helpers.js';
import { COMMANDS, COLORS } from './constants.js';

const allCommands = COMMANDS.join(', ');

export default class Chatbot extends Client {
  constructor(OPTIONS) {
    super(OPTIONS);

    // Store method call to each command
    this.commandMethods = {
      '!bot': this.bot,
      '!commands': this.commands,
      '!funfact': this.funFact,
      '!game': this.game,
      '!help': this.help,
      '!randomnum': this.randomNum,
      '!recolorbot': this.recolorBot
    };

    // Store chatters' message count in a channel for a bot session
    this.messageCount = {};
    OPTIONS.channels.forEach((channel) => {
      // Initialize channel owner's count to 0 to avoid triggering first message sound alert
      this.messageCount[channel] = { [channel.substring(1)]: 0 };
    })
  }

  generateChatLogs(channels) {
    this.chatLogPaths = {};
    // Create chat log file of the day for each channel and store its location
    channels.forEach((channel) => {
      const path = helpers.createChatLogFile(channel);
      this.chatLogPaths[channel] = path;
    })
  }

  writeToChatLog(channel, username, timestamp, message) {
    const path = this.chatLogPaths[channel];
    if (username === this.getUsername()) {
      // Set a delay of 100ms to make sure bot reply always logged after command
      setTimeout(() => {
        helpers.logChatMessage(path, username, timestamp, message);
      }, 100);
    } else {
      helpers.logChatMessage(path, username, timestamp, message);
    }
  }

  tallyAndFlagFirst(channel, username) {
    let first = false;
    if (!(username in this.messageCount[channel])) {
      first = true;
      this.messageCount[channel][username] = 1;
    } else {
      this.messageCount[channel][username]++;
    }
    // Return whether it was user's first message on channel for this session
    return first;
  }

  runCommand(channel, message) {
    // Retrieve and execute method call if valid command
    if (message in this.commandMethods) this.commandMethods[message](channel);
  }

  // =============================== Command Methods ===============================
  //       Note: Need to use arrow functions to avoid changing scope of 'this'
  // ===============================================================================

  bot = (channel) => {
    this.action(channel, '(bot in training) is here!');
  }

  commands = (channel) => {
    this.say(channel, `Available commands are: ${allCommands}`);
  }

  funFact = (channel) => {
    helpers.getFunFact()
      .then((fact) => {
        if (fact) {
          this.say(channel, fact);
        } else {
          throw new Error;
        }
      })
      .catch(() => this.action(channel, 'could not find a fun fact to share.'));
  }

  game = (channel) => {
    // Get game name, then game IGDB id, then game summary
    helpers.getGameName(channel)
      .then((name) => {
        if (name) {
          this.say(channel, `Currently playing: ${name}`);
        } else {
          throw new Error;
        }
        // Explicitly return name value to use it in next promise
        return helpers.getIGDBId(name);
      })
      .then(id => helpers.getGameSummary(id))
      .then((summary) => {
        if (summary) {
          this.say(channel, summary);
        } else {
          throw new Error;
        }
      })
      .catch(() => this.action(channel, 'could not get the summary of the game.'));
  }

  help = (channel) => {
    this.say(channel, `Available commands are: ${allCommands}`);
  }

  randomNum = (channel) => {
    this.say(channel, `Number generated: ${Math.floor(Math.random() * 100) + 1}`);
  }

  recolorBot = (channel) => {
    const color = COLORS[Math.floor(Math.random()*COLORS.length)];
    this.color(color)
      .then(response => this.action(channel, `was recolored to ${response}!`))
      .catch(() => this.action(channel, `was not recolored successfully.`));
  }
}
