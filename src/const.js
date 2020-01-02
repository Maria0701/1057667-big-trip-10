import {SIGHTS_PHOTO, tripItemDescription, getPhotoArray} from './mocks/travel-points.js';

export const MONTHS = [
  `jan`,
  `feb`,
  `mar`,
  `Apr`,
  `May`,
  `Jun`,
  `Jul`,
  `Aug`,
  `Sep`,
  `Oct`,
  `Nov`,
  `Dec`
];

export const MILISECONDS = {
  MILISECONDS_IN_NINUTE: 1000 * 60,
  MILISECONDS_IN_HOURS: 1000 * 60 * 60,
  MILISECONDS_IN_DAYS: 1000 * 60 * 60 * 24
};

export const TRAVEL_TRANSPORT = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`
];

export const TRAVEL_ACTIVITY = [
  `check-in`,
  `sightseeing`,
  `restaurant`
];

export const TRAVEL_CITIES = [
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

export const TRIP_DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

export const TRAVEL_CITIES_WHOLE = [
  {
    travelCity: `Апатиты`,
    description: tripItemDescription(TRIP_DESCRIPTION),
    photos: getPhotoArray(SIGHTS_PHOTO),
  },
  {
    travelCity: `Арзамас`,
    description: tripItemDescription(TRIP_DESCRIPTION),
    photos: getPhotoArray(SIGHTS_PHOTO),
  },
  {
    travelCity: `Армавир`,
    description: tripItemDescription(TRIP_DESCRIPTION),
    photos: getPhotoArray(SIGHTS_PHOTO),
  },
  {
    travelCity: `Арсеньев`,
    description: tripItemDescription(TRIP_DESCRIPTION),
    photos: getPhotoArray(SIGHTS_PHOTO),
  },
  {
    travelCity: `Артем`,
    description: tripItemDescription(TRIP_DESCRIPTION),
    photos: getPhotoArray(SIGHTS_PHOTO),
  },
  {
    travelCity: `Архангельск`,
    description: tripItemDescription(TRIP_DESCRIPTION),
    photos: getPhotoArray(SIGHTS_PHOTO),
  },
  {
    travelCity: `Асбест`,
    description: tripItemDescription(TRIP_DESCRIPTION),
    photos: getPhotoArray(SIGHTS_PHOTO),
  },
  {
    travelCity: `Астрахань`,
    description: tripItemDescription(TRIP_DESCRIPTION),
    photos: getPhotoArray(SIGHTS_PHOTO),
  },
  {
    travelCity: `Ачинск`,
    description: tripItemDescription(TRIP_DESCRIPTION),
    photos: getPhotoArray(SIGHTS_PHOTO),
  },
  {
    travelCity: `Балаково`,
    description: tripItemDescription(TRIP_DESCRIPTION),
    photos: getPhotoArray(SIGHTS_PHOTO),
  },
];

export const TRAVEL_ADDONS = [
  {
    name: `Add luggage`,
    remark: `luggage`,
    price: `10`,
    currency: `€`
  },
  {
    name: `Switch to comfort class`,
    remark: `comfort`,
    price: `150`,
    currency: `€`
  },
  {
    name: `Add meal`,
    remark: `meal`,
    price: `2`,
    currency: `€`
  },
  {
    name: `Choose seats`,
    remark: `seats`,
    price: `9`,
    currency: `€`
  }
];

export const FILTER_NAMES = [
  `everything`,
  `future`,
  `past`,
];

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};
