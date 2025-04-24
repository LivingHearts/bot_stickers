const { STICKER_SET_NAME } = require('./config');

const addSticker = (ctx) => {
  const message = ctx.message;

  if (!message || !('sticker' in message)) {
    ctx.reply('Повідомлення не містить стікера.');
    return;
  }

  const sticker = message.sticker;
  if (!sticker) return;

  // Перевірка, чи стікер з потрібного набору
  if (sticker.set_name !== STICKER_SET_NAME) {
    ctx.reply('Цей стікер не належить до потрібного набору.');
    return;
  }

  // Надсилаємо стікер назад
  ctx.replyWithSticker(sticker.file_id)
    .then(() => {
      ctx.reply('Стікера додано до групи!');
    })
    .catch((err) => {
      ctx.reply('Сталася помилка при додаванні стікера.');
      console.error(err);
    });
};

module.exports = {
  addSticker
};
