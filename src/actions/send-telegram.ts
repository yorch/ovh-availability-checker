// https://github.com/yagop/node-telegram-bot-api/blob/master/src/telegram.js#L64-L84
import TelegramBot from 'node-telegram-bot-api';
import { telegram } from '../config';
import type { Action } from '../types';

// eslint-ignore-next-line node/prefer-global/process
// @ts-expect-error - Avoid error suggesting to use ['NTBA_FIX_319'] which conflicts with autoformat
process.env.NTBA_FIX_319 = 'false';

const { botToken, enable, chatId } = telegram;

export const sendTelegram: Action = async ({ content, logger }) => {
  if (!enable) {
    return;
  }

  if (!botToken || !chatId) {
    logger.warn('Telegram not configured properly, no message can be send');
    return;
  }

  try {
    const bot = new TelegramBot(botToken);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { message_id } = await bot.sendMessage(chatId, content);

    logger.info(`Telegram message sent: ${message_id}`);
  } catch (error) {
    logger.error('Could not send Telegram message', error);
  }
};
