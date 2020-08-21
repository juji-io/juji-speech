import React from "react";

import styles from "./text.module.css";

const Text = (props) => {
  const type = [styles.Text];

  if (props.type === "self") {
    type.push(styles.Self);
  } else {
    type.push(styles.Other);
  }

  return (
    <li className={type.join(" ")}>
      <div className={styles.Msg}>
        <p>{props.user}</p>
        <div className={styles.Message}>{props.text}</div>
      </div>
    </li>
  );
};

export default Text;
