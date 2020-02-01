export default class Offer {
  constructor(data) {
    this.type = data[`type`];
    this.offers = data[`offers`];
  }

  static parseItem(data) {
    return new Offer(data);
  }

  static parseItems(data) {
    return data.map(Offer.parseItem);
  }
}
