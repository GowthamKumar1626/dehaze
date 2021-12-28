import React from "react";
import { connect } from "react-redux";
import { Chart } from "react-google-charts";

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

const mapStateToProps = (state) => ({
  imageUpload: state.imageUploadReducer.imageUpload,
});

export default connect(mapStateToProps)(Charts);
