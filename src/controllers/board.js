import SortingComponent, {SortType} from '../components/sorting.js';
import TotalPriceComponent from '../components/trip-info-cost.js';
import EventsListComponent from '../components/list.js';
import DatesComponent from '../components/day-card.js';
import EventComponent from '../components/event-item.js';
import ItemEditComponent from '../components/event-item-edit.js';
import TripInfoElement from '../components/trip-info.js';
import NoEventsComponent from '../components/no-events.js';
import {createArrayDates} from '../components/event-item.js';
import {createArrayCities} from '../components/event-item.js';
import {createArrayPrices} from '../components/event-item.js';
import {getDateWithoutMinutes} from '../utils/common.js';
import {RenderPosition, render, replace} from '../utils/render.js';


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
  eventEditComponent.setRollUpHandler(replaceEditToEvent);
  render(place, eventComponent, RenderPosition.BEFOREEND);
};

const singleDates = (evts) => {
  const setOfSingleDates = new Set();
  evts.map((evt) =>{
    setOfSingleDates.add(getDateWithoutMinutes(evt));
  });
  return setOfSingleDates;
};

const getSingleDatesArray = (events) => {
  return Array.from(singleDates(createArrayDates(events)))
    .slice()
    .sort((a, b) => a - b);
};

const singleDateContainer = (list, event) => {
  let singleDayContainer;
  list.forEach((it) => {
    if (it.id === new Date(getDateWithoutMinutes(event.startDate)).toISOString()) {
      singleDayContainer = it;
    }
  });
  return singleDayContainer;
};

const renderEvents = (dayContainer, events) => {
  events.forEach((event) => renderEvent(dayContainer, event));
};


export default class BoardController {
  constructor(container, events) {
    this._container = container;
    this._events = events;
    this._noEventsComponent = new NoEventsComponent();
    this._totalPriceComponent = new TotalPriceComponent(createArrayPrices(events));
    this._tripInfoComponent = new TripInfoElement(createArrayCities(events), createArrayDates(events));
    this._sortingComponent = new SortingComponent();
    this._eventListComponent = new EventsListComponent();
  }

  render() {
    const container = this._container;
    const siteMainElement = document.querySelector(`.page-body`);
    const siteHeaderElement = siteMainElement.querySelector(`.page-header`);
    const mainTripInfoElement = siteHeaderElement.querySelector(`.trip-main__trip-info`);

    if (this._events.length === 0) {
      render(container, this._noEventsComponent, RenderPosition.BEFOREEND);
      render(mainTripInfoElement, this._totalPriceComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(mainTripInfoElement, this._tripInfoComponent, RenderPosition.AFTERBEGIN);

    render(mainTripInfoElement, this._totalPriceComponent, RenderPosition.BEFOREEND);

    render(container, this._sortingComponent, RenderPosition.BEFOREEND);

    const eventListComponent = this._eventListComponent;
    render(container, eventListComponent, RenderPosition.BEFOREEND);
    const tripDaysList = container.querySelector(`.trip-days`);

    getSingleDatesArray(this._events)
        .forEach((date) => render(tripDaysList, new DatesComponent(date, getSingleDatesArray(this._events).indexOf(getDateWithoutMinutes(date))), RenderPosition.BEFOREEND));

    let tripEventsLists = tripDaysList.querySelectorAll(`.trip-events__list`);

    this._events.slice()
      .sort((a, b) => a.startDate - b.startDate)
      .forEach((event) => renderEvent(singleDateContainer(tripEventsLists, event), event));

    this._sortingComponent.sortTypeChangeHandler((sortType) => {
      let sortedEvents = [];
      switch (sortType) {
        case SortType.TIME_DOWN:
          sortedEvents = this._events.slice()
            .sort((a, b) => ((b.endDate - b.startDate) - (a.endDate - a.startDate)));
          break;
        case SortType.PRICE_DOWN:
          sortedEvents = this._events.slice()
            .sort((a, b) => b.travelPrice - a.travelPrice);
          break;
        case SortType.DEFAULT_EVENT:
          sortedEvents = this._events.slice()
            .sort((a, b) => a.startDate - b.startDate);
          break;
      }

      tripDaysList.innerHTML = ``;

      if (sortType === SortType.DEFAULT_EVENT) {
        getSingleDatesArray(sortedEvents)
            .forEach((sortedEvent) => render(tripDaysList, new DatesComponent(sortedEvent, getSingleDatesArray(sortedEvents).indexOf(getDateWithoutMinutes(sortedEvent))), RenderPosition.BEFOREEND));

        tripEventsLists = tripDaysList.querySelectorAll(`.trip-events__list`);

        sortedEvents.forEach((event) => renderEvent(singleDateContainer(tripEventsLists, event), event));
        return;
      }

      render(tripDaysList, new DatesComponent(), RenderPosition.BEFOREEND);
      const tripEventsList = tripDaysList.querySelector(`.trip-events__list`);
      renderEvents(tripEventsList, sortedEvents);

      return;
    });


  }
}
