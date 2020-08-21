import React, { useState, useEffect } from "react";

import Form from "./form/form";
import Chat from "./chat/chat";

import Button from "../components/ui/button/button";

import styles from "./home.module.css";

const Home = () => {
  const [formIsValid, setFormIsValid] = useState(false);
  const [chatting, setChatting] = useState(false);

  const toggleChat = () => {
    setChatting(!chatting);
  };

  useEffect(() => {
    const container = document.getElementById("container");

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chatting]);

  return (
    <div id={"container"} className={styles.Container}>
      <div className={styles.Spacer}>
        <div className={styles.TitleContainer}>
          <p className={styles.Title}>Chat</p>
        </div>
        <div className={styles.Home}>
          <Form chatting={chatting} setFormIsValid={setFormIsValid} />
          <div className={styles.ControlGroup}>
            <Button
              disabled={!formIsValid}
              click={toggleChat}
              selected={chatting}
            >
              {!chatting ? "Start Chatting" : "Stop Chatting"}
            </Button>
          </div>
        </div>
      </div>

      {chatting && <Chat />}
    </div>
  );
};

export default Home;
