import {createElement} from '../utils.js';

const createListTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class List {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(createListTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
