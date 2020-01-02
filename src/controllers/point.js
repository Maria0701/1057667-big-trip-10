import EventComponent from '../components/event-item.js';
import ItemEditComponent from '../components/event-item-edit.js';
import {RenderPosition, render, replace, remove} from '../utils/render.js';

const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`
};


export const emptyPoint = {
  startDate: new Date(),
  endDate: new Date(),
  destination: ``,
  travelPoints: ``,
  travelPrice: ``,
  travelAddons: [],
  isFavorite: false,
};

export default class TravelPoint {
  constructor(container, onDataChange, onViewChange) {
    this._conatiner = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._pointComponent = null;
    this._pointEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(travelEvent) {
    const oldEvent = this._pointComponent;
    const oldEditEvent = this._pointEditComponent;

    this._pointComponent = new EventComponent(travelEvent);
    this._pointEditComponent = new ItemEditComponent(travelEvent);
    this._pointComponent.setEditButtonEventHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setSaveButtonHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
    });

    this._pointEditComponent.setRollUpHandler(() => {
      this._replaceEditToEvent();
    });

    this._pointEditComponent.setFavouriteButtonHandler(() => {
      this._onDataChange(this, travelEvent, Object.assign({}, travelEvent, {
        isFavorite: !travelEvent.isFavorite,
      }));
    });

    this._pointEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, travelEvent, null));

    if (oldEvent && oldEditEvent) {
      replace(this._pointComponent, oldEvent);
      replace(this._pointEditComponent, oldEditEvent);
    } else {
      render(this._conatiner, this._pointComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replace(this._pointEditComponent, this._pointComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    replace(this._pointComponent, this._pointEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
