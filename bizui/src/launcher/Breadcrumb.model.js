import { routerRedux } from 'dva/router';
import key from 'keymaster';
import { sessionObject } from '../utils/utils';

// console.log("element", )
import defaultLocaleName from './Launcher.locale';
const launcherLocaleName = defaultLocaleName; //you can define your version here to replace default

const userContext = {};

let currentLocation = '';

const hasLinkInArray = (breadcrumbArray, link) => {
  const result = breadcrumbArray.filter(item => item.link == link);

  return result.length > 0;
};

export default {
  namespace: 'breadcrumb',

  state: {
    currentApp: 'app1',
    app1: [{ name: launcherLocaleName(userContext, 'Platform'), link: '/' }],
    menuData: {},
    returnURL: null,
  },

  subscriptions: {},
  effects: {},
  reducers: {
    updateState(state, action) {
      return { ...state, ...action.payload };
    },
    gotoLink(state, action) {
      const targetApp = sessionObject('targetApp');
      const currentBreadcrumb = sessionObject(targetApp.id);

      //const appdata=state[state.currentApp];
      if (!currentBreadcrumb) {
        return state;
      }
      const link = action.payload.link;
      let returnURL = state.returnURL;
      if (link && link.indexOf('/list/') > 0 && link.indexOf('/cache') < 0) {
        returnURL = link + '/cache';
      }

      const name = action.payload.displayName;

      const index = currentBreadcrumb.findIndex(item => item.link == link);
      console.log('index', index);
      if (index < 0) {
        currentBreadcrumb.push({ name, link });
        sessionObject(targetApp.id, currentBreadcrumb);
        return { ...state, returnURL };
      }

      // const newBreadcrumb = currentBreadcrumb.slice(0, index + 1);
      // sessionObject(targetApp.id, newBreadcrumb);
      return { ...state, returnURL };
    },
    selectApp(state, action) {
      console.log(action);
      //const targetAppExpr = sessionStorage.getItem('targetApp');
      const targetApp = action.payload.targetApp;
      const menuData = action.payload.menuData;
      const location = action.payload.location.pathname;

      if (!targetApp) {
        return state;
      }

      const currentBreadcrumb = sessionObject(targetApp.id) || [];

      //this is a new app
      sessionObject('targetApp', targetApp);
      sessionObject('menuData', menuData);

      const name = targetApp.title;
      const link = location;
      const currentAppKey = targetApp.id;
      const index = currentBreadcrumb.findIndex(item => item.link == link);
      if (index < 0) {
        currentBreadcrumb.push({ name, link });
        sessionObject(currentAppKey, currentBreadcrumb);
      }

      return { ...state, targetApp, menuData };
    },
  },
};
