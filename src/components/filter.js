import AbstractComponent from './abstract-component.js';

const createFilterItem = (item, isChecked) => {
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${item.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${item.name}" ${isChecked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${item.name}">${item.name}</label>
    </div>`
  );
};

const createFilterTemplate = (filters) => {
  const filterMarkup = filters.map((it) => createFilterItem(it, it.checked)).join(`\n`);
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterType = evt.target.value;
      handler(filterType);
    });
  }
}
