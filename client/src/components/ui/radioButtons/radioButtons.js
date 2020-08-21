import React from "react";

import styles from "./radioButtons.module.css";

const RadioButtons = (props) => {
  return (
    <>
      <div className={styles.Toggle}>
        <div className={styles.ToggleControls}>
          {props.selections.map((selection) => {
            return (
              <div className={styles.Button} key={selection}>

              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default RadioButtons;
