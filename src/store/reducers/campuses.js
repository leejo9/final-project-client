/*==================================================
/src/store/reducers/campuses.js

This is a Reducer function that accepts 2 parameters: the previous state object (aka current state) and an action object. 
Depending on the Action object, the Reducer updates the State and return the new State object.
It also defines the State and its default initial value.
================================================== */
import * as at from "../actions/actionTypes";  // Import Action Types ("at" keyword for Action Type)

// REDUCER:
// Reducer for campuses
const allCampuses = (state = [], action) => {
  switch (action.type) {
    case "FETCH_ALL_CAMPUSES":
      return action.payload;
    case "DELETE_CAMPUS":
      // Remove the deleted campus from the state
      return state.filter((campus) => campus.id !== action.payload);
    default:
      return state;
  }
};

export default allCampuses;
