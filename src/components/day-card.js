import {getTimeIso, createElement} from '../utils.js';
import {MONTHS} from '../const.js';

export const createDayCardTemplate = (dates) => {
  return dates
  .map((date, id) =>{
    const eventDate = new Date(date);
    const tripDate = `${MONTHS[eventDate.getMonth()]} ${eventDate.getDate()}`;
    return (
      `<li class="trip-days__item  day">
          <div class="day__info">
            <span class="day__counter">${id + 1}</span>
            <time class="day__date" datetime="${getTimeIso(eventDate)}"> ${tripDate}
            </time>
          </div>
        <ul class="trip-events__list" id="${getTimeIso(eventDate)}">
        </ul>
      </li>`
    );
  }).join(`\n`);
};

export default class SingleDate {
  constructor(dates) {
    this._dates = dates;
    this._element = null;
  }

  getTemplate() {
    return createDayCardTemplate(this._dates);
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
