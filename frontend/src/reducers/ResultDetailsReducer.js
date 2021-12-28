import {
  GET_RESULT_REQUEST,
  GET_RESULT_SUCCESS,
  GET_RESULT_FAIL,
  GET_RESULT_RESET,
} from "../constants/ResultConstants";

export const resultDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_RESULT_REQUEST:
      return {
        loading: true,
      };
    case GET_RESULT_SUCCESS:
      return {
        loading: false,
        imageResult: action.payload,
      };
    case GET_RESULT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case GET_RESULT_RESET:
      return {};
    default:
      return state;
  }
};
