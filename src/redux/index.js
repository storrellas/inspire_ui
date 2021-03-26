
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

export const PANEL_CONNECTIONS_OPENED = "PANEL_CONNECTIONS_OPENED";
export const PANEL_COMPANY_COOPERATION_OPENED = "PANEL_COMPANY_COOPERATION_OPENED";
export const PANEL_AFFILIATIONS_OPENED = "PANEL_AFFILIATIONS_OPENED";

export const PANEL_RESEARCH_PROFILE_OPENED = "PANEL_RESEARCH_PROFILE_OPENED";
export const PANEL_PUBLICATIONS_OPENED = "PANEL_PUBLICATIONS_OPENED";
export const PANEL_EVENTS_OPENED = "PANEL_EVENTS_OPENED";
export const PANEL_CLINICAL_TRIALS_OPENED = "PANEL_CLINICAL_TRIALS_OPENED";

export const INVESTIGATOR_PROFILE = "INVESTIGATOR_PROFILE";
export const INVESTIGATOR_FIXED_TOP_PROFILE = "INVESTIGATOR_FIXED_PROFILE";

// Content list

// SubContentList
export function setPanelRendered(panel) {

  if( panel == PANEL.CONNECTIONS ) 
    return { type: PANEL_CONNECTIONS_OPENED }
  if( panel == PANEL.COMPANY_COOPERATION ) 
    return { type: PANEL_COMPANY_COOPERATION_OPENED }

  if( panel == PANEL.RESEARCH_PROFILE ) 
    return { type: PANEL_RESEARCH_PROFILE_OPENED } 
  if( panel == PANEL.PUBLICATIONS ) 
    return { type: PANEL_PUBLICATIONS_OPENED } 
  if( panel == PANEL.EVENTS ) 
    return { type: PANEL_EVENTS_OPENED } 
  if( panel == PANEL.CLINICAL_TRIALS ) 
    return { type: PANEL_CLINICAL_TRIALS_OPENED }
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

// Reducers
// ---------------------
const initialState = {
  tabConnectionsOpened: false,
  tabCompanyCooperationOpened: false,
  
  tabResearchProfileOpened: false,
  tabPublicationsOpened: false,
  tabEventsOpened: false,
  tabClinicalTrialsOpened: false,

  investigatorProfile: undefined,

  investigatorFixedTopProfile: false,
};

export function rootReducer(state = initialState, action) {
  if (action.type === PANEL_CONNECTIONS_OPENED) {
    return { ...state, tabConnectionsOpened: true };    
  }
  if (action.type === PANEL_COMPANY_COOPERATION_OPENED) {
    return { ...state, tabCompanyCooperationOpened: true };    
  }

  
  if (action.type === PANEL_RESEARCH_PROFILE_OPENED) {
    return { ...state, tabResearchProfileOpened: true };    
  }
  if (action.type === PANEL_PUBLICATIONS_OPENED) {
    return { ...state, tabPublicationsOpened: true };    
  }
  if (action.type === PANEL_EVENTS_OPENED) {
    return { ...state, tabEventsOpened: true };
  }
  if (action.type === PANEL_CLINICAL_TRIALS_OPENED) {
    return { ...state, tabClinicalTrialsOpened: true };
  }

  if (action.type === PANEL_RESET) {
    return { ...state, 
      tabConnectionsOpened: false,
      tabCompanyCooperationOpened: false,
      
      tabResearchProfileOpened: false,
      tabPublicationsOpened: false,
      tabEventsOpened: false,
      tabClinicalTrialsOpened: false,    
    };
  }

  if (action.type === INVESTIGATOR_FIXED_TOP_PROFILE) {
    return { ...state, investigatorFixedTopProfile: action.payload.investigatorFixedTopProfile
    };
  }

  return state;
}

export const store = createStore(rootReducer);
export default store