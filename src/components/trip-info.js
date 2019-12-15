import {MONTHS} from '../const.js';
import AbstractComponent from './abstract-component.js';

const createTripInfo = (cityArray, datesArray) => {
  const getDatePeriod = () => {
    const newArray = datesArray.slice().sort((a, b) => a - b);
    const firstDate = MONTHS[newArray[0].getMonth()] + ` ` + newArray[0].getDate();
    const lastDate = (
      newArray[0].getMonth() === newArray[newArray.length - 1].getMonth() ? newArray[newArray.length - 1].getDate() : MONTHS[newArray[length - 1].getMonth()] + ` ` + newArray[length - 1].getDate()
    );
    return `${firstDate} - ${lastDate}`;
  };

  return (
    `<div class="trip-info__main">
          <h1 class="trip-info__title">${cityArray[0]}&mdash; ... &mdash; ${cityArray[cityArray.length - 1]}</h1>
          <p class="trip-info__dates">${getDatePeriod()}</p>
      </div>
      `
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(cities, dates) {
    super();
    this._cities = cities;
    this._dates = dates;
  }

  getTemplate() {
    return createTripInfo(this._cities, this._dates);
  }
}
