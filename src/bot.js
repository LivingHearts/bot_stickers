import { Telegraf } from 'telegraf';
import { TOKEN } from './config.js';
import { checkAccess } from './accessControl.js';
import { addSticker } from './stickers.js';

// 🔹 Ваші стікери
const sticker1 = 'CAACAgIAAxkBAAMNaAugT-acoJpcDyKDGPtto95cY-kAAmhvAALyK2FIfTU2ruUXtTU2BA';
const sticker2 = 'CAACAgIAAxkBAAMPaAugbVKAwWcLFIjb0iex3FEJG1EAAjZwAALtYVhI5IQIlF4uPfQ2BA';
const sticker3 = 'CAACAgIAAxkBAAMRaAuhBvotJcthR4npAYZt8HzqT5EAAmB2AAK7LWBIREMkwBFqU182BA';

// 🔸 Ініціалізація бота
const bot = new Telegraf(TOKEN);

try {
  // 🔹 /start
bot.start((ctx) => {
  ctx.reply('Привіт! Ти можеш вибрати стікер для надсилання в меню.', {
  });
});

// 🔹 /stickers
bot.command('stickers', async (ctx) => {
  await ctx.reply('Оберіть стікер для надсилання:', {
    protect_content: true,
    reply_markup: {
      inline_keyboard: [
        [
          { text: '😭 Стікер 1', callback_data: 'sticker_1' },
          { text: '😭 Стікер 2', callback_data: 'sticker_2' },
          { text: '😭 Стікер 3', callback_data: 'sticker_3' },
        ]
      ]
    }
  });
});

// 🔹 Кнопки
bot.command('sticker1', async (ctx) => {
  // await ctx.answerCbQuery();
  if (!checkAccess(ctx)) return;
  await ctx.replyWithSticker(sticker1, { protect_content: true });
});

bot.command('sticker2', async (ctx) => {
  // await ctx.answerCbQuery();
  if (!checkAccess(ctx)) return;
  await ctx.replyWithSticker(sticker2, { protect_content: true });
});

bot.command('sticker3', async (ctx) => {
  // await ctx.answerCbQuery();
  if (!checkAccess(ctx)) return;
  await ctx.replyWithSticker(sticker3, { protect_content: true });
});

// 🔹 Обробка стікерів
bot.on('sticker', (ctx) => {
  if (!checkAccess(ctx)) return;
  addSticker(ctx);
});

// 🔹 Перевірка доступу
bot.use((ctx, next) => {
  if (!checkAccess(ctx)) {
    return;
  }
  return next();
});

// 🔹 Заборона пересланих повідомлень
bot.use(async (ctx, next) => {
  const message = ctx.message;
  const isForwarded =
    !!message?.forward_from ||
    !!message?.forward_from_chat ||
    !!message?.forward_sender_name;

  if (isForwarded) {
    await ctx.reply('🚫 Переслані повідомлення не приймаються.');
    return;
  }

  return next();
});

// 🔹 Запуск бота
bot.launch().then(() => {
  console.log('Бот запущено!');
});

// 🔹 Обробка зупинки
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
} catch (error) {
  ctx.reply("⚠️ Вибач, сталась помилка бота!", error);
  console.log("⚠️ Вибач, сталась помилка бота!", error);
}

