const TelegramBot = require("node-telegram-bot-api");
const { users } = require("./index");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const id = msg.from.id;

  if (!users[id]) {
    users[id] = {
      id,
      username: msg.from.username,
      balance: 100
    };
  }

  bot.sendMessage(msg.chat.id,
    `👤 ${msg.from.username}\n💰 Баланс: ${users[id].balance}\nID: ${id}`
  );
});
