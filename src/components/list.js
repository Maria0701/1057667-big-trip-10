import AbstractComponent from './abstract-component.js';

const createListTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class List extends AbstractComponent {
  getTemplate() {
    return createListTemplate();
  }
}
