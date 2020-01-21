export default class Point {
  constructor(data) {
    this.id = data [`id`];
    this.travelPrice = data[`base_price`];
    this.startDate = new Date(data[`date_from`]);
    this.endDate = new Date(data[`date_to`]);
    this.destination = data[`destination`];
    this.travelPoints = data[`type`];
    this.travelAddons = data[`offers`];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    return {
      'id': this.id,
      'base_price': this.travelPrice,
      'date_from': this.startDate.toISOString(),
      'date_to': this.endDate.toISOString(),
      'destination': this.destination,
      'type': this.travelPoints,
      'offers': Array.from(this.travelAddons),
      'is_favorite': this.isFavorite
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRaw());
  }
}
