import AbstractComponent from './abstract-component.js';
import moment from 'moment';

const createArrayPrices = (array) => {
  return array.map((it) => it.price);
};

const addonsPrices = (data) => data.reduce((total, amount) => {
  amount.travelAddons.forEach((price) => {
    total.push(price);
  });
  return total;
}, []);

const getDatePeriod = (array) => {
  const firstDate = moment(array[0].startDate).format(`MMM DD`);
  const lastDate = (moment(array[0].startDate).isSame(array[array.length - 1].endDate, `month`) ? moment(array[array.length - 1].endDate).format(`DD`) : moment(array[array.length - 1].endDate).format(`MMM DD`)
  );
  return array.length === 0 ? `` : `${firstDate} - ${lastDate}`;
};

const pointsArrayDated = (points) => points.slice().sort((a, b) => a.startDate - b.startDate);

const createTripInfo = (points) => {
  let totalPrice;
  let datePeriod;
  let cities;
  if (points.length === 0) {
    totalPrice = 0;
    datePeriod = ``;
    cities = ``;
  } else {
    const cityArray = pointsArrayDated(points);
    cities = cityArray.length !== 0 ? `${cityArray[0].destination.name}&mdash; ... &mdash; ${cityArray[cityArray.length - 1].destination.name}` : ``;

    datePeriod = getDatePeriod(cityArray);
    const priceArray = [...createArrayPrices(points), ...createArrayPrices(addonsPrices(points))];
    totalPrice = priceArray.reduce((sum, current) =>
      sum + current);
  }

  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
          <h1 class="trip-info__title">${cities}</h1>
          <p class="trip-info__dates">${datePeriod}</p>
      </div>
      <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
      </section>
      `
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfo(this._points);
  }
}
