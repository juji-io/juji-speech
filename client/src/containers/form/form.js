import React, { useState, useContext } from "react";

import Input from "../../components/ui/input/input";

import { ChatContext } from "../../context/chat/chatContext";

const Home = (props) => {
  const context = useContext(ChatContext);

  const voiceGenders = ["Male", "Female"];
  const demoBots = [
    {
      url: "https://juji.ai/pre-chat/5f0507d9-2b2f-4e20-9710-df52904ca0d0",
      type: "Medical Assistant",
    },
  ];

  const [name, setName] = useState({ value: "", valid: false, touched: false });
  const [gender, setGender] = useState({
    selected: voiceGenders[0],
    value: voiceGenders[0],
    valid: true,
  });
  const [url, setUrl] = useState({
    selected: demoBots[0].url,
    value: demoBots[0].url,
    valid: true,
    touched: false,
  });

  const inputs = {
    firstName: {
      elementConfig: {
        type: "text",
        placeholder: "Your first name",
      },
      setter: setName,
      value: name,
      label: "First Name",
      elementType: "text",
    },
    url: {
      elementConfig: {
        type: "radio",
      },
      setter: setUrl,
      value: url,
      label: "URL",
      elementType: "radio",
      sub: [
        ...demoBots.map((demoBot) => {
          return {
            value: demoBot.url,
            label: demoBot.type,
          };
        }),
        {
          value: "Other",
          label: "My own chatbot",
          hidden: {
            placeholder: "Your chatbot url",
            after: (
              <>
                Don't have a chatbot yet?{" "}
                <a
                  href={"https://juji.io/signup"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sign up
                </a>{" "}
                to create your own
              </>
            ),
          },
        },
      ],
    },
    gender: {
      elementConfig: {
        type: "radio",
      },
      setter: setGender,
      value: gender,
      label: "Choose a chatbot voice",
      elementType: "radio",
      sub: voiceGenders.map((voiceGender) => {
        return {
          value: voiceGender,
          label: voiceGender,
        };
      }),
    },
  };

  const inputChangeHandler = (event, identifier, hidden) => {
    const value = event.target.value;

    const currValid = value !== "";

    const update = {
      ...inputs[identifier].value,
      value: value === "Other" ? "" : value,
      valid: currValid,
      touched: true,
    };

    if (inputs[identifier].elementType === "radio" && !hidden) {
      update.selected = event.target.value;
    }

    let formIsValid = currValid && value !== "Other";

    for (let input in inputs) {
      if (input !== identifier) {
        formIsValid = inputs[input].value.valid && formIsValid;
      }
    }

    inputs[identifier].setter(update);
    props.setFormIsValid(formIsValid);

    const contextUpdate = {
      firstName: name.value,
      url: url.value,
      gender: gender.value,
    };

    contextUpdate[identifier] = value;

    context.set(contextUpdate);
  };

  const inputForm = Object.keys(inputs).map((key) => {
    const curr = inputs[key];

    return (
      <Input
        key={key}
        label={curr.label}
        changed={(event, hidden) => inputChangeHandler(event, key, hidden)}
        elementConfig={curr.elementConfig}
        invalid={!curr.value.valid}
        touched={curr.value.touched}
        value={curr.value.value}
        selected={curr.value.selected}
        elementType={curr.elementType}
        sub={curr.sub}
        disabled={props.chatting}
      />
    );
  });

  return <>{inputForm}</>;
};

export default Home;
