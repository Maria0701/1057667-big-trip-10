export default class Point {
  constructor(data) {
    this.id = data [`id`];
    this.price = data[`base_price`];
    this.startDate = new Date(data[`date_from`]);
    this.endDate = new Date(data[`date_to`]);
    this.destination = data[`destination`];
    this.travelPoints = data[`type`];
    this.travelAddons = data[`offers`];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRaw() {
    return {
      'base_price': Number(this.price),
      'date_from': this.startDate.toISOString(),
      'date_to': this.endDate.toISOString(),
      'destination': this.destination,
      'id': this.id,
      'is_favorite': this.isFavorite,
      'offers': Array.from(this.travelAddons),
      'type': this.travelPoints,
    };
  }

  static parseItem(data) {
    return new Point(data);
  }

  static parseItems(data) {
    return data.map(Point.parseItem);
  }

  static clone(data) {
    return new Point(data.toRaw());
  }
}
