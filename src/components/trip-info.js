import AbstractComponent from './abstract-component.js';
import moment from 'moment';

const createArrayPrices = (array) => {
  return array.map((it) => it.travelPrice);
};

const pointsArrayDated = (points) => points.slice().sort((a, b) => a.startDate - b.startDate);

const createTripInfo = (points) => {
  const cityArray = pointsArrayDated(points);
  const cities = cityArray.length !== 0 ? `${cityArray[0].destination.name}&mdash; ... &mdash; ${cityArray[cityArray.length - 1].destination.name}` : ``;

  const getDatePeriod = () => {
    const firstDate = moment(cityArray[0].startDate).format(`MMM DD`);
    console.log(firstDate);
    const lastDate = (moment(cityArray[0].startDate).isSame(cityArray[cityArray.length - 1].endDate, `month`) ? moment(cityArray[cityArray.length - 1].endDate).format(`DD`) : moment(cityArray[cityArray.length - 1].endDate).format(`MMM DD`)
    );
    return points.length === 0 ? `` : `${firstDate} - ${lastDate}`;
  };

  const priceArray = createArrayPrices(points);
  let totalPrice;
  if (cityArray.length === 0) {
    totalPrice = 0;
  } else {
    totalPrice = priceArray.reduce((sum, current) =>
      sum + current);
  }

  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
          <h1 class="trip-info__title">${cities}</h1>
          <p class="trip-info__dates">${getDatePeriod()}</p>
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
