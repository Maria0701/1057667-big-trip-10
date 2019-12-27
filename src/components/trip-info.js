import AbstractComponent from './abstract-component.js';
import moment from 'moment';

const createTripInfo = (cityArray, datesStartArray, datesEndArray) => {
  const getDatePeriod = () => {
    const dateStartArray = datesStartArray.slice().sort((a, b) => a - b);
    const dateEndArray = datesEndArray.slice().sort((a, b) => a - b);
    const firstDate = moment(dateStartArray[0]).format(`MMM DD`);
    const lastDate = (moment(dateStartArray[0]).isSame(dateEndArray[dateEndArray.length - 1], `month`) ? moment(dateEndArray[dateEndArray.length - 1]).format(`DD`) : moment(dateEndArray[dateEndArray.length - 1]).format(`MMM DD`)
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
  constructor(cities, datesStart, datesEnd) {
    super();
    this._cities = cities;
    this._datesStart = datesStart;
    this._datesEnd = datesEnd;
  }

  getTemplate() {
    return createTripInfo(this._cities, this._datesStart, this._datesEnd);
  }
}
