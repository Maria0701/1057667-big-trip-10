import AbstractComponent from './abstract-component.js';

const generateBoardMarkup = () => {
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>

      <!-- Сортировка -->

      <!-- Контент -->

    </section>`
  );
};

export default class BoardComponent extends AbstractComponent {
  getTemplate() {
    return generateBoardMarkup();
  }
}
