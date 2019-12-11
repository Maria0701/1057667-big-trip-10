import SiteMenuComponent from './components/menu.js';
import FilterComponent from './components/filter.js';
import SortingComponent from './components/sorting.js';
import TotalPriceComponent from './components/trip-info-cost.js';
import EventsListComponent from './components/list.js';
import {createDayCardTemplate} from './components/day-card.js';
import EventComponent from './components/event-item.js';
import ItemEditComponent from './components/event-item-edit.js';
import TripInfoElement from './components/trip-info.js';
import {FILTER_NAMES} from './const.js';
import {generateTravelItems} from './mocks/travel-points';
import {createArrayDates} from './components/event-item.js';
import {createArrayCities} from './components/event-item.js';
import {createArrayPrices} from './components/event-item.js';
import {getTimeIso, RenderPosition, render} from './utils.js';

const EVENT_COUNTS = 10;

const render1 = (container, template, place) => {
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

render(mainTripInfoElement, new TripInfoElement(createArrayCities(events), createArrayDates(events)).getElement(), RenderPosition.AFTERBEGIN);
render(mainTripInfoElement, new TotalPriceComponent(createArrayPrices(events)).getElement(), RenderPosition.BEFOREEND);
const mainTripControls = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
render(mainTripControls, new FilterComponent(FILTER_NAMES).getElement(), RenderPosition.BEFOREEND);
render(mainTripControls, new SiteMenuComponent().getElement(), RenderPosition.AFTERBEGIN);

const tripBoard = siteMainElement.querySelector(`.trip-events`);
render(tripBoard, new SortingComponent().getElement(), RenderPosition.BEFOREEND);
render(tripBoard, new EventsListComponent().getElement(), RenderPosition.BEFOREEND);

const tripDaysList = tripBoard.querySelector(`.trip-days`);
const daysAToBeEvents = Array.from(singleDates(createArrayDates(events))).slice().sort((a, b) => a - b);

render1(tripDaysList, createDayCardTemplate(daysAToBeEvents), `beforeend`);

const tripEventsList = tripDaysList.querySelector(`.trip-events__list`);
const tripEventsLists = tripDaysList.querySelectorAll(`.trip-events__list`);

const singleDateContainer = (list, event) => {
  let singleDayContainer;
  list.forEach((it) => {
    if (it.id === getTimeIso(event.startDate)) {
      singleDayContainer = it;
    }
  });
  return singleDayContainer;
};

render(tripEventsList, new ItemEditComponent(events[1]).getElement(), RenderPosition.BEFOREEND);

events.slice()
  .sort((a, b) => a.startDate - b.startDate)
  .forEach((event) => render(singleDateContainer(tripEventsLists, event), new EventComponent(event).getElement(), RenderPosition.BEFOREEND));
