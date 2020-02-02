import {SortType} from '../const.js';

export const getPointsBySorting = (points, sortType) => {
  let sortedEvents = [];
  switch (sortType) {
    case SortType.TIME_DOWN:
      sortedEvents = points.slice()
          .sort((a, b) => ((b.endDate - b.startDate) - (a.endDate - a.startDate)));
      break;
    case SortType.PRICE_DOWN:
      sortedEvents = points.slice()
          .sort((a, b) => b.price - a.price);
      break;
    case SortType.DEFAULT_EVENT:
      sortedEvents = points.slice()
          .sort((a, b) => a.startDate - b.startDate);
      break;
  }
  return sortedEvents;
};
