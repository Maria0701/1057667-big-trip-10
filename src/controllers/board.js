import SortingComponent, {SortType} from '../components/sorting.js';
import EventsListComponent from '../components/list.js';
import DatesComponent from '../components/day-card.js';
import NoEventsComponent from '../components/no-events.js';
import {createArrayStartDates} from '../components/event-item.js';
import {getDateWithoutMinutes, getTimeIso} from '../utils/common.js';
import {RenderPosition, render} from '../utils/render.js';
import TravelPoint, {Mode as PointControllerMode, EmptyPoint} from './point.js';

const getSingleDates = (evts) => {
  const setOfSingleDates = new Set();
  evts.map((evt) =>{
    setOfSingleDates.add(getDateWithoutMinutes(evt));
  });
  return setOfSingleDates;
};

const getSingleDatesArray = (events) => {
  return Array.from(getSingleDates(createArrayStartDates(events)))
    .slice()
    .sort((a, b) => a - b);
};


const getSingleDateContainer = (list, event) => {
  const dateIterator = getTimeIso(event.startDate);
  const singleDayContainer = [...list].find((item) => item.id === dateIterator);
  return singleDayContainer;
};

const renderEvents = (dayContainer, tripEventsLists, travelEvents, onDataChange, onViewChange, travelCities) => {
  return travelEvents.map((travelEvent) => {
    let container;
    if (Array.from(tripEventsLists).length > 0) {
      container = getSingleDateContainer(tripEventsLists, travelEvent);
    } else {
      container = tripEventsLists;
    }
    const travelPoint = new TravelPoint(container, onDataChange, onViewChange, travelCities);
    travelPoint.render(travelEvent, PointControllerMode.DEFAULT);
    return travelPoint;
  });
};

const renderSingleDatesContainers = (place, array) => {
  array.forEach((element) => render(place, new DatesComponent(element, array.indexOf(getDateWithoutMinutes(element))), RenderPosition.BEFOREEND));
};


export default class BoardController {
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._eventsControllers = [];
    this._api = api;
    this._noEventsComponent = new NoEventsComponent();
    this._creatingPoint = null;
    this._sortType = SortType.DEFAULT_EVENT;
    this._sortingComponent = new SortingComponent();
    this._eventListComponent = new EventsListComponent();
    this._onViewChange = this._onViewChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortChange = this._onSortChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._sortingComponent.onSortTypeChange(this._onSortChange);
    this._pointsModel.setOnFilterChange(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();
    const points = this._pointsModel.getPoints();

    if (points.length === 0) {
      render(container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(container, this._eventListComponent, RenderPosition.BEFOREEND);

    this._renderPoints(points.slice().sort((a, b) => a.startDate - b.startDate), SortType.DEFAULT_EVENT);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }
    const eventListComponent = this._eventListComponent.getElement();
    if (!document
      .contains(this._eventListComponent.getElement())) {
      const container = this._container.getElement();
      container.innerHTML = ``;
      render(container, this._sortingComponent, RenderPosition.BEFOREEND);
      render(container, this._eventListComponent, RenderPosition.BEFOREEND);
    }
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
    this._eventsControllers.forEach((pointController) => pointController.destroy());
    this._eventsControllers = [];
  }

  _updatePoints() {
    this._removePoints();
    const points = this._pointsModel.getPoints();
    if (points.length === 0) {
      const container = this._container.getElement();
      container.innerHTML = ``;
      render(container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }
    this._renderPoints(points.slice(), this._sortType);
  }

  _renderPoints(points, sortType = SortType.DEFAULT_EVENT) {
    this._removePoints();
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

    this._eventsControllers = [].concat(this._eventsControllers, newEvents);
  }

  _onSortChange(sortType) {
    this._onViewChange();
    let sortedEvents = [];
    const points = this._pointsModel.getPoints();
    switch (sortType) {
      case SortType.TIME_DOWN:
        sortedEvents = points.slice()
            .sort((a, b) => ((b.endDate - b.startDate) - (a.endDate - a.startDate)));
        this._sortType = SortType.TIME_DOWN;
        break;
      case SortType.PRICE_DOWN:
        sortedEvents = points.slice()
            .sort((a, b) => b.price - a.price);
        this._sortType = SortType.PRICE_DOWN;
        break;
      case SortType.DEFAULT_EVENT:
        sortedEvents = points.slice()
            .sort((a, b) => a.startDate - b.startDate);
        this._sortType = SortType.DEFAULT_EVENT;
        break;
    }

    const eventListComponent = this._eventListComponent.getElement();
    eventListComponent.innerHTML = ``;

    if (sortType === SortType.DEFAULT_EVENT) {
      this._renderPoints(points.slice().sort((a, b) => a.startDate - b.startDate), sortType);
      return;
    }

    this._renderPoints(sortedEvents, sortType);
  }

  _onViewChange() {
    this._eventsControllers.forEach((it) => {
      if (it === this._creatingPoint) {
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
        this._api.createPoint(newData)
          .then((pointModel) => {
            this._pointsModel.addPoint(pointModel);
            eventsController.render(pointModel, PointControllerMode.DEFAULT);

            const destroyedPoint = this._eventsControllers.pop();
            destroyedPoint.destroy();
            this._eventsControllers = [].concat(this._eventsControllers, eventsController);
            this._updatePoints();
          })
          .catch(() => {
            eventsController.animateEvent();
          });
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
        })
        .catch(() => {
          eventsController.animateEvent();
        });
    } else {
      this._api.updatePoint(oldData.id, newData)
        .then((pointModel) => {
          const isSuccess = this._pointsModel.updatePoint(oldData.id, pointModel);
          if (isSuccess) {
            eventsController.render(pointModel, PointControllerMode.DEFAULT);
            this._updatePoints();
          }
        })
        .catch(() => {
          eventsController.animateEvent();
        });
    }
  }

  _onFilterChange() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints().slice());
  }
}
