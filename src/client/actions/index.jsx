export const toggleCheck = () => {
  return {
    type: "TOGGLE_CHECK"
  };
};

export const incNumber = () => {
  return {
    type: "INC_NUMBER"
  };
};

export const decNumber = () => {
  return {
    type: "DEC_NUMBER"
  };
};


export const changeLangToVN = () => {
  return {
    type: "CHANGE_LANG_VN"
  };
};


export const changeLangToEN = () => {
  return {
    type: "CHANGE_LANG_EN"
  };
};

export const setUserInfo = (data) => {
  return {
    type: "SET_USER_INFO", userInfo: data
  };
};

export const updateFullName = (data) => {
  return {
    type: "UPDATE_FULLNAME", fullName: data
  };
};

export const showUserProgress = (data) => {
  return {
    type: "UPDATE_USERPROGRESS", hideProgress: data
  };
};

