export const cleanupText = (txt: string) =>
  txt
    .replaceAll(/\r\n|\r|\n/g, '')
    .replaceAll(/ {2}/g, '')
    .replaceAll(
      // eslint-disable-next-line no-irregular-whitespace
      /[\u00A0\u1680​\u180E\u2000-\u2009\u200A\u200B\u202F\u205F\u3000]/g,
      ' '
    )
    // .replace(/U+00a0/, ' ');
    .trim();
