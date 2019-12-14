import {getTimeIso, createElement} from '../utils.js';
import {MONTHS} from '../const.js';

const createDayCardTemplate = (date, order) => {
  const eventDate = new Date(date);
  const tripDate = `${MONTHS[eventDate.getMonth()]} ${eventDate.getDate()}`;
  return (
    `<li class="trip-days__item  day">
          <div class="day__info">
            <span class="day__counter">${order + 1}</span>
            <time class="day__date" datetime="${getTimeIso(eventDate)}"> ${tripDate}
            </time>
          </div>
        <ul class="trip-events__list" id="${getTimeIso(eventDate)}">
        </ul>
      </li>`
  );
};

export default class DateComponent {
  constructor(date, index) {
    this._date = date;
    this._index = index;
    this._element = null;
  }

  getTemplate() {
    return createDayCardTemplate(this._date, this._index);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
