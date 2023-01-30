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
      '!recolorbot': this.recolorBot
    }
  }

  runCommand(channel, message) {
    // Retrieve and execute method call if valid command
    if (message in this.commandMethods) this.commandMethods[message](channel);
  }

  // Command methods
  // Note: need to use arrow functions to avoid changing scope of 'this'

  bot = (channel) => {
    this.say(channel, 'KohiBeanBot (bot in training) is here!');
  }

  commands = (channel) => {
    this.say(channel, `Available commands are: ${allCommands}`);
  }

  help = (channel) => {
    this.say(channel, `Available commands are: ${allCommands}`);
  }

  recolorBot = (channel) => {
    const color = COLORS[Math.floor(Math.random()*COLORS.length)];
    this.color(color)
      .then(response => this.say(channel, `KohiBeanBot was recolored to ${response}!`))
      .catch(err => console.log(err));
  }
}
