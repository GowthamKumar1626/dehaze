import React from "react";
import { connect } from "react-redux";
import { FaUpload } from "react-icons/fa";
import Loader from "./Loader";
import Alert from "./Alert";
import { imageUpload } from "../actions/UploadFileActions";
import { datasetUpload } from "../actions/DatasetUploadActions";

function UploadFile(props) {
  const {
    loadingImageUpload,
    errorImageUpload,
    loadingDatasetUpload,
    errorDatasetUpload,
    imageUploadAction,
    datasetUploadAction,
  } = props;

  const onFileChange = (event) => {
    event.preventDefault();
    const params = {
      original: event.target.files[0],
    };
    imageUploadAction(params);
  };

  const onUploadDataset = (event) => {
    event.preventDefault();
    const params = {
      dataset: event.target.files[0],
    };
    datasetUploadAction(params);
  };

  return (
    <div>
      <div className="row">
        <form>
          <label className="btn btn-secondary w-100" htmlFor="upload">
            <input
              id="upload"
              type="file"
              name="imageUpload"
              onChange={onFileChange}
              hidden
            />
            <FaUpload /> Upload Image {loadingImageUpload && <Loader />}
          </label>
        </form>
      </div>
      {errorImageUpload && <Alert variant="danger">{errorImageUpload}</Alert>}

      <br />
      <div className="row">
        <form>
          <label className="btn btn-secondary w-100" htmlFor="uploadDataset">
            <input
              id="uploadDataset"
              type="file"
              name="datasetUpload"
              onChange={onUploadDataset}
              hidden
            />
            <FaUpload /> Upload Dataset {loadingDatasetUpload && <Loader />}
          </label>
        </form>
      </div>
      {errorDatasetUpload && (
        <Alert variant="danger">{errorDatasetUpload}</Alert>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  loadingImageUpload: state.imageUploadReducer.loading,
  errorImageUpload: state.imageUploadReducer.error,

  loadingDatasetUpload: state.datasetUploadReducer.loading,
  errorDatasetUpload: state.datasetUploadReducer.error,
});

const mapDispatchToProps = (dispatch) => ({
  imageUploadAction: (params) => dispatch(imageUpload(params)),
  datasetUploadAction: (params) => dispatch(datasetUpload(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);
