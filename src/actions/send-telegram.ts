// https://github.com/yagop/node-telegram-bot-api/blob/master/src/telegram.js#L64-L84
process.env.NTBA_FIX_319 = 'false';

import TelegramBot from 'node-telegram-bot-api';
import { telegram } from '../config';
import { Action } from '../types';

const { botToken, enable, chatId } = telegram;

export const sendTelegram: Action = ({ content, logger }) => {
  if (!enable) {
    return;
  }

  if (!botToken || !chatId) {
    logger.warn('Telegram not configured properly, no message can be send');
    return;
  }

  try {
    const bot = new TelegramBot(botToken);
    bot.sendMessage(chatId, content);
  } catch (err) {
    logger.error('Could not send Telegram', err);
  }
};
