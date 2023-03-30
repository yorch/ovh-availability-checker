export const cleanupText = (txt: string) =>
  txt
    .replace(/\r\n|\r|\n/g, '')
    .replace(/ {2}/g, '')
    .replace(
      /[\u00A0\u1680​\u180E\u2000-\u2009\u200A\u200B\u202F\u205F\u3000]/g,
      ' '
    )
    // .replace(/U+00a0/, ' ');
    .trim();
