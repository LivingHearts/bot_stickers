// import { Context } from 'telegraf';
// import { STICKER_SET_NAME } from './config';

// export const addSticker = (ctx: Context): void => {
//   if (!ctx.message || !('sticker' in ctx.message)) {
//     ctx.reply('Повідомлення не містить стікера.');
//     return;
//   }

//   const sticker = ctx.message.sticker;

//   if (sticker.set_name !== STICKER_SET_NAME) {
//     ctx.reply('Цей стікер не належить до потрібного набору.');
//     return;
//   }

//   // Можна додавати обробку тут, наприклад, зберігати дані або виконати інші дії
//   ctx.reply('Стікера додано до групи!');
// };


import { Context } from 'telegraf';
import { STICKER_SET_NAME } from './config';

export const addSticker = (ctx: Context): void => {
  const message = ctx.message;
  if (!message || !('sticker' in message)) {
    ctx.reply('Повідомлення не містить стікера.');
    return;
  }
  const sticker = message.sticker;

  if (!sticker) return;

  // Перевірка на набір стікерів
  if (sticker.set_name !== STICKER_SET_NAME) {
    ctx.reply('Цей стікер не належить до потрібного набору.');
    return;
  }

  // Надсилаємо цей стікер назад у групу (або чат)
  ctx.replyWithSticker(sticker.file_id)  // надсилаємо стікер, використовуючи file_id
    .then(() => {
      ctx.reply('Стікера додано до групи!');
    })
    .catch((err) => {
      ctx.reply('Сталася помилка при додаванні стікера.');
      console.error(err);
    });
};
