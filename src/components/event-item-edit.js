import {TRAVEL_TRANSPORT, TRAVEL_ACTIVITY, CURRENCY, Placeholder} from '../const.js';
import {getDateFormatEditor} from '../utils/common.js';
import {getToStringDateFormat} from '../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import {travelOffers, travelCities} from '../main.js';

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const destinationNames = (cities) => {
  return cities.map((city) => city.name);
};

const createEventsChooserMurkup = (choosers, currentChooser) => {
  return choosers
  .map((chooser) => {
    return (`<div class="event__type-item">
      <input id="event-type-${chooser}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${chooser}"
      ${currentChooser === chooser ? `checked` : ``}
      >
      <label class="event__type-label  event__type-label--${chooser}" for="event-type-${chooser}-1">${chooser}</label>
    </div>`);
  }).join(`\n`);
};

const createCityOptions = (cities, citySelected) => {
  return cities
  .map((city) => {
    return (
      ` <option value="${city}"
      ${citySelected === city ? `selected` : ``}
      ></option>`);
  }).join(`\n`);
};

const isInArray = (item, array) => {
  return array.some((it) => it.title === item.title);
};

const createOfferSelector = (selectors, selectorChosen) => {
  return selectors
  .map((selector) => {
    const selectorRemark = selector.title.replace(/\s+/g, ``).toLowerCase();
    return (
      `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${selectorRemark}-1" type="checkbox" name="event-offer-${selectorRemark}" ${isInArray(selector, selectorChosen) ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${selectorRemark}-1">
        <span class="event__offer-title">${selector.title}</span>
        &plus;
        ${CURRENCY}&nbsp;<span class="event__offer-price">${selector.price}</span>
      </label>
    </div>`
    );
  }).join(`\n`);
};

const createPhotoTemplate = (photos) => {
  return photos
  .map((photo) => {
    return (
      `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`
    );
  }).join(`\n`);
};

