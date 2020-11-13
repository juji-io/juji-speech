/***
 * 
 * author: Wenhao Zhang
 * 
 */


import React from "react";

import styles from "./input.module.css";

const Input = (props) => {
  const micClasses = [styles.Mic];

  if (props.recording) {
    micClasses.push(styles.Stop);
  } else {
    micClasses.push(styles.Start);
  }

  return (
    <div className={styles.InputWrapper}>
      <form onSubmit={props.submitHandler} className={styles.InputControls}>
        <input
          className={styles.Input}
          onChange={props.changeHandler}
          value={props.inputValue}
        />

        <button disabled={!props.inputValue} className={styles.Button} >Send</button>

        <button onClick={props.micControl} className={micClasses.join(" ")}>
          <div className={`fa fa-microphone ${styles.Icon}`}></div>
          <span className={styles.MicText}>{!props.recording ? "Click to Speak" : "Click to Stop"}</span>
        </button>
      </form>
    </div>
  );
};

export default Input;
