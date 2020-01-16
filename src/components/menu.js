import AbstractComponent from './abstract-component.js';

export const MenuItems = {
  TABLE: `menu-table`,
  STATS: `menu-statistics`,
  ADD: `menu-new`,
};

const ACTIVE_ITEM = `trip-tabs__btn--active`;

const createMenuTemplate = () => {
  return (
    `<div class="trip-main">
      <section class="trip-main__trip-info  trip-info">
        <!-- Маршрут -->
      </section>

      <div class="trip-main__trip-controls  trip-controls">
        <h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs  trip-tabs">
    <a href="#" class="trip-tabs__btn" id="menu-table">Table</a>
    <a href="#" class="trip-tabs__btn" id="menu-statistics">Stats</a>
    </nav>
    <h2 class="visually-hidden">Filter events</h2>
    <!-- Фильтры -->
  </div>

  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" id="menu-new">New event</button>
</div>`
  );
};

export default class Menu extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate();
  }

  setActiveItem(menuItem) {
    const item = this.getElement().querySelector(`#${menuItem}`);
    if (item) {
      item.classList.add(ACTIVE_ITEM);
    }
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `A` || evt.target.tagName === `BUTTON`) {
        const menuItem = evt.target.id;
        handler(menuItem);
      } else {
        return;
      }
    });
  }

}
