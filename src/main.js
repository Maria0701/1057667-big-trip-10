import API from './api.js';
import SiteMenuComponent, {MenuItems} from './components/menu.js';
import BoardComponent from './components/board.js';
import Points from './models/points.js';
import {RenderPosition, render} from './utils/render.js';
import TripController from './controllers/board.js';
import FilterController from './controllers/filter.js';
import StatisticsComponent from './components/stats.js';
const AUTHORIZATION = `Basic dXNlckBwY=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip/`;

const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new Points();
let boardController;


const siteMainElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteMainElement.querySelector(`.page-header__container`);

const siteMenuComponent = new SiteMenuComponent();
render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);
const mainTripControls = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
const filterController = new FilterController(mainTripControls, pointsModel);
filterController.render();

const boardComponent = new BoardComponent();
const boardPlace = siteMainElement.querySelector(`.page-main .page-body__container`);
render(boardPlace, boardComponent, RenderPosition.BEFOREEND);

const statisticsComponent = new StatisticsComponent(pointsModel);
render(boardPlace, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

let travelCities = [];
api.getDestinations()
  .then((destinations) => {
    destinations.map((it) => travelCities.push(it));
    return travelCities;
  });

api.getPoints()
    .then((points) => {
      boardController = new TripController(boardComponent, points, pointsModel, travelCities);
      pointsModel.setPoints(points);
      boardController.render();
    });

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItems.ADD:
      siteMenuComponent.setActiveItem(MenuItems.TABLE);
      statisticsComponent.hide();
      boardComponent.show();
      boardController.createPoint();
      break;
    case MenuItems.STATS:
      boardComponent.hide();
      statisticsComponent.show();
      break;
    case MenuItems.TABLE:
      statisticsComponent.hide();
      boardComponent.show();
      break;
  }
});
