import SiteMenuComponent from './components/menu.js';
import FilterComponent from './components/filter.js';
import SortingComponent from './components/sorting.js';
import TotalPriceComponent from './components/trip-info-cost.js';
import EventsListComponent from './components/list.js';
import DatesComponent from './components/day-card.js';
import EventComponent from './components/event-item.js';
import ItemEditComponent from './components/event-item-edit.js';
import TripInfoElement from './components/trip-info.js';
import NoEventsComponent from './components/no-events.js';
import {FILTER_NAMES} from './const.js';
import {generateTravelItems} from './mocks/travel-points';
import {createArrayDates} from './components/event-item.js';
import {createArrayCities} from './components/event-item.js';
import {createArrayPrices} from './components/event-item.js';
import {getTimeIso} from './utils/common.js';
import {RenderPosition, render, replace} from './utils/render.js';

const EVENT_COUNTS = 10;

const events = generateTravelItems(EVENT_COUNTS);

const siteMainElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteMainElement.querySelector(`.page-header`);
const mainTripInfoElement = siteHeaderElement.querySelector(`.trip-main__trip-info`);
const mainTripControls = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
render(mainTripControls, new FilterComponent(FILTER_NAMES), RenderPosition.BEFOREEND);
render(mainTripControls, new SiteMenuComponent(), RenderPosition.AFTERBEGIN);

const tripBoard = siteMainElement.querySelector(`.trip-events`);

if (EVENT_COUNTS === 0) {
  render(tripBoard, new NoEventsComponent(), RenderPosition.BEFOREEND);
  render(mainTripInfoElement, new TotalPriceComponent(0), RenderPosition.BEFOREEND);
} else {
  render(mainTripInfoElement, new TripInfoElement(createArrayCities(events), createArrayDates(events)), RenderPosition.AFTERBEGIN);

  render(mainTripInfoElement, new TotalPriceComponent(createArrayPrices(events)), RenderPosition.BEFOREEND);

  render(tripBoard, new SortingComponent(), RenderPosition.BEFOREEND);

  const eventListComponent = new EventsListComponent();
  render(tripBoard, eventListComponent, RenderPosition.BEFOREEND);

  const singleDates = (evts) => {
    const setOfSingleDates = new Set();
    evts.map((evt) =>{
      const dateCopy = new Date(evt);
      setOfSingleDates.add(dateCopy.setHours(0, 0, 0, 0));
    }
    );
    return setOfSingleDates;
  };

  const tripDaysList = tripBoard.querySelector(`.trip-days`);
  const singleDatesArray = Array.from(singleDates(createArrayDates(events)))
    .slice()
    .sort((a, b) => a - b);

  singleDatesArray
    .forEach((date) => render(tripDaysList, new DatesComponent(date, singleDatesArray.indexOf(date)), RenderPosition.BEFOREEND));


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

  const renderEvent = (place, event) => {
    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
      if (isEscKey) {
        replaceEditToEvent();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const eventComponent = new EventComponent(event);
    const eventEditComponent = new ItemEditComponent(event);

    const replaceEventToEdit = () => {
      replace(eventEditComponent, eventComponent);
    };

    const replaceEditToEvent = () => {
      replace(eventComponent, eventEditComponent);
    };

    eventComponent.setEditButtonEventHandler(() => {
      replaceEventToEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    eventEditComponent.setSaveButtonHandler((evt) => {
      evt.preventDefault();
      replaceEditToEvent();
    });

    eventEditComponent.setSaveRollUpHandler(replaceEditToEvent);

    render(place, eventComponent, RenderPosition.BEFOREEND);
  };

  events.slice()
  .sort((a, b) => a.startDate - b.startDate)
  .forEach((event) => renderEvent(singleDateContainer(tripEventsLists, event), event));
}
