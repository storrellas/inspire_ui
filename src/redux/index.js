
import { createStore } from "redux";


// Actions
// ---------------------
export const TAB_COMPANY_COOPERATION_OPENED = "TAB_COMPANY_COOPERATION_OPENED";

// Content list

// SubContentList
export function setTabCompanyCooperationRendered() {
  return { type: TAB_COMPANY_COOPERATION_OPENED }
};



// Reducers
// ---------------------
const initialState = {
  tab_company_cooperation_rendered: false,
};

export function rootReducer(state = initialState, action) {
  if (action.type === TAB_COMPANY_COOPERATION_OPENED) {
    return {tab_company_cooperation_rendered: true };
  }

  
  return state;
}

export const store = createStore(rootReducer);
export default store