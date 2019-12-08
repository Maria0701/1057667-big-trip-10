import {getEventTime} from '../utils.js';
import {getTimeDifference} from '../utils.js';
import {getTimeIso} from '../utils.js';

export const createArrayDates = (array) => {
  const dates = [];
  array.forEach((it) => dates.push(it.startDate));
  return dates;
};

export const createArrayCities = (array) => {
  const cities = [];
  array.forEach((it) => cities.push(it.travelCity));
  return cities;
};

const generateTravelAddonMarkup = (addons) => {
  return addons
  .map((addon) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${addon.name}</span>
        &plus;
        ${addon.currency}&nbsp;<span class="event__offer-price">${addon.price}</span>
       </li>`
    );
  })
    .join(`\n`);
};

export const createEventItemTemplate = (event) => {
  const {startDate, endDate, travelCity, travelPoints, travelPrice, travelAddons} = event;
  const getTime = (fullDate) => {
    return `${fullDate.getHours()}:${fullDate.getMinutes()}`;
  };

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${travelPoints}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${travelPoints} ${travelCity}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${getTimeIso(startDate)}T${getTime(startDate)}">${getEventTime(startDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="${getTimeIso(endDate)}T${getTime(endDate)}">${getEventTime(endDate)}</time>
          </p>
          <p class="event__duration">${getTimeDifference(startDate, endDate)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${travelPrice}</span>
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
