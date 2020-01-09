import {FilterType} from '../const.js';

export const getPastPoints = (points, date) => {
  return points.filter((point) => point.endDate < date);
};

export const getFuturePoints = (points, date) => {
  return points.filter((point) => point.startDate > date);
};

export const getPointsByFilter = (points, filterType) => {
  const currentDate = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return getFuturePoints(points, currentDate);
    case FilterType.PAST:
      return getPastPoints(points, currentDate);
  }

  return points;
};
