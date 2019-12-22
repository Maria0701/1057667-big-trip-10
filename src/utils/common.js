import {MILISECONDS} from '../const.js';
import moment from 'moment';


const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const getEventTime = (date) => {
  return moment(date).format(`h:mm`);
};

const getTimecomparisonFormat = (compared, remark) => {
  return (compared > 0 ? castTimeFormat(compared) + remark : ``);
};

export const getTimeIso = (time) => {
  return moment(time).format(`YYYY-MM-DD`);
};

export const getTimeIsoFull = (time) => {
  return moment(time).format();
};

export const getDateFormatEditor = (date) => {
  return moment(date).format(`DD/MM/YYYY h:mm`);
};

export const getTimeDifference = (start, end) => {
  const differenceMinutes = Math.floor(((end - start) / (MILISECONDS.MILISECONDS_IN_NINUTE)) % 60);
  const differenceHours = Math.floor(((end - start) / (MILISECONDS.MILISECONDS_IN_HOURS)) % 24);
  const differenceDays = Math.floor(((end - start) / (MILISECONDS.MILISECONDS_IN_DAYS)));

  const timeDifferenseShow = `${getTimecomparisonFormat(differenceDays, `D`)} ${differenceDays > 0 && differenceHours === 0 ? `00H` : getTimecomparisonFormat(differenceHours, `H`)} ${ differenceMinutes !== 0 ? getTimecomparisonFormat(differenceMinutes, `M`) : `00M`}`;
  return timeDifferenseShow;
};

export const getDateWithoutMinutes = (date) => {
  let clearDate = new Date(date);
  clearDate = clearDate.setHours(0, 0, 0, 0);
  return clearDate;
};
