const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

const token = '6545548439:AAGzoqXEPID3A_sAr_UkPJRv0KwCVviLbKs';
const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(bodyParser.json());

const webAppPage = `
<!DOCTYPE html>
<html>
<head>
  <title>Telegram WebApp</title>
  <style>
    /* Your Telegram Design Guidelines CSS here */
  </style>
</head>
<body>
  <h1>Select a time:</h1>
  <input type="time" id="timePicker">
  <br>
  <button onclick="sendTime()">Send Time</button>
  <script>
    function sendTime() {
      const selectedTime = document.getElementById('timePicker').value;
      window.parent.postMessage({ time: selectedTime }, '*');
    }
  </script>
</body>
</html>
`;

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendPhoto(
        chatId,
        'https://your-website.com/your-image.jpg',
        {
            caption: 'Welcome to the WebApp!',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Open WebApp', url: 'http://localhost:3000/' }],
                ],
            },
        }
    );
});

app.get('/webapp', (req, res) => {
    res.send(webAppPage);
});

app.post('/webapp', (req, res) => {
    const chatId = req.body.message.chat.id;
    const selectedTime = req.body.message.text;
    bot.sendMessage(chatId, `You selected: ${selectedTime}`);
    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log('Express server is running on port 3000');
});
