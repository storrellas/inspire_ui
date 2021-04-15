
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


export const PANEL_RESET = "PANEL_RESET";

export const PANEL_ACTIVE = "PANEL_ACTIVE";
export const PANEL_CONNECTIONS_OPENED = "PANEL_CONNECTIONS_OPENED";
export const PANEL_COMPANY_COOPERATION_OPENED = "PANEL_COMPANY_COOPERATION_OPENED";
export const PANEL_AFFILIATIONS_OPENED = "PANEL_AFFILIATIONS_OPENED";

export const PANEL_RESEARCH_PROFILE_OPENED = "PANEL_RESEARCH_PROFILE_OPENED";
export const PANEL_PUBLICATIONS_OPENED = "PANEL_PUBLICATIONS_OPENED";
export const PANEL_EVENTS_OPENED = "PANEL_EVENTS_OPENED";
export const PANEL_CLINICAL_TRIALS_OPENED = "PANEL_CLINICAL_TRIALS_OPENED";
export const PANEL_FEEDBACK_OPENED = "PANEL_FEEDBACK_OPENED";

export const INVESTIGATOR_PROFILE = "INVESTIGATOR_PROFILE";
export const INVESTIGATOR_FIXED_TOP_PROFILE = "INVESTIGATOR_FIXED_PROFILE";
export const SITE_SCROLL_END_REACHED = "SITE_SCROLL_END_REACHED";

// Content list

// SubContentList
export function setPanelActive(panel) {
  return { type: PANEL_ACTIVE, panel: panel }
};

export function resetPanel() {
  return { type: PANEL_RESET }
};

export function setInvestigatorProfile(payload) {
  return { type: INVESTIGATOR_PROFILE, payload }
};

export function setInvestigatorFixedTopProfile(payload) {
  return { type: INVESTIGATOR_FIXED_TOP_PROFILE, payload }
};

export function setScrollEnd(payload) {
  return { type: SITE_SCROLL_END_REACHED, payload }
};

// Reducers
// ---------------------
const initialState = {
  tabActive: PANEL.CONNECTIONS,
  investigatorProfile: undefined,
  investigatorFixedTopProfile: false,
  scrollEnd: false,
};

export function rootReducer(state = initialState, action) {
  if (action.type === PANEL_ACTIVE) {
    return { ...state, tabActive: action.panel, };    
  }
  if (action.type === INVESTIGATOR_PROFILE) {
    return { ...state, investigatorProfile: action.payload };
  }
  if (action.type === INVESTIGATOR_FIXED_TOP_PROFILE) {
    return { ...state, investigatorFixedTopProfile: action.payload.investigatorFixedTopProfile };
  }
  if (action.type === SITE_SCROLL_END_REACHED) {
    return { ...state, scrollEnd: action.payload.scrollEnd };
  }

  return state;
}

export const store = createStore(rootReducer);
export default store