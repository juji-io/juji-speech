/***
 * 
 * author: Wenhao Zhang
 * 
 */


import React from "react";

import styles from "./button.module.css";

const Button = (props) => {
  return (
    <button
      onClick={props.click}
      className={[
        styles.Button,
        props.selected ? styles.selected : styles.unselected,
      ].join(" ")}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
