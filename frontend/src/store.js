import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { imageUploadReducer } from "./reducers/UploadFileReducers";
import { datasetUploadReducer } from "./reducers/DatasetUploadReducers";
import { resultDetailsReducer } from "./reducers/ResultDetailsReducer";

const reducer = combineReducers({
  imageUploadReducer: imageUploadReducer,
  datasetUploadReducer: datasetUploadReducer,
  resultDetailsReducer: resultDetailsReducer,
});

const imageUpload = localStorage.getItem("imageUpload")
  ? JSON.parse(localStorage.getItem("imageUpload"))
  : null;

const datasetUpload = localStorage.getItem("datasetUpload")
  ? JSON.parse(localStorage.getItem("datasetUpload"))
  : null;

const initialState = {
  imageUploadReducer: { imageUpload: imageUpload },
  datasetUploadReducer: { datasetUpload: datasetUpload },
};
const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
