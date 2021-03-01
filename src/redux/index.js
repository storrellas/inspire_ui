
import { createStore } from "redux";


// Actions
// ---------------------
export const TAB_COMPANY_COOPERATION_OPENED = "TAB_COMPANY_COOPERATION_OPENED";
export const TAB_AFFILIATIONS_OPENED = "TAB_AFFILIATIONS_OPENED";

export const TAB_RESEARCH_PROFILE_OPENED = "TAB_RESEARCH_PROFILE_OPENED";
export const TAB_PUBLICATIONS_OPENED = "TAB_PUBLICATIONS_OPENED";
export const TAB_EVENTS_OPENED = "TAB_EVENTS_OPENED";
export const TAB_CLINICAL_TRIALS_OPENED = "TAB_CLINICAL_TRIALS_OPENED";

// Content list

// SubContentList
export function setTabCompanyCooperationRendered() {
  return { type: TAB_COMPANY_COOPERATION_OPENED }
};

export function setTabResearchProfileRendered() {
  return { type: TAB_RESEARCH_PROFILE_OPENED }
};
export function setTabPublicationsRendered() {
  return { type: TAB_PUBLICATIONS_OPENED }
};
export function setTabEventsRendered() {
  return { type: TAB_EVENTS_OPENED }
};
export function setTabClinicalTrialsRendered() {
  return { type: TAB_CLINICAL_TRIALS_OPENED }
};


// Reducers
// ---------------------
const initialState = {
  tab_company_cooperation_rendered: false,
  tab_affiliations_rendered: false,
  
  
  tab_research_profile_rendered: false,
  tab_publications_rendered: false,
  tab_events_rendered: false,
  tab_clinical_trials_rendered: false,
};

export function rootReducer(state = initialState, action) {
  if (action.type === TAB_COMPANY_COOPERATION_OPENED) {
    return {tab_company_cooperation_rendered: true };
  }
  if (action.type === TAB_AFFILIATIONS_OPENED) {
    return {tab_affiliations_rendered: true };
  }
  
  if (action.type === TAB_RESEARCH_PROFILE_OPENED) {
    return {tab_research_profile_rendered: true };
  }
  if (action.type === TAB_PUBLICATIONS_OPENED) {
    return {tab_publications_rendered: true };
  }
  if (action.type === TAB_EVENTS_OPENED) {
    return {tab_events_rendered: true };
  }
  if (action.type === TAB_CLINICAL_TRIALS_OPENED) {
    return {tab_clinical_trials_rendered: true };
  }

  
  return state;
}

export const store = createStore(rootReducer);
export default store