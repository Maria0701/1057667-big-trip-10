const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const getEventTime = (date) => {
  return `${castTimeFormat(date.getHours())}:${castTimeFormat(date.getMinutes())}`;
};

const getTimecomparisonFormat = (compared, remark) => {
  return (compared > 0 ? castTimeFormat(compared) + remark : ``);
};

export const getTimeIso = (time) => {
  return `${time.getFullYear()}-${castTimeFormat(time.getMonth())}-${castTimeFormat(time.getDate())}`;
};

export const getTimeDifference = (start, end) => {
  const differenceMinutes = ((end - start) / (1000 * 60)) % 60;
  const differenceHours = Math.floor(((end - start) / (1000 * 60 * 60)) % 24);
  const differenceDays = Math.floor(((end - start) / (1000 * 60 * 60 * 24)));

  const timeDifferenseShow = `${getTimecomparisonFormat(differenceDays, `D`)} ${getTimecomparisonFormat(differenceHours, `H`)} ${getTimecomparisonFormat(differenceMinutes, `M`)}`;
  return timeDifferenseShow;
};
