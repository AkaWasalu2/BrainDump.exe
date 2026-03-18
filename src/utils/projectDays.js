export const projectDays = (totalHours) => {
  if (totalHours <= 0) return 0;
  let rem = totalHours, days = 0;
  let date = new Date();
  while (rem > 0) {
    const dow = date.getDay();
    rem -= (dow === 0 || dow === 6) ? 5 : 3;
    days++;
    date.setDate(date.getDate() + 1);
  }
  return days;
};