import {
  DATASET_UPLOAD_REQUEST,
  DATASET_UPLOAD_SUCCESS,
  DATASET_UPLOAD_FAIL,
  DATASET_UPLOAD_RESET,
} from "../constants/DatasetUploadConstants";

export const datasetUploadReducer = (state = {}, action) => {
  switch (action.type) {
    case DATASET_UPLOAD_REQUEST:
      return {
        loading: true,
      };
    case DATASET_UPLOAD_SUCCESS:
      return {
        loading: false,
        datasetUpload: action.payload,
      };
    case DATASET_UPLOAD_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case DATASET_UPLOAD_RESET:
      return {};
    default:
      return state;
  }
};
