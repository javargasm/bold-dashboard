export function daysToMilliseconds(days: number) {
  return days * 24 * 60 * 60 * 1000;
}

export const expiresCookie = () => {
  const expireDays = 1;
  return new Date(new Date().getTime() + daysToMilliseconds(expireDays));
};
