import { createStore, combineReducers, compose } from "redux";
import firebase from "firebase";
import "firebase/firestore";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";

//Own Reducers
import notifyReducer from "./reducers/notifyReducer";
import settingsReducer from "./reducers/settingsReducer";

const firebaseConfig = {
  apiKey: "AIzaSyC4W_HstXN5UTYUrDBaMGUQ9PTIIyKiRoQ",
  authDomain: "reactclientpanel-60ff2.firebaseapp.com",
  databaseURL: "https://reactclientpanel-60ff2.firebaseio.com",
  projectId: "reactclientpanel-60ff2",
  storageBucket: "reactclientpanel-60ff2.appspot.com",
  messagingSenderId: "765374486375"
};

//react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFireStoreForProfile: true
};

//initialize firebase instance
firebase.initializeApp(firebaseConfig);
//initialize Firestore
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase) // <- needed if using firestore
)(createStore);

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer, // <- needed if using firestore
  notify: notifyReducer,
  settings: settingsReducer
});

//Check for settings in localStorage
if (localStorage.getItem("settings") == null) {
  //default settings
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };

  //set to local storage
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}
// Create store with reducers and initial state
const initialState = { settings: JSON.parse(localStorage.getItem("settings")) };

const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
