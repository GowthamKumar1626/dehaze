import React from "react";
import { connect } from "react-redux";
import { Chart } from "react-google-charts";

import { getImageResult } from "../actions/ResultDetailsActions";
import DatasetResults from "./DatasetResults";

function Charts(props) {
  const sharpenessData = [
    ["Sharpness", "CEP", "Original", "DCP"],
    [
      "Methods",
      parseFloat(props.imageUpload?.cep_sharpness),
      parseFloat(props.imageUpload?.original_sharpness),
      parseFloat(props.imageUpload?.dcp_sharpness),
    ],
  ];

  const timeData = [
    ["Sharpness", "CEP", "DCP"],
    [
      "Methods",
      parseFloat(props.imageUpload?.cep_time),
      parseFloat(props.imageUpload?.dcp_time),
    ],
  ];

  const options = {
    bar: { groupWidth: "20%" },
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-4">
          {props.imageUpload && (
            <div className="card">
              <div className="card-body">
                <h5 class="card-title">Sharpness</h5>
                <Chart
                  chartType="Bar"
                  width="100%"
                  height="500px"
                  data={sharpenessData}
                  options={options}
                />
              </div>
            </div>
          )}
        </div>
        <div className="col-4">
          {props.imageUpload && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Time</h5>
                <Chart
                  chartType="Bar"
                  width="100%"
                  height="500px"
                  data={timeData}
                  options={options}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ResultCard = (props) => {
  return (
    <div className="card">
      <img className="card-img-top" src={props.image} alt={props.name} />
      <div className="card-body">
        <h4 className="align-center">{props.name}</h4>
        <h5 className="align-center">Sharpness: {props.sharpness}</h5>
        <h5 className="align-center">Time taken: {props.timeTaken}</h5>
      </div>
    </div>
  );
};

const ResultDetails = (props) => {
  return (
    <div className="container">
      {props.imageUpload ? (
        <div className="row">
          <div className="col">
            <ResultCard
              image={props.imageUpload.cep}
              name="cep"
              sharpness={props.imageUpload.cep_sharpness}
              timeTaken={props.imageUpload.cep_time}
            />
          </div>
          <div className="col">
            <ResultCard
              image={props.imageUpload.original}
              name="original"
              sharpness={props.imageUpload.original_sharpness}
              timeTaken={props.imageUpload.original_time}
            />
          </div>
          <div className="col">
            <ResultCard
              image={props.imageUpload.dcp}
              name="dcp"
              sharpness={props.imageUpload.dcp_sharpness}
              timeTaken={props.imageUpload.dcp_time}
            />
          </div>
        </div>
      ) : (
        <div className="row">
          <p>No image to display</p>
        </div>
      )}
    </div>
  );
};

function ResultScreen(props) {
  const [showDataset, setShowDataset] = React.useState(false);

  React.useEffect(() => {
    if (!props.imageResult) {
      props.getImageResult({ guid: props.match.params.id });
    }
  });

  const handleDatasetViewver = (event) => {
    event.preventDefault();
    setShowDataset(!showDataset);
  };
  return (
    <div className="ps-3">
      <div className="row">
        <div className="col-10">
          {!showDataset && (
            <div>
              <ResultDetails imageUpload={props.imageResult} />
              <br />
              <Charts imageUpload={props.imageResult} />
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

const mapStateToProps = (state) => ({
  imageResult: state.resultDetailsReducer.imageResult,
});

const mapDispatchToProps = (dispatch) => ({
  getImageResult: (params) => dispatch(getImageResult(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultScreen);
