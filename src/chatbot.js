import { Client } from 'tmi.js';
import { COMMANDS, COLORS } from './constants.js';

const allCommands = COMMANDS.join(', ');

export default class Chatbot extends Client {
  constructor(OPTIONS) {
    super(OPTIONS);
    // Store method call to each command
    this.commandMethods = {
      '!bot': this.bot,
      '!commands': this.commands,
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

  tallyAndFlagFirst(channel, username) {
    let first = false;
    if (!(username in this.messageCount[channel])) {
      first = true;
      this.messageCount[channel][username] = 1;
    } else {
      this.messageCount[channel][username]++;
    }
    // Return whether it was user's first message on channel for this session
    return first
  }

  runCommand(channel, message) {
    // Retrieve and execute method call if valid command
    if (message in this.commandMethods) this.commandMethods[message](channel);
  }

  // Command methods
  // Note: need to use arrow functions to avoid changing scope of 'this'

  bot = (channel) => {
    this.action(channel, '(bot in training) is here!');
  }

  commands = (channel) => {
    this.say(channel, `Available commands are: ${allCommands}`);
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
      .catch(err => console.log(err));
  }
}
