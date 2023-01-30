import * as dotenv from 'dotenv';
dotenv.config();

export default {
  options: { debug: true },
  connection: {
    reconnect: true,
    maxReconnectAttemps: 10
  },
	identity: {
		username: process.env.BOT_USERNAME,
		password: `oauth:${process.env.OAUTH_TOKEN}`
	},
	channels: [ process.env.CHANNEL_NAME ]
}
