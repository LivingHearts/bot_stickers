import { Telegraf, Markup } from 'telegraf';
import { Context } from 'telegraf';
import { TOKEN } from './config';
import { checkAccess } from './accessControl';
import { addSticker } from './stickers';

// Ваші стікери (потрібно замінити на актуальні file_id ваших стікерів)
const sticker1 = "CAACAgIAAxkBAAMCaAkxe37R0wfzjzS5HN6teIykMWQAAhJ2AAK0rDBIZx7yQpFv-5k2BA"; // Замініть на file_id вашого стікера
const sticker2 = 'CAACAgIAAxkBAAMCaAkxe37R0wfzjzS5HN6teIykMWQAAhJ2AAK0rDBIZx7yQpFv-5k2BA' // Замініть на file_id вашого стікера
const sticker3 = 'CAACAgIAAxkBAAMCaAkxe37R0wfzjzS5HN6teIykMWQAAhJ2AAK0rDBIZx7yQpFv-5k2BA' // Замініть на file_id вашого стікера

// Створення екземпляру бота
const bot = new Telegraf(TOKEN);

// Команда /start
bot.start((ctx: Context) => {
    ctx.reply(
      'Привіт! Вибери стікер, натиснувши одну з кнопок нижче:',
      {
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
      }
    );
  });
  
  // 🔹 /help
  bot.help((ctx: Context) => {
    ctx.reply('Для додавання стікерів в групу надішліть їх тут!');
  });
  
  // 🔹 /stickers — нова команда з усіма кнопками
  bot.command('stickers', async (ctx: Context) => {
    await ctx.reply(
      'Оберіть стікер для надсилання:',
      {
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
      }
    );
  });

// Обробник натискання на кнопки
bot.action('sticker_1', async (ctx: Context) => {
  await ctx.answerCbQuery(); // Закриває кнопку після натискання
  if (!checkAccess(ctx)) return;
  await ctx.replyWithSticker(sticker1, {protect_content: true}); // Відправка першого стікера
});

bot.action('sticker_2', async (ctx: Context) => {
  await ctx.answerCbQuery(); // Закриває кнопку після натискання
  if (!checkAccess(ctx)) return;
  await ctx.replyWithSticker(sticker2, {protect_content: true}); // Відправка другого стікера
});

bot.action('sticker_3', async (ctx: Context) => {
  await ctx.answerCbQuery(); // Закриває кнопку після натискання
  if (!checkAccess(ctx)) return;
  await ctx.replyWithSticker(sticker3, {protect_content: true}); // Відправка третього стікера
});

// Обробник для стікерів
bot.on('sticker', (ctx: Context) => {
    if (!checkAccess(ctx)) return;
    addSticker(ctx);
});

bot.use((ctx, next) => {
    if (!checkAccess(ctx)) {
      // Доступ або пересилання вже перевірено в checkAccess
      return;
    }
    return next(); // якщо все ок, продовжуємо до обробників
  });

  bot.use(async (ctx, next) => {
    const message = ctx.message as any;
  
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
  

// Запуск бота
bot.launch().then(() => {
  console.log('Бот запущено!');
});

// Для підтримки бота після перезапуску
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
