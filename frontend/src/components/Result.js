import React from "react";
import { connect } from "react-redux";

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

function Result(props) {
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
}

const mapStateToProps = (state) => ({
  imageUpload: state.imageUploadReducer.imageUpload,
});

export default connect(mapStateToProps)(Result);
