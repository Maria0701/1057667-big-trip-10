import {getPointsByFilter} from '../utils/filter.js';
import {FilterType} from '../const.js';

export default class Points {
  constructor() {
    this._points = [];
    this._dataChangeHandlers = [];
    this._activeFilterType = FilterType.EVERYTHING;
    this._filterChangeHandlers = [];
  }

  getPoints() {
    return getPointsByFilter(this._points, this._activeFilterType);
  }

  setPoints(points) {
    this._points = Array.from(points);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  removePoint(id) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }
    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  updatePoint(id, newPoint) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }
    this._points = [].concat(this._points.slice(0, index), newPoint, this._points.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandlers(handler) {
    this._dataChangeHandlers.push(handler);
  }

  addPoint(point) {
    this._points = [].concat(point, this._points);
    this._callHandlers(this._dataChangeHandlers);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
