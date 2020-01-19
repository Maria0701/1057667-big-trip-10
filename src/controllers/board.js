import SortingComponent, {SortType} from '../components/sorting.js';
import TotalPriceComponent from '../components/trip-info-cost.js';
import EventsListComponent from '../components/list.js';
import DatesComponent from '../components/day-card.js';
import TripInfoElement from '../components/trip-info.js';
import NoEventsComponent from '../components/no-events.js';
import {createArrayStartDates, createArrayEndDates, createArrayCities, createArrayPrices} from '../components/event-item.js';
import {getDateWithoutMinutes, getTimeIso} from '../utils/common.js';
import {RenderPosition, render} from '../utils/render.js';
import TravelPoint, {Mode as PointControllerMode, EmptyPoint} from './point.js';

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

const renderEvents = (dayContainer, tripEventsLists, travelEvents, onDataChange, onViewChange) => {
  return travelEvents.map((travelEvent) => {
    let container;
    if (Array.from(tripEventsLists).length > 0) {
      container = singleDateContainer(tripEventsLists, travelEvent);
    } else {
      container = tripEventsLists;
    }
    const travelPoint = new TravelPoint(container, onDataChange, onViewChange);
    travelPoint.render(travelEvent, PointControllerMode.DEFAULT);
    return travelPoint;
  });
};

const renderSingleDatesContainers = (place, array) => {
  array.forEach((element) => render(place, new DatesComponent(element, array.indexOf(getDateWithoutMinutes(element))), RenderPosition.BEFOREEND));
};


export default class BoardController {
  constructor(container, travelEvents, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._eventsControllers = [];
    this._noEventsComponent = new NoEventsComponent();
    this._totalPriceComponent = new TotalPriceComponent(createArrayPrices(travelEvents));
    this._tripInfoComponent = new TripInfoElement(createArrayCities(travelEvents), createArrayStartDates(travelEvents), createArrayEndDates(travelEvents));
    this._creatingPoint = null;
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
    const container = this._container.getElement();
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

    this._renderPoints(points.slice().sort((a, b) => a.startDate - b.startDate), SortType.DEFAULT_EVENT);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }
    const eventListComponent = this._eventListComponent.getElement();
    const tripEventsList = new DatesComponent();
    if (!document.contains(tripEventsList.getElement())) {
      render(eventListComponent, tripEventsList, RenderPosition.AFTERBEGIN);
    }
    const tripEvt = tripEventsList.getElement().querySelector(`.trip-events__list`);
    this._creatingPoint = new TravelPoint(tripEvt, this._onDataChange, this._onViewChange);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
    this._eventsControllers = this._eventsControllers.concat(this._creatingPoint);
  }

  _removePoints() {
    const eventListComponent = this._eventListComponent.getElement();
    eventListComponent.innerHTML = ``;
    this._eventsControllers = [];
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints().slice());
  }

  _renderPoints(points, sortType = SortType.DEFAULT_EVENT) {
    const eventListComponent = this._eventListComponent.getElement();
    let tripEventsLists;
    if (sortType === SortType.DEFAULT_EVENT) {
      renderSingleDatesContainers(eventListComponent, getSingleDatesArray(points));
      tripEventsLists = eventListComponent.querySelectorAll(`.trip-events__list`);
    } else {
      render(eventListComponent, new DatesComponent(), RenderPosition.BEFOREEND);
      tripEventsLists = eventListComponent.querySelector(`.trip-events__list`);
    }

    const newEvents = renderEvents(eventListComponent, tripEventsLists, points, this._onDataChange, this._onViewChange);

    this._eventsControllers = this._eventsControllers.concat(newEvents);
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
      this._renderPoints(points.slice().sort((a, b) => a.startDate - b.startDate), sortType);
      return;
    }

    this._renderPoints(sortedEvents, sortType);
    return;
  }

  _onViewChange() {
    this._eventsControllers.forEach((it) => {
      if (it === this._creatingPoint) {
        it.destroy();
        this._creatingPoint = null;
      }
      return it.setDefaultView();
    });
  }

  _onDataChange(eventsController, oldData, newData) {
    if (oldData === EmptyPoint) {
      this._creatingPoint = null;
      if (newData === null) {
        eventsController.destroy();
        this._updatePoints();
      } else {
        this._pointsModel.addPoint(newData);
        eventsController.render(newData, PointControllerMode.DEFAULT);

        const destroyedPoint = this._eventsControllers.pop();
        destroyedPoint.destroy();

        this._eventsControllers = [].concat(eventsController, this._eventsControllers);
        this._updatePoints();
      }
    } else if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
      this._updatePoints();
    } else {
      const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);
      if (isSuccess) {
        eventsController.render(newData, PointControllerMode.DEFAULT);
        this._updatePoints();
      }
    }
  }

  _onFilterChange() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints().slice());
  }
}
