import React from "react";
import { connect } from "react-redux";

const TableRow = (props) => {
  return (
    <tr>
      <th scope="row">
        <a
          className="link-secondary"
          target="_blank"
          rel="noreferrer"
          href={`/${props.item.guid}`}
        >
          {props.item.guid}
        </a>
      </th>
      <td>{props.item.original_sharpness}</td>
      <td>{props.item.cep_sharpness}</td>
      <td>{props.item.dcp_sharpness}</td>
      <td>{props.item.cep_time}</td>
      <td>{props.item.dcp_time}</td>
    </tr>
  );
};

function DatasetResults(props) {
  return (
    <div className="container">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Result ID</th>
            <th scope="col">Original Sharpness</th>
            <th scope="col">CEP Sharpness</th>
            <th scope="col">DCP Sharpness</th>
            <th scope="col">CEP Time</th>
            <th scope="col">DCP Time</th>
          </tr>
        </thead>
        <tbody>
          {props.datasetUpload?.map((item, index) => {
            return <TableRow item={item} index={index} key={index} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

const mapStateToProps = (state) => ({
  datasetUpload: state.datasetUploadReducer.datasetUpload,
});

export default connect(mapStateToProps)(DatasetResults);
