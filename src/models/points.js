import {getPointsByFilter} from '../utils/filter.js';
import {getPointsBySorting} from '../utils/sort.js';
import {FilterType} from '../const.js';
import {SortType} from '../const.js';

export default class Points {
  constructor() {
    this._points = [];
    this._dataChangeHandlers = [];
    this._activeFilterType = FilterType.EVERYTHING;
    this._activeSortType = SortType.DEFAULT_EVENT;
    this._filterChangeHandlers = [];
    this._sortChangeHandlers = [];
  }

  getPoints() {
    return getPointsBySorting(getPointsByFilter(this._points, this._activeFilterType), this._activeSortType);
  }

  getSortType() {
    return this._activeSortType;
  }

  setPoints(points) {
    this._points = Array.from(points);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }


  setSorting(sortingType) {
    this._activeSortType = sortingType;
    this._callHandlers(this._sortChangeHandlers);
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

  setOnFilterChange(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setOnSortTypeChange(handler) {
    this._sortChangeHandlers.push(handler);
  }

  setOnDataChange(handler) {
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
