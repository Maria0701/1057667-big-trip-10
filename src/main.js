import {createMenuTemplate} from './components/menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createSortingTemplate} from './components/sorting.js';
import {createListTemplate} from './components/list.js';
import {createDayCardTemplate} from './components/day-card.js';
import {createEventItemTemplate} from './components/event-item.js';
import {createEventEditTemplate} from './components/event-item-edit.js';
import {createTripInfo} from './components/trip-info.js';
import {FILTER_NAMES} from './const.js';
import {travelItem} from './mocks/travel-points';


const EVENT_COUNTS = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteMainElement.querySelector(`.page-header`);
const mainTripInfoElement = siteHeaderElement.querySelector(`.trip-main__trip-info`);
render(mainTripInfoElement, createTripInfo(), `afterbegin`);

const mainTripControls = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
const mainNavigationPlace = mainTripControls.querySelector(`h2:first-child`);
render(mainTripControls, createFilterTemplate(FILTER_NAMES), `beforeend`);
render(mainNavigationPlace, createMenuTemplate(), `afterend`);

const tripBoard = siteMainElement.querySelector(`.trip-events`);
render(tripBoard, createSortingTemplate(), `beforeend`);
render(tripBoard, createListTemplate(), `beforeend`);

const tripDaysList = tripBoard.querySelector(`.trip-days`);
render(tripDaysList, createDayCardTemplate(), `beforeend`);

const tripEventsList = tripDaysList.querySelector(`.trip-events__list`);
render(tripEventsList, createEventEditTemplate(), `beforeend`);
new Array(EVENT_COUNTS)
  .fill(``)
  .forEach(
      () => render(tripEventsList, createEventItemTemplate(), `beforeend`)
  );
