import SortingComponent, {SortType} from '../components/sorting.js';
import TotalPriceComponent from '../components/trip-info-cost.js';
import EventsListComponent from '../components/list.js';
import DatesComponent from '../components/day-card.js';
import TripInfoElement from '../components/trip-info.js';
import NoEventsComponent from '../components/no-events.js';
import {createArrayStartDates, createArrayEndDates, createArrayCities, createArrayPrices} from '../components/event-item.js';
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
  return Array.from(singleDates(createArrayStartDates(events)))
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
  return events.map((travelEvent) => {
    let container;
    if (Array.from(tripEventsLists).length > 0) {
      container = singleDateContainer(tripEventsLists, travelEvent);
    } else {
      container = tripEventsLists;
    }
    const travelPoint = new TravelPoint(container, onDataChange, onViewChange);
    travelPoint.render(travelEvent);
    return travelPoint;
  });
};

const renderSingleDatesContainers = (place, array) => {
  array.forEach((element) => render(place, new DatesComponent(element, array.indexOf(getDateWithoutMinutes(element))), RenderPosition.BEFOREEND));
};


export default class BoardController {
  constructor(container, travelEvents, pointsModel) {
    this._container = container;
    this._events = [];
    this._pointsModel = pointsModel;
    this._eventsControllers = [];
    this._noEventsComponent = new NoEventsComponent();
    this._totalPriceComponent = new TotalPriceComponent(createArrayPrices(travelEvents));
    this._tripInfoComponent = new TripInfoElement(createArrayCities(travelEvents), createArrayStartDates(travelEvents), createArrayEndDates(travelEvents));
    this._sortingComponent = new SortingComponent();
    this._eventListComponent = new EventsListComponent();
    this._onViewChange = this._onViewChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortChange = this._onSortChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._sortingComponent.sortTypeChangeHandler(this._onSortChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container;
    const points = this._pointsModel.getPoints();
    const siteMainElement = document.querySelector(`.page-body`);
    const siteHeaderElement = siteMainElement.querySelector(`.page-header`);
    const mainTripInfoElement = siteHeaderElement.querySelector(`.trip-main__trip-info`);

    if (points.length === 0) {
      render(container, this._noEventsComponent, RenderPosition.BEFOREEND);
      render(mainTripInfoElement, this._totalPriceComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(mainTripInfoElement, this._tripInfoComponent, RenderPosition.AFTERBEGIN);

    render(mainTripInfoElement, this._totalPriceComponent, RenderPosition.BEFOREEND);

    render(container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(container, this._eventListComponent, RenderPosition.BEFOREEND);
    const eventListComponent = this._eventListComponent.getElement();

    renderSingleDatesContainers(eventListComponent, getSingleDatesArray(points));
    const tripEventsLists = eventListComponent.querySelectorAll(`.trip-events__list`);
    renderEvents(eventListComponent, tripEventsLists, points.slice().sort((a, b) => a.startDate - b.startDate), this._onDataChange, this._onViewChange);
  }

  _onSortChange(sortType) {
    let sortedEvents = [];
    const points = this._pointsModel.getPoints();
    switch (sortType) {
      case SortType.TIME_DOWN:
        sortedEvents = points.slice()
            .sort((a, b) => ((b.endDate - b.startDate) - (a.endDate - a.startDate)));
        break;
      case SortType.PRICE_DOWN:
        sortedEvents = points.slice()
            .sort((a, b) => b.travelPrice - a.travelPrice);
        break;
      case SortType.DEFAULT_EVENT:
        sortedEvents = points.slice()
            .sort((a, b) => a.startDate - b.startDate);
        break;
    }

    const eventListComponent = this._eventListComponent.getElement();
    eventListComponent.innerHTML = ``;

    if (sortType === SortType.DEFAULT_EVENT) {

      renderSingleDatesContainers(eventListComponent, getSingleDatesArray(sortedEvents));

      const tripEventsLists = eventListComponent.querySelectorAll(`.trip-events__list`);

      renderEvents(eventListComponent, tripEventsLists, points.slice().sort((a, b) => a.startDate - b.startDate), this._onDataChange, this._onViewChange);
    }

    render(eventListComponent, new DatesComponent(), RenderPosition.BEFOREEND);
    const tripEventsList = eventListComponent.querySelector(`.trip-events__list`);
    this._eventsControllers = [].concat(renderEvents(eventListComponent, tripEventsList, sortedEvents, this._onDataChange, this._onViewChange));
    return;
  }

  _onViewChange() {
    this._eventsControllers.forEach((it) => it.setDefaultView());
  }

  _onDataChange(eventsController, oldData, newData) {
    const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

    if (isSuccess) {
      eventsController.render(newData);
    }
  }

  _onFilterChange() {
    this._removePoints();
    const points = this._pointsModel.getPoints();
    const eventListComponent = this._eventListComponent.getElement();
    eventListComponent.innerHTML = ``;
    renderSingleDatesContainers(eventListComponent, getSingleDatesArray(points));
    const tripEventsLists = eventListComponent.querySelectorAll(`.trip-events__list`);
    renderEvents(eventListComponent, tripEventsLists, points.slice().sort((a, b) => a.startDate - b.startDate), this._onDataChange, this._onViewChange);
  }
}
