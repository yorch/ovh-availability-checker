/**
 * This function is helpful to filter out elements from an array (like when using `.map().filter(exists).map()`)
 * and have TS to return the correct type to the output of the filter
 *
 * More info and obtained from https://dev.to/icyjoseph/filtering-in-typescript-2mbc
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function exists<T>(value: T | null | undefined): value is T {
  return value === (value ?? !value);
}
