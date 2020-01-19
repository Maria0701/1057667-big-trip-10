import {TRAVEL_TRANSPORT, TRAVEL_ACTIVITY, TRAVEL_ADDONS, CURRENCY, Placeholder} from '../const.js';
import {getDateFormatEditor, getToStringDateFormat} from '../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

const OFFER_PREFIX = `event-offer-`;
const getOfferName = (name) => {
  return name.substring(OFFER_PREFIX.length);
};

const destinationNames = (cities) => {
  return cities.map((city) => city.name);
};

const parseFormData = (formData) => {
  const allOffers = document.querySelectorAll(`.event__offer-checkbox`);
  const actualAddons = (offersAll, allAddons) => {
    const nArray = [];
    Array.from(offersAll).forEach((offer) => {
      if (offer.checked) {
        allAddons.forEach((addon) => {
          if (addon.remark === getOfferName(offer.name)) {
            nArray.push(addon);
          }
        });
      }
    });
    return nArray;
  };

  const startDate = formData.get(`event-start-time`);
  const endDate = formData.get(`event-end-time`);
  return {
    startDate: new Date(getToStringDateFormat(startDate)),
    endDate: new Date(getToStringDateFormat(endDate)),
    destination: formData.get(`event-destination`),
    travelPoints: formData.get(`event-type`),
    travelAddons: actualAddons(allOffers, TRAVEL_ADDONS),
    travelPrice: formData.get(`event-price`)
  };
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

const createOfferSelector = (selectors, selectorChosen) => {
  return selectors
  .map((selector) => {
    const selectorRemark = selector.title.replace(` `, ``).toLowerCase();
    return (
      `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${selectorRemark}-1" type="checkbox" name="event-offer-${selectorRemark}" ${selectorChosen.includes(selector) ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${selectorRemark}-1">
        <span class="event__offer-title">${selector.title}</span>
        &plus;
        ${CURRENCY};&nbsp;<span class="event__offer-price">${selector.price}</span>
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

const createEventEditTemplate = (travelEvent, options = {}, travelCities) => {
  const {travelPoints, destination, description, photos, travelPrice, travelAddons} = options;
  const {startDate, endDate, isFavorite} = travelEvent;
  const isBlockSaveButton = (!startDate || !endDate || !destination || !travelPrice);
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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${createCityOptions(destinationNames(travelCities), destination)}
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
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${travelPrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isBlockSaveButton ? `disabled` : ``}>Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

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
        ${TRAVEL_ADDONS.length !== 0 ?
      `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${createOfferSelector(TRAVEL_ADDONS, travelAddons)}
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
  constructor(travelEvent, travelCities) {
    super();
    this._event = travelEvent;
    this._flatpickr = null;
    this._saveButtonHandler = null;
    this._favouriteButtonHandler = null;
    this._rollUpHandler = null;
    this._deleteButtonHandler = null;
    this._travelCities = travelCities;
    this._offers = travelEvent.travelAddons;
    this._travelPoints = travelEvent.travelPoints;
    this._isFavorite = travelEvent.isFavorite;
    this._eventDestination = travelEvent.destination.name;
    this._placeDescription = travelEvent.destination.description;
    this._placePhotos = travelEvent.destination.pictures;
    this._travelPrice = travelEvent.travelPrice;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    this._getPlaceDescription(this._travelCities);
    return createEventEditTemplate(this._event, {
      travelPoints: this._travelPoints,
      destination: this._eventDestination,
      description: this._placeDescription,
      photos: this._placePhotos,
      travelAddons: this._offers,
      travelPrice: this._travelPrice,
    }, this._travelCities);
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
    this._travelPrice = point.travelPrice;
    this._startDate = point.startDate;
    this._endDate = point.endDate;

    this.rerender();
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
    const formData = new FormData(form);
    return parseFormData(formData);
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpick = null;
    }

    const dateTimes = this.getElement().querySelectorAll(`.event__input--time`);
    dateTimes.forEach((dateTime) => {
      this._flatpickr = flatpickr(dateTime, {
        allowInput: true,
        enableTime: true,
        // time_24hr: true,
        dateFormat: `d/m/Y H:m`,
        defaultDate: dateTime.value,
      });
    });
  }

  _getPlaceDescription(travelCities) {
    this._eventDestination = this._eventDestination;
    travelCities.forEach((travelCity) => {
      if (travelCity.name === this._eventDestination) {
        this._placeDescription = travelCity.description;
        this._placePhotos = travelCity.pictures;
      }
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const eventType = element.querySelector(`.event__type-group`);
    eventType.addEventListener(`change`, (evt) => {
      this._travelPoints = evt.target.value;
      this.rerender();
    });

    const eventDestination = element.querySelector(`.event__input--destination`);
    this._travelCities.forEach((travelCity) => {
      if (travelCity.name === this._eventDestination) {
        this._placeDescription = travelCity.description;
        this._placePhotos = travelCity.pictures;
      }
    });
    eventDestination.addEventListener(`change`, () => {
      this._eventDestination = eventDestination.value;
      this._getPlaceDescription(this._travelCities);
      this.rerender();
    });
  }
}
