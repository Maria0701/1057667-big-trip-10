import {TRAVEL_POINTS} from '../const.js';

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

const TRAVEL_ADDONS = [
  `Add luggage +10 €`,
  `Switch to comfort class +150 €`,
  `Add meal +2 €`,
  `Choose seats +9 €`
];

const generateTravelAddons = (array) => {
  return array.map((it) => {
    const singleAddon = it.split(` `);
    return {
      price: it.split(` `)[singleAddon.length - 2].replace(`+`, ``),
      currency: it.split(` `)[singleAddon.length - 1],
      name: it.split(` `, singleAddon.length - 2).join(` `)
    };
  });
};

const SIGHTS_PHOTO = `http://picsum.photos/300/150?r=${Math.random()}`;

const TRIP_DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const getRandomItegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomItegerNumber(0, array.length);
  return array[randomIndex];
};

const getRandomDate = () => {
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

const tripItemDescription = (description) => {
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
    startDate,
    endDate,
    travelCity: getRandomArrayItem(TRAVEL_CITIES),
    travelPoints: getRandomArrayItem(TRAVEL_POINTS),
    description: tripItemDescription(TRIP_DESCRIPTION),
    travelPrice: getRandomItegerNumber(10, 1000),
    travelAddons: travelAddons(generateTravelAddons(TRAVEL_ADDONS)),
    photos: SIGHTS_PHOTO
  };
};

export const generateTravelItems = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTravelItem);
};
