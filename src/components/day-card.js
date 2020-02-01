import {getTimeIso, getTimeIsoFull} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';
import moment from 'moment';

const createDayCardTemplate = (date, order) => {
  const eventDate = new Date(date);
  const tripDate = moment(date).format(`MMM DD`);
  if (!date && !order) {
    return (
      `<li class="trip-days__item  day">
          <div class="day__info">
          </div>
        <ul class="trip-events__list">
        </ul>
    </li>`);
  }
  return (
    `<li class="trip-days__item  day">
          <div class="day__info">
            <span class="day__counter">${order + 1}</span>
            <time class="day__date" datetime="${getTimeIsoFull(eventDate)}"> ${tripDate}
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
