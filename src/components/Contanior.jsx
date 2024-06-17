import React from "react";

const Contanior = ({ otherClass, children }) => {
  return <div className={`Contanior ${otherClass}`}>{children}</div>;
};

export default Contanior;
