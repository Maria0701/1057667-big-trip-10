import SortingComponent, {SortType} from '../components/sorting.js';
import TotalPriceComponent from '../components/trip-info-cost.js';
import EventsListComponent from '../components/list.js';
import DatesComponent from '../components/day-card.js';
import TripInfoElement from '../components/trip-info.js';
import NoEventsComponent from '../components/no-events.js';
import {createArrayDates} from '../components/event-item.js';
import {createArrayCities} from '../components/event-item.js';
import {createArrayPrices} from '../components/event-item.js';
import {getDateWithoutMinutes, getTimeIso} from '../utils/common.js';
import {RenderPosition, render} from '../utils/render.js';
import TravelPoint from './point.js';

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
    const dateIterator = getTimeIso(event.startDate);
    if (it.id === dateIterator) {
      singleDayContainer = it;
    }
  });
  return singleDayContainer;
};

const renderEvents = (dayContainer, tripEventsLists, events, onDataChange, onViewChange) => {
  events.map((event) => {
    let container;
    if (Array.from(tripEventsLists).length > 0) {
      container = singleDateContainer(tripEventsLists, event);
    } else {
      container = tripEventsLists;
    }
    const travelPoint = new TravelPoint(container, onDataChange, onViewChange);
    travelPoint.render(event);
    return travelPoint;
  });
};

const renderSingleDatesContainers = (place, array) => {
  array.forEach((element) => render(place, new DatesComponent(element, array.indexOf(getDateWithoutMinutes(element))), RenderPosition.BEFOREEND));
};


export default class BoardController {
  constructor(container, events) {
    this._container = container;
    this._events = [];
    this._noEventsComponent = new NoEventsComponent();
    this._totalPriceComponent = new TotalPriceComponent(createArrayPrices(events));
    this._tripInfoComponent = new TripInfoElement(createArrayCities(events), createArrayDates(events));
    this._sortingComponent = new SortingComponent();
    this._eventListComponent = new EventsListComponent();
    this._onViewChange = this._onViewChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortChange = this._onSortChange.bind(this);
    this._sortingComponent.sortTypeChangeHandler(this._onSortChange);
  }

  render(travelEvents) {
    this._travelEvents = travelEvents;
    const container = this._container;
    const siteMainElement = document.querySelector(`.page-body`);
    const siteHeaderElement = siteMainElement.querySelector(`.page-header`);
    const mainTripInfoElement = siteHeaderElement.querySelector(`.trip-main__trip-info`);

    if (this._travelEvents.length === 0) {
      render(container, this._noEventsComponent, RenderPosition.BEFOREEND);
      render(mainTripInfoElement, this._totalPriceComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(mainTripInfoElement, this._tripInfoComponent, RenderPosition.AFTERBEGIN);

    render(mainTripInfoElement, this._totalPriceComponent, RenderPosition.BEFOREEND);

    render(container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(container, this._eventListComponent, RenderPosition.BEFOREEND);
    const eventListComponent = this._eventListComponent.getElement();

    renderSingleDatesContainers(eventListComponent, getSingleDatesArray(this._travelEvents));
    const tripEventsLists = eventListComponent.querySelectorAll(`.trip-events__list`);
    renderEvents(eventListComponent, tripEventsLists, this._travelEvents.slice().sort((a, b) => a.startDate - b.startDate), this._onDataChange, this._onViewChange);
  }

  _onSortChange(sortType) {
    let sortedEvents = [];
    switch (sortType) {
      case SortType.TIME_DOWN:
        sortedEvents = this._travelEvents.slice()
            .sort((a, b) => ((b.endDate - b.startDate) - (a.endDate - a.startDate)));
        break;
      case SortType.PRICE_DOWN:
        sortedEvents = this._travelEvents.slice()
            .sort((a, b) => b.travelPrice - a.travelPrice);
        break;
      case SortType.DEFAULT_EVENT:
        sortedEvents = this._travelEvents.slice()
            .sort((a, b) => a.startDate - b.startDate);
        break;
    }

    const eventListComponent = this._eventListComponent.getElement();
    eventListComponent.innerHTML = ``;

    if (sortType === SortType.DEFAULT_EVENT) {

      renderSingleDatesContainers(eventListComponent, getSingleDatesArray(sortedEvents));

      const tripEventsLists = eventListComponent.querySelectorAll(`.trip-events__list`);

      renderEvents(eventListComponent, tripEventsLists, this._travelEvents.slice().sort((a, b) => a.startDate - b.startDate), this._onDataChange, this._onViewChange);
    }

    render(eventListComponent, new DatesComponent(), RenderPosition.BEFOREEND);
    const tripEventsList = eventListComponent.querySelector(`.trip-events__list`);
    renderEvents(eventListComponent, tripEventsList, sortedEvents, this._onDataChange, this._onViewChange);
    return;
  }

  _onViewChange() {
    this._travelEvents.forEach((it) => it.setDefaultView());
  }

  _onDataChange(eventsController, oldData, newData) {
    const index = this._travelEvents.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._travelEvents = [].concat(this._travelEvents.slice(0, index), newData, this._travelEvents.slice(index + 1));

    eventsController.render(this._travelEvents[index]);
  }

  _onViewChange() {
    this._travelEvents.forEach((it) => it.setDefaultView);
  }
}
