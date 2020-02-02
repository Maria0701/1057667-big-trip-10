import TripInfoComponent from '../components/trip-info.js';
import {RenderPosition, render, replace} from '../utils/render.js';


export default class TripInfoController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._tripInfoComponent = null;
    this._onDataChange = this._onDataChange.bind(this);
    this._pointsModel.setOnDataChange(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allPoints = this._pointsModel.getPoints();
    const oldTripInfoComponent = this._tripInfoComponent;
    this._tripInfoComponent = new TripInfoComponent(allPoints);
    if (oldTripInfoComponent) {
      replace(this._tripInfoComponent, oldTripInfoComponent);
    } else {
      render(container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onDataChange() {
    this.render();
  }
}
