export default class Destination {
  constructor(data) {
    this.description = data[`description`];
    this.name = data[`name`];
    this.pictures = data[`pictures`];
  }

  static parseItem(data) {
    return new Destination(data);
  }

  static parseItems(data) {
    return data.map(Destination.parseItem);
  }
}
