import AbstractComponent from './abstract-component.js';
import {DEFAULT_TARGET_TAG} from '../const.js';
const SORT_PREFIX = `sort-`;

const getSortingValue = (name) => {
  return name.substring(SORT_PREFIX.length);
};

const createSortingItem = (item, isChecked) => {
  return (
    `<div class="trip-sort__item  trip-sort__item--${item.name}">
      <input id="sort-${item.name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"  value="sort-${item.name}" ${isChecked ? `checked` : ``}>
      <label class="trip-sort__btn" data-sort-type="${item.name}" for="sort-${item.name}">
        ${item.name}
        <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
          <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
        </svg>
      </label>
    </div>`
  );
};

const createSortingTemplate = (sortingButtons) => {
  const sortingMarkup = sortingButtons.map((it) => createSortingItem(it, it.checked)).join(`\n`);
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortingMarkup}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sorting extends AbstractComponent {
  constructor(sortingButtons) {
    super();
    this._sortingButtons = sortingButtons;
  }

  getTemplate() {
    return createSortingTemplate(this._sortingButtons);
  }

  onSortTypeChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== DEFAULT_TARGET_TAG) {
        return;
      }
      const sortType = getSortingValue(evt.target.value);
      if (this._currentSortType === sortType) {
        return;
      }

      handler(sortType);
    });
  }
}
