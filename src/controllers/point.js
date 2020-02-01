import EventComponent from '../components/event-item.js';
import ItemEditComponent from '../components/event-item-edit.js';
import {RenderPosition, render, replace, remove} from '../utils/render.js';
import {OFFER_PREFIX} from '../const.js';
import {getToStringDateFormat} from '../utils/common.js';
import {travelOffers, travelCities} from '../main.js';
import PointModel from '../models/point.js';

const ANIMATION_TIMEOUT = 5000;

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`
};

const getOfferName = (name) => {
  return name.substring(OFFER_PREFIX.length);
};

const actualAddons = (offersAll, allAddons, type) => {
  const activeType = allAddons.find((item) => item.type === type);
  const actualOrders = [...activeType.offers];
  const pointOffers = [];
  [...offersAll].forEach((offer) => {
    if (offer.checked) {
      pointOffers.push(actualOrders.find((addon) => addon.title.replace(/\s+/g, ``).toLowerCase() === getOfferName(offer.name)));
    }
  });
  return pointOffers;
};

const parseFormData = (formData) => {
  const allOffers = document.querySelectorAll(`.event__offer-checkbox`);
  const offerType = formData.get(`event-type`);
  const startDate = formData.get(`event-start-time`);
  const endDate = formData.get(`event-end-time`);
  let destination;
  travelCities.forEach((it) => {
    if (it.name === formData.get(`event-destination`)) {
      destination = it;
    }
  });
  return new PointModel({
    'base_price': formData.get(`event-price`),
    'date_from': getToStringDateFormat(startDate),
    'date_to': getToStringDateFormat(endDate),
    'destination': destination,
    'is_favorite': false,
    'offers': actualAddons(allOffers, travelOffers, offerType),
    'type': offerType,
  });
};


export const EmptyPoint = {
  startDate: new Date(),
  endDate: new Date(),
  destination: ` `,
  travelPoints: ``,
  price: ``,
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

  render(travelEvent, mode) {
    const oldEvent = this._pointComponent;
    const oldEditEvent = this._pointEditComponent;
    this._mode = mode;
    this._pointComponent = new EventComponent(travelEvent);
    this._pointEditComponent = new ItemEditComponent(travelEvent, this._mode);
    this._pointComponent.setOnEditButtonEvent(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setOnSaveButton((evt) => {
      evt.preventDefault();
      this._pointEditComponent.setBlock(true);
      this._pointEditComponent.setData({
        saveButtonText: `Saving...`,
      });
      const formData = this._pointEditComponent.getData();
      const data = parseFormData(formData);
      this._onDataChange(this, travelEvent, data);
    });

    this._pointEditComponent.setOnRollUp(() => {
      if (this._mode === Mode.ADDING) {
        return;
      }
      this._replaceEditToEvent();
    });

    this._pointEditComponent.setOnFavouriteButton(() => {
      const newPoint = PointModel.clone(travelEvent);
      newPoint.isFavorite = !newPoint.isFavorite;
      this._onDataChange(this, travelEvent, newPoint);
    });

    this._pointEditComponent.setOnDeleteButtonClick(() => {
      this._pointEditComponent.setData({
        deleteButtonText: `Deleting...`,
      });
      this._pointEditComponent.setBlock(true);
      this._onDataChange(this, travelEvent, null);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEvent && oldEditEvent) {
          replace(this._pointComponent, oldEvent);
          if (oldEditEvent._flatpickr) {
            oldEditEvent._flatpickr.destroy();
            oldEditEvent._flatpickr = null;
          }
          replace(this._pointEditComponent, oldEditEvent);
          this._replaceEditToEvent();
        } else {
          render(this._conatiner, this._pointComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldEvent && oldEditEvent) {
          remove(oldEvent);
          if (oldEditEvent._flatpickr) {
            oldEditEvent._flatpickr.destroy();
            oldEditEvent._flatpickr = null;
          }
          remove(oldEditEvent);
        }
        this._onViewChange();
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._conatiner, this._pointEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode === Mode.ADDING) {
      this.destroy();
    }
    if (this._mode === Mode.EDIT) {
      this._replaceEditToEvent();
    }
  }

  destroy() {
    remove(this._pointComponent);
    if (this._pointEditComponent._flatpickr) {
      this._pointEditComponent._flatpickr.destroy();
      this._pointEditComponent._flatpickr = null;
    }
    remove(this._pointEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  animateEvent() {
    this._pointEditComponent.getElement().style.animation = `opacity ${ANIMATION_TIMEOUT / 1000}s linear`;
    this._pointComponent.getElement().style.animation = `opacity ${ANIMATION_TIMEOUT / 1000}s linear`;

    setTimeout(() => {
      this._pointEditComponent.getElement().style.animation = ``;
      this._pointComponent.getElement().style.animation = ``;

      this._pointEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
      this._pointEditComponent.setBlock(false);
    }, ANIMATION_TIMEOUT);
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
