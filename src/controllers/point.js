import EventComponent from '../components/event-item.js';
import ItemEditComponent from '../components/event-item-edit.js';
import {RenderPosition, render, replace, remove} from '../utils/render.js';
import {TRAVEL_TRANSPORT} from '../const.js';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`
};


export const EmptyPoint = {
  startDate: new Date(),
  endDate: new Date(),
  destination: ``,
  travelPoints: TRAVEL_TRANSPORT[0],
  travelPrice: ``,
  travelAddons: [],
  isFavorite: false,
};

export default class TravelPoint {
  constructor(container, onDataChange, onViewChange, travelCities) {
    this._conatiner = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._travelCities = travelCities;

    this._mode = Mode.DEFAULT;
    this._pointComponent = null;
    this._pointEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(travelEvent, mode) {
    const oldEvent = this._pointComponent;
    const oldEditEvent = this._pointEditComponent;
    this._mode = mode;

    this._pointComponent = new EventComponent(travelEvent);
    this._pointEditComponent = new ItemEditComponent(travelEvent, this._travelCities);
    this._pointComponent.setEditButtonEventHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setSaveButtonHandler((evt) => {
      evt.preventDefault();
      const data = this._pointEditComponent.getData();
      this._onDataChange(this, travelEvent, data);
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

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEvent && oldEditEvent) {
          replace(this._pointComponent, oldEvent);
          replace(this._pointEditComponent, oldEditEvent);
          this._replaceEditToEvent();
        } else {
          render(this._conatiner, this._pointComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldEvent && oldEditEvent) {
          remove(oldEvent);
          remove(oldEditEvent);
        }
        this._onViewChange();
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._conatiner, this._pointEditComponent, RenderPosition.AFTERBEGIN);
        break;
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
    this._pointEditComponent.reset();
    if (document.contains(this._pointEditComponent.getElement())) {
      replace(this._pointComponent, this._pointEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null);
      }
      this._replaceEditToEvent();
    }
  }
}