const createEventEditTemplate = (travelEvent, options = {}, travelOfs) => {
  const {travelPoints, destination, description, photos, price, travelAddons, externalData, startDate, endDate} = options;
  const {isFavorite} = travelEvent;
  const travelCityNames = destinationNames(travelCities);
  const isValidCity = travelCityNames.includes(destination);
  const isValidprice = Number.isInteger(price);
  const isValidDates = new Date(endDate) > new Date(startDate);
  const isBlockSaveButton = (isValidCity && isValidprice && isValidDates);
  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;
  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${travelPoints}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${createEventsChooserMurkup(TRAVEL_TRANSPORT, travelPoints)}
              </fieldset>
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${createEventsChooserMurkup(TRAVEL_ACTIVITY, travelPoints)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${travelPoints} ${TRAVEL_TRANSPORT.includes(travelPoints) ? Placeholder.TRANSPORT : Placeholder.ACTION}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination : ``}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${createCityOptions(travelCityNames, destination)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateFormatEditor(startDate)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateFormatEditor(endDate)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isBlockSaveButton ? `` : `disabled`}>${saveButtonText}</button>
          <button class="event__reset-btn" type="reset">${deleteButtonText}</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        ${destination ?
      `<section class="event__details">
      ${travelOfs.length > 0 ?
      `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${createOfferSelector(travelOfs, travelAddons)}
            </div>
          </section>`
      : ``}
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
              ${createPhotoTemplate(photos)}
              </div>
            </div>
          </section>
        </section>`
      : ``}
      </form>
    </li>`
  );
};

export default class ItemEdit extends AbstractSmartComponent {
  constructor(travelEvent) {
    super();
    this._event = travelEvent;
    this._flatpickr = null;
    this._saveButtonHandler = null;
    this._favouriteButtonHandler = null;
    this._rollUpHandler = null;
    this._deleteButtonHandler = null;
    this._offers = travelEvent.travelAddons;
    this._travelPoints = travelEvent.travelPoints;
    this._isFavorite = travelEvent.isFavorite;
    this._eventDestination = travelEvent.destination.name;
    this._placeDescription = travelEvent.destination.description;
    this._placePhotos = travelEvent.destination.pictures;
    this._price = travelEvent.price;
    this._startDate = travelEvent.startDate;
    this._endDate = travelEvent.endDate;
    this._travelOffers = [];
    this._externalData = DefaultData;
    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    this._getTypeOffers(travelOffers);
    return createEventEditTemplate(this._event, {
      startDate: this._startDate,
      endDate: this._endDate,
      travelPoints: this._travelPoints,
      destination: this._eventDestination,
      description: this._placeDescription,
      photos: this._placePhotos,
      travelAddons: this._offers,
      price: this._price,
      externalData: this._externalData,
    }, this._travelOffers);
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    this.setSaveButtonHandler(this._saveButtonHandler);
    this.setFavouriteButtonHandler(this._favouriteButtonHandler);
    this.setRollUpHandler(this._rollUpHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const point = this._event;

    this._travelPoints = point.travelPoints;
    this._eventDestination = point.destination;
    this._offers = point.travelAddons;
    this._price = point.price;
    this._startDate = point.startDate;
    this._endDate = point.endDate;
    this._getTypeOffers(travelOffers);

    this.rerender();
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);

    this.rerender();
  }

  setBlock(statement) {
    const element = this.getElement();
    element.querySelectorAll(`input`).forEach((it) => {
      it.readOnly = statement;
    });
    element.querySelectorAll(`button`).forEach((it) => {
      it.disabled = statement;
    });
  }

  setSaveButtonHandler(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, handler);
    this._saveButtonHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);
    this._deleteButtonHandler = handler;
  }

  setFavouriteButtonHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
    .addEventListener(`click`, handler);
    this._favouriteButtonHandler = handler;
  }

  setRollUpHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
    this._rollUpHandler = handler;
  }

  getData() {
    const form = this.getElement().querySelector(`.event--edit`);
    return new FormData(form);
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpick = null;
    }

    const dateTimes = this.getElement().querySelectorAll(`.event__input--time`);
    dateTimes.forEach((dateTime) => {
      this._flatpickr = flatpickr(dateTime, {
        altInput: true,
        altFormat: `d/m/Y H:i`,
        allowInput: true,
        enableTime: true,
        time24hr: true,
        dateFormat: `d/m/Y H:i`,
        defaultDate: dateTime.value,
      });
    });
  }

  _getPlaceDescription(cities) {
    this._eventDestination = this._eventDestination;
    cities.forEach((travelCity) => {
      if (travelCity.name === this._eventDestination) {
        this._placeDescription = travelCity.description;
        this._placePhotos = travelCity.pictures;
      }
    });
  }

  _getTypeOffers(travelOfs) {
    travelOfs.forEach((it) => {
      if (it.type === this._travelPoints) {
        this._travelOffers = it.offers;
      } return this._travelOffers;
    }); return this._travelOffers;
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const eventType = element.querySelector(`.event__type-list`);
    eventType.addEventListener(`change`, (evt) => {
      this._travelPoints = evt.target.value;
      this.rerender();
    });

    const priceContainer = element.querySelector(`.event__input--price`);
    priceContainer.addEventListener(`change`, (evt) => {
      this._price = Math.floor(evt.target.value);
      this.rerender();
    });

    const startDateContainer = element.querySelector(`#event-start-time-1`);
    startDateContainer.addEventListener(`change`, (evt) => {
      this._startDate = getToStringDateFormat(evt.target.value);
      this.rerender();
    });

    const endDateContainer = element.querySelector(`#event-end-time-1`);
    endDateContainer.addEventListener(`change`, (evt) => {
      this._endDate = getToStringDateFormat(evt.target.value);
      this.rerender();
    });
    const eventDestination = element.querySelector(`.event__input--destination`);
    eventDestination.addEventListener(`change`, () => {
      this._eventDestination = eventDestination.value;
      this._getPlaceDescription(travelCities);
      this.rerender();
    });
  }
}
