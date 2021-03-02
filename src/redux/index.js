
import { createStore } from "redux";


// Actions
// ---------------------
export const PANEL = {
  CONNECTIONS: 1,
  COMPANY_COOPERATION: 2,
  AFFILIATIONS: 3,
  FEEDBACK: 4,

  RESEARCH_PROFILE: 5,
  PUBLICATIONS: 6,
  EVENTS: 7,
  CLINICAL_TRIALS: 8,
}


export const TAB_COMPANY_COOPERATION_OPENED = "TAB_COMPANY_COOPERATION_OPENED";
export const TAB_AFFILIATIONS_OPENED = "TAB_AFFILIATIONS_OPENED";

export const TAB_RESEARCH_PROFILE_OPENED = "TAB_RESEARCH_PROFILE_OPENED";
export const TAB_PUBLICATIONS_OPENED = "TAB_PUBLICATIONS_OPENED";
export const TAB_EVENTS_OPENED = "TAB_EVENTS_OPENED";
export const TAB_CLINICAL_TRIALS_OPENED = "TAB_CLINICAL_TRIALS_OPENED";

// Content list

// SubContentList
export function setPanelRendered(panel) {

  if( panel == PANEL.COMPANY_COOPERATION ) 
    return { type: TAB_COMPANY_COOPERATION_OPENED }

  if( panel == PANEL.RESEARCH_PROFILE ) 
    return { type: TAB_RESEARCH_PROFILE_OPENED } 
  if( panel == PANEL.PUBLICATIONS ) 
    return { type: TAB_PUBLICATIONS_OPENED } 
  if( panel == PANEL.EVENTS ) 
    return { type: TAB_EVENTS_OPENED } 
  if( panel == PANEL.CLINICAL_TRIALS ) 
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