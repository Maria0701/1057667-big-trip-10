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
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  updatePoint(id, newPoint) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._points.slice(0, index), newPoint, this._points.slice(index + 1));
    this._dataChangeHandlers.forEach((handler) => handler());

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandlers(handler) {
    this._dataChangeHandlers.push(handler);
  }
}
