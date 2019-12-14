import {createElement} from '../utils.js';

const getPriceTotalTemplate = (priceArray) => {
  const totalPrice = priceArray.reduce((sum, current) =>
    sum + current);
  return (
    `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
  </p>`);
};

export default class TripCost {
  constructor(cost) {
    this._cost = cost;
    this._element = null;
  }

  getTemplate() {
    return getPriceTotalTemplate(this._cost);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
