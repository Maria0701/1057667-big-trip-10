import AbstractComponent from './abstract-component.js';

const createArrayPrices = (array) => {
  return array._points.map((it) => it.travelPrice);
};

const getPriceTotalTemplate = (pointsArray) => {
  const priceArray = createArrayPrices(pointsArray);
  let totalPrice;
  if (pointsArray.length === 0) {
    totalPrice = 0;
  } else {
    totalPrice = priceArray.reduce((sum, current) =>
      sum + current);
  }
  return (
    `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
  </p>`);
};

export default class TripCost extends AbstractComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return getPriceTotalTemplate(this._points);
  }
}
