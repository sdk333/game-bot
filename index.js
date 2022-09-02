const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = "5682300093:AAFpyTdeNRK-1ZRqSqbw4C5bNAxwE-q2xVA"

const bot = new TelegramApi(token, {polling: true})

const chats = {};

const startGame =async (chatId) => {
    await bot.sendMessage(chatId, 'загадай число от 1 до 10')
    const randomNamber = Math.floor(Math.random()*10);
    chats[chatId] = randomNamber;
    await bot.sendMessage(chatId, 'отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start',description:'начальное приветствие'},
        {command: '/info',description:'получить информацию'},
        {command: '/game',description:'игра угадай число'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start'){
            await bot.sendMessage(chatId,'Васёк, ты?')
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/c2d/c3f/c2dc3fb1-5c68-43ae-aebf-9be8296898a3/6.webp')
            return bot.sendMessage(chatId,'нажми на /info')
        }
        if (text === '/info'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/c2d/c3f/c2dc3fb1-5c68-43ae-aebf-9be8296898a3/10.webp')
            return bot.sendMessage(chatId,'зачем ты это сделал??')
    
        }
        if (text === '/game'){
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю')
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again'){
            return startGame(chatId);
        }
        if (data == chats[chatId]){
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else{
            return bot.sendMessage(chatId, `Неправильно, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start()