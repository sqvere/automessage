const telegram = require('node-telegram-bot-api');
const config = require("./config.json");

console.log(`Telegram AutoMessage by Auto`);
console.log(`Starting bot...`);

const client = new telegram(config.token, { polling: true });

client.on("inline_query", (query) => {
    if(query.from.id != config.id) return client.answerInlineQuery(query.id, [{
        'type': "article",
        'id': "info",
        'input_message_content': {
            "message_text": 'Использование этого бота вам не доступно'
        },
        'title': 'Использование этого бота вам не доступно'
    }]);

    if(config.messages.find(message => !message.title || !message.content)) return console.log('Неверное заполнение файла config.json');

    let callback = new Array();
    let i = 0;
    for(let message of config.messages) {
        let buttons = new Array();
        if(message.buttons) {
            for(let button of message.buttons) {
                if(button.text && button.url) buttons.push(new Array(button));
            }
        }
        callback.push({
            type: "article",
            id: i++,
            input_message_content: {
                message_text: message.content,
                parse_mode: ["Markdown", "MarkdownV2", "HTML"].includes(message.parse_mode) ? message.parse_mode : undefined
            },
            title: message.title,
            reply_markup: buttons.length > 0 ? {
                inline_keyboard: buttons
            } : undefined
        });
    }

    client.answerInlineQuery(query.id, callback);
});

client.on("polling_error", (err) => {
    if(err.message.includes('401')) {
        console.log(`Error | Invalid token`);
        process.exit(1);
    }
    console.log(`Error | ${err.message}`);
});