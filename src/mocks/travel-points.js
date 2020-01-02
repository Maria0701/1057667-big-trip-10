import {TRAVEL_TRANSPORT, TRAVEL_ACTIVITY, TRIP_DESCRIPTION, TRAVEL_ADDONS} from '../const.js';

const TRAVEL_CITIES = [
  `Апатиты`,
  `Арзамас`,
  `Армавир`,
  `Арсеньев`,
  `Артем`,
  `Архангельск`,
  `Асбест`,
  `Астрахань`,
  `Ачинск`,
  `Балаково`
];


export const SIGHTS_PHOTO = `http://picsum.photos/300/150?r=${Math.random()}`;

export const getRandomItegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

export const getPhotoArray = (photo) => {
  const newArray = [];
  for (let i = 0; i < getRandomItegerNumber(1, 10); i++) {
    newArray.push(photo);
  }
  return newArray;
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomItegerNumber(0, array.length);
  return array[randomIndex];
};

export const getRandomDate = () => {
  const travelDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomItegerNumber(0, 168);
  travelDate.setHours(travelDate.getHours() + diffValue);
  return travelDate;
};

export const getRandomEndTime = (date) => {
  let randomEndDate = new Date(date);
  const randomTimeHours = (date.getHours() + getRandomItegerNumber(0, 12)) % 24;
  const randomTimeMinutes = (date.getMinutes() + getRandomItegerNumber(0, 60)) % 60;
  if (randomTimeMinutes < date.getMinutes()) {
    randomEndDate.setHours(date.getHours() + 1);
  }
  randomEndDate.setMinutes(randomTimeMinutes);
  if (randomTimeHours < date.getHours()) {
    randomEndDate.setDate(date.getDate() + 1);
  }
  randomEndDate.setHours(randomTimeHours);

  return randomEndDate;
};

export const tripItemDescription = (description) => {
  return description
    .split(`.`)
    .filter(() => Math.random() > 0.5)
    .slice(0, 3);
};

const travelAddons = (addons) => {
  return addons
  .filter(() => Math.random() > 0.5)
  .slice(0, 2);
};

const generateTravelItem = () => {
  const startDate = getRandomDate();
  const endDate = getRandomEndTime(startDate);
  return {
    id: String(new Date() + Math.random),
    startDate,
    endDate,
    destination: getRandomArrayItem(TRAVEL_CITIES),
    travelPoints: getRandomArrayItem([...TRAVEL_TRANSPORT, ...TRAVEL_ACTIVITY]),
    travelPrice: getRandomItegerNumber(10, 1000),
    travelAddons: travelAddons(TRAVEL_ADDONS),
    isFavorite: Math.random() > 0.5,
  };
};

export const generateTravelItems = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTravelItem);
};
