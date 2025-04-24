"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAccess = exports.isGroupAllowed = exports.isUserAllowed = void 0;
const config_1 = require("./config");
const isUserAllowed = (userId) => {
    return config_1.ALLOWED_USERS.includes(userId);
};
exports.isUserAllowed = isUserAllowed;
const isGroupAllowed = (groupId) => {
    return config_1.ALLOWED_GROUPS.includes(groupId);
};
exports.isGroupAllowed = isGroupAllowed;
const checkAccess = (ctx) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const userId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id;
    const chatId = (_b = ctx.chat) === null || _b === void 0 ? void 0 : _b.id;
    const chatType = (_c = ctx.chat) === null || _c === void 0 ? void 0 : _c.type;
    const message = ctx.message;
    const isForwarded = !!(message === null || message === void 0 ? void 0 : message.forward_from) || !!(message === null || message === void 0 ? void 0 : message.forward_from_chat);
    const forwardedUserId = (_d = message === null || message === void 0 ? void 0 : message.forward_from) === null || _d === void 0 ? void 0 : _d.id;
    const forwardedChatId = (_e = message === null || message === void 0 ? void 0 : message.forward_from_chat) === null || _e === void 0 ? void 0 : _e.id;
    if (!userId || !chatId || !chatType) {
        (_f = ctx.reply) === null || _f === void 0 ? void 0 : _f.call(ctx, '❗ Не вдалося отримати інформацію про користувача або чат.');
        return false;
    }
    // 🟡 Приватні чати
    if (chatType === 'private') {
        if (!(0, exports.isUserAllowed)(userId)) {
            (_g = ctx.reply) === null || _g === void 0 ? void 0 : _g.call(ctx, '🚫 У вас немає доступу до цього бота.');
            return false;
        }
        // Якщо це переслане повідомлення — перевіряємо джерело
        if (isForwarded) {
            const allowedForward = (forwardedUserId && (0, exports.isUserAllowed)(forwardedUserId)) ||
                (forwardedChatId && (0, exports.isUserAllowed)(forwardedChatId));
            if (!allowedForward) {
                (_h = ctx.reply) === null || _h === void 0 ? void 0 : _h.call(ctx, '⚠️ Ви можете пересилати повідомлення лише від користувачів, які мають доступ до бота.');
                return false;
            }
        }
        return true; // ✅ Дозволено
    }
    // ✅ Групи та супергрупи
    if (chatType === 'group' || chatType === 'supergroup') {
        if (!(0, exports.isGroupAllowed)(chatId)) {
            (_j = ctx.reply) === null || _j === void 0 ? void 0 : _j.call(ctx, '🚫 Ця група не має доступу до бота.');
            return false;
        }
        if (!(0, exports.isUserAllowed)(userId)) {
            (_k = ctx.reply) === null || _k === void 0 ? void 0 : _k.call(ctx, '🚫 Ви не маєте доступу до цього бота.');
            return false;
        }
        return true;
    }
    (_l = ctx.reply) === null || _l === void 0 ? void 0 : _l.call(ctx, '❌ Бот не підтримує цей тип чату.');
    return false;
};
exports.checkAccess = checkAccess;
