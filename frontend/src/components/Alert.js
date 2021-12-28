import React from "react";

function Alert({ variant, children }) {
  return (
    <div className={`alert alert-${variant}`} role="alert">
      {children}
    </div>
  );
}

export default Alert;
