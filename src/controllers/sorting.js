import SortingComponent from '../components/sorting.js';
import {SortType} from '../const.js';
import {RenderPosition, render, replace} from '../utils/render.js';

export default class SortingController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._activeSortingType = SortType.DEFAULT_EVENT;
    this._sortingComponent = null;
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
  }

  render() {
    const container = this._container;
    const sortingButtons = Object.values(SortType).map((sortType) => {
      return {
        name: sortType,
        checked: sortType === this._activeSortingType,
      };
    });
    const oldComponent = this._sortingComponent;
    this._sortingComponent = new SortingComponent(sortingButtons);
    this._sortingComponent.onSortTypeChange(this._onSortTypeChange);
    if (oldComponent) {
      replace(this._sortingComponent, oldComponent);
    } else {
      render(container, this._sortingComponent, RenderPosition.BEFOREEND);
    }
  }

  _onSortTypeChange(sortType) {
    this._pointsModel.setSorting(sortType);
    this._activeSortingType = sortType;
  }

  _onDataChange() {
    this.render();
  }
}
