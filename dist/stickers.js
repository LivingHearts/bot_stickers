"use strict";
// import { Context } from 'telegraf';
// import { STICKER_SET_NAME } from './config';
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSticker = void 0;
const config_1 = require("./config");
const addSticker = (ctx) => {
    const message = ctx.message;
    if (!message || !('sticker' in message)) {
        ctx.reply('Повідомлення не містить стікера.');
        return;
    }
    const sticker = message.sticker;
    if (!sticker)
        return;
    // Перевірка на набір стікерів
    if (sticker.set_name !== config_1.STICKER_SET_NAME) {
        ctx.reply('Цей стікер не належить до потрібного набору.');
        return;
    }
    // Надсилаємо цей стікер назад у групу (або чат)
    ctx.replyWithSticker(sticker.file_id) // надсилаємо стікер, використовуючи file_id
        .then(() => {
        ctx.reply('Стікера додано до групи!');
    })
        .catch((err) => {
        ctx.reply('Сталася помилка при додаванні стікера.');
        console.error(err);
    });
};
exports.addSticker = addSticker;
