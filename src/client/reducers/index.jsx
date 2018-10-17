import {combineReducers} from "redux";

const checkBox = (store, action) => {
  if (action.type === "TOGGLE_CHECK") {
    return {
      checked: !store.checked
    };
  }

  return store || {checked: false};
};

const number = (store, action) => {
  if (action.type === "INC_NUMBER") {
    return {
      value: store.value + 1
    };
  } else if (action.type === "DEC_NUMBER") {
    return {
      value: store.value - 1
    };
  }

  return store || {value: 0};
};

const locale = (store, action) => {
  if (action.type === "CHANGE_LANG_EN") {
    return {
      locale: 'en'
    };
  } else if (action.type === "CHANGE_LANG_EN") {
    return {
      locale: 'vi'
    };
  }

  return store || {locale: "vi"};
};

const isGuest = (store, action) => {

  return store || false;
}

const userInfo = (store,action) =>{
  if(action.type === "SET_USER_INFO"){
    return  action.userInfo
  }

  return store || null;
}

const fullName = (store, action) =>{
  if(action.type === "UPDATE_FULLNAME"){
    return  action.fullName
  }

  return store || "";
}

const hideProgress = (store, action) =>{
  if(action.type === "UPDATE_USERPROGRESS"){
    return  action.hideProgress
  }

  return store || false;
}

const keycloak = (store, action) =>{
  if(action.type === "GET_KEYCLOAK"){
    return  store.keycloak
  }

  return store || {};
}


export default combineReducers({
  checkBox,
  number,
  locale,
  isGuest,
  userInfo,
  fullName,
  hideProgress,
  keycloak
});
