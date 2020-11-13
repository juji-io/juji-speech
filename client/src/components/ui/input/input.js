/***
 * 
 * author: Wenhao Zhang
 * 
 */


import React from "react";

import styles from "./input.module.css";

const Input = (props) => {
  const inputClasses = [];

  if (props.invalid && props.touched && props.elemenType !== "radio") {
    inputClasses.push(styles.Invalid);
  }

  let inputElement = null;

  switch (props.elementType) {
    case "text":
      inputClasses.push(styles.Text);
      inputElement = (
        <input
          className={inputClasses.join(" ")}
          value={props.value}
          {...props.elementConfig}
          onChange={props.changed}
          disabled={props.disabled}
        />
      );
      break;
    case "radio":
      inputElement = props.sub.map((sub) => {
        inputClasses.push(styles.Radio);

        let hidden = null;

        if (sub.hidden && props.selected === "Other") {
          hidden = (
            <div className={styles.Hidden}>
              <Input
                changed={(event) => props.changed(event, true)}
                elementConfig={{
                  type: "text",
                  placeholder: sub.hidden.placeholder,
                }}
                invalid={props.invalid}
                touched={props.touched}
                value={props.value}
                elementType={"text"}
                after={sub.hidden.after}
                disabled={props.disabled}
              />
            </div>
          );
        }

        return (
          <div key={sub.label}>
            <input
              className={inputClasses.join(" ")}
              value={sub.value}
              checked={props.selected === sub.value}
              onChange={props.changed}
              {...props.elementConfig}
              disabled={props.disabled}
            />
            <label className={styles.RadioLabel} htmlFor={sub.value}>
              {sub.label}
            </label>
            {hidden}
          </div>
        );
      });
      break;
    default:
      inputElement = (
        <input
          className={inputClasses.join(" ")}
          value={props.value}
          {...props.elementConfig}
          onChange={props.changed}
          disabled={props.disabled}
        />
      );
      break;
  }

  return (
    <div className={styles.Input}>
      {props.label && <p className={styles.Label}>{props.label}</p>}
      {inputElement}
      {props.after && <p className={styles.After}>{props.after}</p>}
    </div>
  );
};

export default Input;
