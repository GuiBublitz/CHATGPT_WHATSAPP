require('dotenv').config();
const {Client, LocalAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const gptHandler = require('./gptHandler');

const enabledMessage = "GPT Enabled, feel free to ask anything :)";
var users = {};

const client = new Client({
    authStrategy: new LocalAuth(),
	puppeteer: {
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	}
})

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message_create', async message => {

    const chat = await message.getChat();
    
    if (message.fromMe && (message.body.startsWith('GPT-Says:') || message.body == enabledMessage)) return;

    users[chat.id.user] = users[chat.id.user] ?? false;

    if (users[chat.id.user]) {
        let response = 'GPT-Says:\n\n' + await gptHandler(message.body);
        return chat.sendMessage(response);
    }

	if(message.body === '!enableGPT') {
        users[chat.id.user] = true;
		message.reply(enabledMessage);
	}
});

client.initialize();