// import * as helpers from './helpers.js';
import { COMMANDS } from "./constants.js";

const allCommands = COMMANDS.join(', ');

export default (channel, tags, message) => {
  message = message.toLowerCase();

  switch (message) {
    case '!bot':
      return 'KohiBeanBot (bot in training) is here!';

    case '!commands':
      return `Available commands are: ${allCommands}`;

    case '!help':
      return `Available commands are: ${allCommands}`;
  }
}
