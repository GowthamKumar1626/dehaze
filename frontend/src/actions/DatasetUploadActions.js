import {
  DATASET_UPLOAD_REQUEST,
  DATASET_UPLOAD_SUCCESS,
  DATASET_UPLOAD_FAIL,
} from "../constants/DatasetUploadConstants";
import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const datasetUpload = (params) => async (dispatch) => {
  try {
    dispatch({
      type: DATASET_UPLOAD_REQUEST,
    });

    const form_data = new FormData();

    form_data.set("dataset", params.dataset);

    const { data } = await axios.post(
      "/api/results/dataset/",
      form_data,
      config
    );

    dispatch({
      type: DATASET_UPLOAD_SUCCESS,
      payload: data,
    });

    localStorage.setItem("datasetUpload", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: DATASET_UPLOAD_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
