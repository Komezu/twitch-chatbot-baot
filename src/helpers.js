import { dirname } from 'path';
import { fileURLToPath } from 'url';

import fs from 'fs';
import sound from 'sound-play';
import axios from 'axios';
import { BLOCKED_WORDS } from './constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function createChatLogFile(channel) {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const filepath = `${__dirname}/../chat-logs/${year}${month}${day}_${channel.substring(1)}.txt`;
  // Create file if doesn't exist yet, using 'a' flag to avoid overwriting
  fs.closeSync(fs.openSync(filepath, 'a'));

  return filepath;
}

export function playFirstMessageSound() {
  // Set volume: default is 0.5, max is 1
  const volume = 0.25;
  sound.play(`${__dirname}/../sound-files/magic-mallet.mp3`, volume)
    .catch(err => console.log(err));
}

export function containsBlockedWord(message) {
  message = message.toLowerCase();
  return BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord));
}

export async function getGameName(channel) {
  // Call Twitch Helix API streams endpoint
  const url = `https://api.twitch.tv/helix/streams?type=live&user_login=${channel.substring(1)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${process.env.OAUTH_TOKEN}`,
        'Client-Id': process.env.CLIENT_ID
      }
    });
    return response.data.data[0].game_name;
  } catch(err) {
    console.log(err);
  }
}

export async function getIGDBId(game) {
  // Call Twitch Helix API games endpoint
  const url = `https://api.twitch.tv/helix/games?name=${game}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${process.env.OAUTH_TOKEN}`,
        'Client-Id': process.env.CLIENT_ID
      }
    });
    return response.data.data[0].igdb_id;
  } catch(err) {
    console.log(err);
  }
}

export async function getGameSummary(id) {
  // Call IGDB API games endpoint
  const url = 'https://api.igdb.com/v4/games';
  const body = `fields summary; where id = ${id};`;

  try {
    const response = await axios.post(url, body, {
      headers: {
        'Authorization': `Bearer ${process.env.IGDB_TOKEN}`,
        'Client-ID': process.env.CLIENT_ID
      }
    });
    return response.data[0].summary;
  } catch(err) {
    console.log(err);
  }
}
