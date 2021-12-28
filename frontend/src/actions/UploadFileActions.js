import {
  UPLOAD_FILE_REQUEST,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_FAILED,
} from "../constants/UploadFileConstants";
import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const imageUpload = (params) => async (dispatch) => {
  try {
    dispatch({
      type: UPLOAD_FILE_REQUEST,
    });

    const form_data = new FormData();

    form_data.set("original", params.original);

    const { data } = await axios.post(
      "/api/results/record/",
      form_data,
      config
    );

    dispatch({
      type: UPLOAD_FILE_SUCCESS,
      payload: data,
    });

    localStorage.setItem("imageUpload", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: UPLOAD_FILE_FAILED,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
