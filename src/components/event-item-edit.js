import {TRAVEL_TRANSPORT, TRAVEL_ACTIVITY, CURRENCY, Placeholder} from '../const.js';
import {getDateFormatEditor, getToStringDateFormat, debounce} from '../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import flatpickr from 'flatpickr';
import RangePlugin from 'flatpickr/dist/plugins/rangePlugin.js';
import 'flatpickr/dist/flatpickr.css';
import {travelOffers, travelCities} from '../main.js';
import {Mode as PointControllerMode} from '../controllers/point.js';

const DEFAULT_OFFER = `trip`;

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
    const isChecked = isInArray(selector, selectorChosen);
    const selectorRemark = selector.title.replace(/\s+/g, ``).toLowerCase();
    return (
      `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${selectorRemark}-1" type="checkbox" value="${selector.title}" name="event-offer-${selectorRemark}" ${isChecked ? `checked` : ``}>
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
  const {travelPoints, destination, description, photos, price, travelAddons, externalData, startDate, endDate, mode} = options;
  const {isFavorite} = travelEvent;
  const travelCityNames = destinationNames(travelCities);
  const isValidCity = travelCityNames.includes(destination);
  const isValidprice = Number.isInteger(price);
  const isValidDates = new Date(endDate) >= new Date(startDate);
  const isValidType = travelPoints !== ``;
  const isBlockSaveButton = (isValidCity && isValidprice && isValidDates && isValidType);
  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;
  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${travelPoints ? travelPoints : DEFAULT_OFFER}.png" alt="Event type icon">
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
              ${travelPoints ? travelPoints : DEFAULT_OFFER} ${TRAVEL_TRANSPORT.includes(travelPoints) ? Placeholder.TRANSPORT : Placeholder.ACTION}
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
          ${mode !== PointControllerMode.ADDING ?
      `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>` : ``}
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        ${destination || travelOfs.length > 0 ?
      `<section class="event__details">
      ${travelOfs.length > 0 ?
      `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${createOfferSelector(travelOfs, travelAddons)}
            </div>
          </section>`
      : ``}
      ${destination ?
      `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
              ${createPhotoTemplate(photos)}
              </div>
            </div>
          </section>`
      : ``}
        </section>`
      : ``}
      </form>
    </li>`
  );
};

const getArrayOfActiveOffers = (array) => array.map((it) => it.title);

export default class ItemEdit extends AbstractSmartComponent {
  constructor(travelEvent, mode) {
    super();
    this._event = travelEvent;
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
    this._travelCities = travelCities;
    this._externalData = DefaultData;
    this._flatpickr = null;
    this._onSaveButtonClick = null;
    this._onFavouriteButtonClick = null;
    this._onRollUpClick = null;
    this._onDeleteButtonClick = null;
    this._mode = mode;
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
      mode: this._mode,
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
    this.setOnSaveButton(this._onSaveButtonClick);
    this.setOnFavouriteButton(this._onFavouriteButtonClick);
    this.setOnRollUp(this._onRollUpClick);
    this.setOnDeleteButtonClick(this._onDeleteButtonClick);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const point = this._event;
    this._travelPoints = point.travelPoints;
    this._eventDestination = point.destination.name;
    this._description = point.destination.description;
    this._placePhotos = point.destination.pictures;
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

  setOnSaveButton(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, handler);
    this._onSaveButtonClick = handler;
  }

  setOnDeleteButtonClick(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);
    this._onDeleteButtonClick = handler;
  }

  setOnFavouriteButton(handler) {
    const favouriteButton = this.getElement().querySelector(`.event__favorite-checkbox`);
    if (favouriteButton) {
      favouriteButton.addEventListener(`click`, debounce(handler, 2000, this));
      this._onFavouriteButtonClick = handler;
    }
  }

  setOnRollUp(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
    this._onRollUpClick = handler;
  }

  getData() {
    const form = this.getElement().querySelector(`.event--edit`);
    return new FormData(form);
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }
    const start = this.getElement().querySelector(`#event-start-time-1`);
    const end = this.getElement().querySelector(`#event-end-time-1`);
    this._flatpickr = flatpickr(start, {
      alowInput: true,
      enableTime: true,
      time24hr: true,
      dateFormat: `d/m/Y H:i`,
      mode: `range`,
      plugins: [new RangePlugin({input: end})],
      onClose: [((selectedDates) => {
        this._startDate = getToStringDateFormat(selectedDates[0]);
        this._endDate = getToStringDateFormat(selectedDates[1]);
        this.rerender.bind(this);
      })],
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
      this._offers = [];
      this.rerender();
    });

    const priceContainer = element.querySelector(`.event__input--price`);
    priceContainer.addEventListener(`change`, (evt) => {
      this._price = Math.floor(evt.target.value);
      this.rerender();
    });

    const availableOffers = element.querySelector(`.event__available-offers`);
    if (availableOffers) {
      availableOffers.addEventListener(`click`, (evt) => {
        if (evt.target.tagName !== `INPUT`) {
          return;
        }
        if (!getArrayOfActiveOffers(this._offers)
        .includes(evt.target.value)) {
          this._offers.push(this._travelOffers.find((addon) => addon.title === evt.target.value));
        } else {
          const index = this._offers.findIndex((it) => it.title === evt.target.value);
          this._offers = [].concat(this._offers.slice(0, index), this._offers.slice(index + 1));
        }
        this.rerender();
      });
    }

    const eventDestination = element.querySelector(`.event__input--destination`);
    eventDestination.addEventListener(`change`, () => {
      if (destinationNames(this._travelCities)
        .includes(eventDestination.value)) {
        this._eventDestination = eventDestination.value;
        this._getPlaceDescription(travelCities);
        this.rerender();
        return;
      }
      eventDestination.value = ``;
      this._eventDestination = eventDestination.value;
      this.rerender();
    });
  }
}
