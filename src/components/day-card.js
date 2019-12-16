import {getTimeIso} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';
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

export default class DateComponent extends AbstractComponent {
  constructor(date, index) {
    super();
    this._date = date;
    this._index = index;
  }

  getTemplate() {
    return createDayCardTemplate(this._date, this._index);
  }
}
