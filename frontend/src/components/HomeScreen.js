import React from "react";

import UploadFile from "./UploadFile";
import DatasetResults from "./DatasetResults";
import Charts from "./Charts";
import Result from "./Result";
function HomeScreen(props) {
  const [showDataset, setShowDataset] = React.useState(false);

  const handleDatasetViewver = (event) => {
    event.preventDefault();
    setShowDataset(!showDataset);
  };
  return (
    <div className="ps-3">
      <div className="row">
        <div className="col-2">
          <UploadFile />
        </div>
        <div className="col-8">
          {!showDataset && (
            <div>
              <Result />
              <br />
              <Charts />
            </div>
          )}
          {showDataset && <DatasetResults />}
        </div>
        <div className="col-2">
          <button
            className="btn btn-secondary w-100"
            onClick={handleDatasetViewver}
          >
            Show dataset results
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
