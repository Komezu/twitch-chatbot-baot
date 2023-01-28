import { dirname } from 'path';
import { fileURLToPath } from 'url';

import sound from 'sound-play';
import { BLOCKED_WORDS, COMMANDS } from './constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function playJoinSound() {
  // Set volume: default is 0.5, max is 1
  const volume = 0.25;
  sound.play(`${__dirname}/../sound-files/magic-mallet.mp3`, volume)
    .catch(err => console.log(err));
}

export function containsBlockedWord(message) {
  message = message.toLowerCase();
  return BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord));
}

// export function isCommand(message) {
//   message = message.toLowerCase();
//   return COMMANDS.some(command => message.includes(command));
// }
