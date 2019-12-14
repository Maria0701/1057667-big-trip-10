import {MILISECONDS} from './const.js';

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

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

export const getDateFormatEditor = (date) => {
  return `${castTimeFormat(date.getDate())}/${castTimeFormat(date.getMonth())}/${date.getFullYear()} ${castTimeFormat(date.getHours()) }:${castTimeFormat(date.getMinutes())}`;
};

export const getTimeDifference = (start, end) => {
  const differenceMinutes = Math.floor(((end - start) / (MILISECONDS.MILISECONDS_IN_NINUTE)) % 60);
  const differenceHours = Math.floor(((end - start) / (MILISECONDS.MILISECONDS_IN_HOURS)) % 24);
  const differenceDays = Math.floor(((end - start) / (MILISECONDS.MILISECONDS_IN_DAYS)));

  const timeDifferenseShow = `${getTimecomparisonFormat(differenceDays, `D`)} ${differenceDays > 0 && differenceHours === 0 ? `00H` : getTimecomparisonFormat(differenceHours, `H`)} ${ differenceMinutes !== 0 ? getTimecomparisonFormat(differenceMinutes, `M`) : `00M`}`;
  return timeDifferenseShow;
};
