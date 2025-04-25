import { ALLOWED_GROUPS, ALLOWED_USERS } from './config.js';

const isUserAllowed = (userId) => {
  return ALLOWED_USERS.includes(userId);
};

const isGroupAllowed = (groupId) => {
  return ALLOWED_GROUPS.includes(groupId);
};

export const checkAccess = (ctx) => {
  const userId = ctx.from?.id;
  const chatId = ctx.chat?.id;
  const chatType = ctx.chat?.type;

  const message = ctx.message;
  const isForwarded = !!message?.forward_from || !!message?.forward_from_chat;

  const forwardedUserId = message?.forward_from?.id;
  const forwardedChatId = message?.forward_from_chat?.id;

  if (!userId || !chatId || !chatType) {
    ctx.reply?.('❗ Не вдалося отримати інформацію про користувача або чат.');
    return false;
  }

  // 🟡 Приватні чати
  if (chatType === 'private') {
    if (!isUserAllowed(userId)) {
      ctx.reply?.('🚫 У вас немає доступу до цього бота.');
      return false;
    }

    // Якщо це переслане повідомлення — перевіряємо джерело
    if (isForwarded) {
      const allowedForward =
        (forwardedUserId && isUserAllowed(forwardedUserId)) ||
        (forwardedChatId && isUserAllowed(forwardedChatId));

      if (!allowedForward) {
        ctx.reply?.('⚠️ Ви можете пересилати повідомлення лише від користувачів, які мають доступ до бота.');
        return false;
      }
    }

    return true; // ✅ Дозволено
  }

  // ✅ Групи та супергрупи
  if (chatType === 'group') {
    if (!isGroupAllowed(chatId)) {
      ctx.reply?.('🚫 Ця група не має доступу до бота.');
      return false;
    }

    if (!isUserAllowed(userId)) {
      ctx.reply?.('🚫 Ви не маєте доступу до цього бота.');
      return false;
    }

    return true;
  }

  ctx.reply?.('❌ Бот не підтримує цей тип чату.');
  return false;
};

export default {
  isUserAllowed,
  isGroupAllowed,
  checkAccess
};
