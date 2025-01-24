export function formatNumber(num: number, fix = 0): string {
  const result = num
    .toFixed(fix)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return result;
}

export function formatDate(date: Date) {
  let newDate = new Date(date);
  const weekday = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ][newDate.getDay()];

  return `${newDate.getFullYear()}-${
    newDate.getMonth() + 1
  }-${newDate.getDate()} ${weekday}, ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
}
