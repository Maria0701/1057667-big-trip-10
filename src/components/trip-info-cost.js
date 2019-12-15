import AbstractComponent from './abstract-component.js';

const getPriceTotalTemplate = (priceArray) => {
  let totalPrice;
  if (!priceArray) {
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
  constructor(cost) {
    super();
    this._cost = cost;
  }

  getTemplate() {
    return getPriceTotalTemplate(this._cost);
  }
}
