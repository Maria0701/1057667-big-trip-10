import {getEventTime, getTimeDifference, getTimeIso} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';
import {TRAVEL_TRANSPORT, Placeholder, CURRENCY} from '../const.js';

export const createArrayStartDates = (array) => {
  return array.map((it) => it.startDate);
};

export const createArrayEndDates = (array) => {
  return array.map((it) => it.endDate);
};

export const createArrayCities = (array) => {
  return array.map((it) => it.destination.name);
};


const generateTravelAddonMarkup = (addons) => {
  return addons
  .slice(0, 3)
  .map((addon) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${addon.title}</span>
        &plus;
        ${CURRENCY}&nbsp;<span class="event__offer-price">${addon.price}</span>
       </li>`
    );
  })
    .join(`\n`);
};

const createEventItemTemplate = (travelEvent) => {
  const {startDate, endDate, destination, travelPoints, price, travelAddons} = travelEvent;
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${travelPoints}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${travelPoints}  ${TRAVEL_TRANSPORT.includes(travelPoints) ? Placeholder.TRANSPORT : Placeholder.ACTION} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${getTimeIso(startDate)}T${getEventTime(startDate)}">${getEventTime(startDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="${getTimeIso(endDate)}T${getEventTime(endDate)}">${getEventTime(endDate)}</time>
          </p>
          <p class="event__duration">${getTimeDifference(startDate, endDate)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${generateTravelAddonMarkup(travelAddons)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createEventItemTemplate(this._event);
  }

  setOnEditButtonEvent(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
     .addEventListener(`click`, handler);
  }
}
