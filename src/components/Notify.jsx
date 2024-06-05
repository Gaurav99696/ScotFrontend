import React from "react";

const Notify = ({ type, text }) => {
  return (
    <div className={type}>
      <div>{text}</div>
      <div>X</div>
    </div>
  );
};

export default Notify;
