import {createMenuTemplate} from './components/menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createSortingTemplate} from './components/sorting.js';
import {createListTemplate} from './components/list.js';
import {createDayCardTemplate} from './components/day-card.js';
import {createEventItemTemplate} from './components/event-item.js';
import {createEventEditTemplate} from './components/event-item-edit.js';
import {createTripInfo} from './components/trip-info.js';
import {FILTER_NAMES} from './const.js';
import {generateTravelItems} from './mocks/travel-points';
import {createArrayDates} from './components/event-item.js';
import {createArrayCities} from './components/event-item.js';
import {getTimeIso} from './utils.js';

const EVENT_COUNTS = 10;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


const events = generateTravelItems(EVENT_COUNTS);
const singleDates = (evts) => {
  const setOfSingleDates = new Set();
  evts.map((evt) =>{
    const dateCopy = new Date(evt);
    setOfSingleDates.add(dateCopy.setHours(0, 0, 0, 0));
  }
  );
  return setOfSingleDates;
};

const siteMainElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteMainElement.querySelector(`.page-header`);
const mainTripInfoElement = siteHeaderElement.querySelector(`.trip-main__trip-info`);
render(mainTripInfoElement, createTripInfo(createArrayCities(events), createArrayDates(events)), `afterbegin`);

const mainTripControls = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
const mainNavigationPlace = mainTripControls.querySelector(`h2:first-child`);
render(mainTripControls, createFilterTemplate(FILTER_NAMES), `beforeend`);
render(mainNavigationPlace, createMenuTemplate(), `afterend`);

const tripBoard = siteMainElement.querySelector(`.trip-events`);
render(tripBoard, createSortingTemplate(), `beforeend`);
render(tripBoard, createListTemplate(), `beforeend`);

const tripDaysList = tripBoard.querySelector(`.trip-days`);
render(tripDaysList, createDayCardTemplate(Array.from(singleDates(createArrayDates(events))).slice().sort((a, b) => a - b)), `beforeend`);

const tripEventsList = tripDaysList.querySelector(`.trip-events__list`);
const tripEventsLists = tripDaysList.querySelectorAll(`.trip-events__list`);

const singleDateContainer = (list, event) => {
  let singleDayContainer;
  [...list].forEach((it) => {
    if (it.id === getTimeIso(event.startDate)) {
      singleDayContainer = it;
    }
  });
  return singleDayContainer;
};

render(tripEventsList, createEventEditTemplate(), `beforeend`);
events.slice()
  .sort((a, b) => a.startDate - b.startDate)
  .forEach((event) => render(singleDateContainer(tripEventsLists, event), createEventItemTemplate(event), `beforeend`));
