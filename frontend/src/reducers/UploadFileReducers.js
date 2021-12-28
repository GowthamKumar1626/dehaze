import {
  UPLOAD_FILE_REQUEST,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_FAILED,
  UPLOAD_FILE_RESET,
} from "../constants/UploadFileConstants";

export const imageUploadReducer = (state = {}, action) => {
  switch (action.type) {
    case UPLOAD_FILE_REQUEST:
      return {
        loading: true,
      };
    case UPLOAD_FILE_SUCCESS:
      return {
        loading: false,
        imageUpload: action.payload,
      };
    case UPLOAD_FILE_FAILED:
      return {
        loading: false,
        error: action.payload,
      };
    case UPLOAD_FILE_RESET:
      return {};
    default:
      return state;
  }
};
