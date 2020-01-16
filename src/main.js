import SiteMenuComponent, {MenuItems} from './components/menu.js';
import BoardComponent from './components/board.js';
import Points from './models/points.js';
import {generateTravelItems} from './mocks/travel-points';
import {RenderPosition, render} from './utils/render.js';
import TripController from './controllers/board.js';
import FilterController from './controllers/filter.js';
import StatisticsComponent from './components/stats.js';

const EVENT_COUNTS = 5;

const events = generateTravelItems(EVENT_COUNTS);
const points = new Points();
points.setPoints(events);

const siteMainElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteMainElement.querySelector(`.page-header__container`);

const siteMenuComponent = new SiteMenuComponent();
render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);
const mainTripControls = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
const filterController = new FilterController(mainTripControls, points);
filterController.render();

const boardComponent = new BoardComponent();
const boardPlace = siteMainElement.querySelector(`.page-main .page-body__container`);
render(boardPlace, boardComponent, RenderPosition.BEFOREEND);
const boardController = new TripController(boardComponent, events, points);
const statisticsComponent = new StatisticsComponent(points);
render(boardPlace, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();
boardController.render();

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
