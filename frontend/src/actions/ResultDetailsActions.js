import {
  GET_RESULT_REQUEST,
  GET_RESULT_SUCCESS,
  GET_RESULT_FAIL,
} from "../constants/ResultConstants";
import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const getImageResult = (params) => async (dispatch) => {
  try {
    dispatch({
      type: GET_RESULT_REQUEST,
    });

    const { data } = await axios.get(
      `/api/results/record/${params.guid}/`,
      config
    );

    dispatch({
      type: GET_RESULT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_RESULT_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
