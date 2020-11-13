/***
 * 
 * author: Wenhao Zhang
 * 
 */


import React, { useState, useContext, useCallback, useEffect } from "react";

import MessageList from "../../components/chatbox/messageList/messageList";
import Input from "../../components/chatbox/input/input";
import Spinner from "../../components/ui/spinner/spinner";

import useWSS from "../../hooks/useWSS";
import useAudioQueue from "../../hooks/useAudioQueue";
import useMicrophone from "../../hooks/useMicrophone";

import { ChatContext } from "../../context/chat/chatContext";

import styles from "./chat.module.css";

const Chat = () => {
  const { firstName, url, gender } = useContext(ChatContext);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const addToAudioQueue = useAudioQueue();
  const [toggleRecording, recording, isRecording] = useMicrophone();

  const tts = useCallback(
    async (text) => {
      const result = await fetch("/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          gender,
        }),
      });

      const json = await result.json();
      const sound = json.tts;
      addToAudioQueue(sound);
    },
    [gender, addToAudioQueue]
  );

  const handleMessage = useCallback(
    async (incoming) => {
      const data = JSON.parse(incoming.data);

      if ("data" in data && "chat" in data.data) {
        const curr = data.data.chat;

        if (curr.role === "rep" && curr.type === "normal") {
          if (curr.text) {
            const regex = /(<([^>]+)>)/gi;
            const stripped = curr.text.replace(regex, "").trim();

            tts(stripped);

            setMessages((prevMessages) => {
              return [
                ...prevMessages,
                {
                  id: prevMessages.length,
                  text: stripped,
                  type: "other",
                  user: "Chat Bot",
                },
              ];
            });
          }

          if (curr.display) {
            const questions = [];
            curr.display.data.questions.forEach((value) => {
              questions.push(`${value.kind} GUI question: ${value.heading}`);
            }, []);

            setMessages((prevMessages) => {
              let size = prevMessages.length;
              const newMessages = [...prevMessages];

              questions.forEach((question) => {
                tts(question);

                newMessages.push({
                  id: size,
                  text: question,
                  type: "other",
                  user: "Chat Bot",
                });
                size++;
              });

              return newMessages;
            });
          }
        }
      }
    },
    [tts]
  );

  useEffect(() => {
    const chat = document.getElementById("chatList");

    if (chat) {
      chat.scrollTop = chat.scrollHeight;
    }
  });

  const [socket, socketInfo] = useWSS(firstName, url, handleMessage);

  const sendMessage = useCallback(
    (text) => {
      if (!text) {
        return;
      }

      const chatFormat = `
    mutation {
        saveChatMessage(input: {
            type: "normal"
            pid: "${socketInfo.participationId}"
            text: "${text}"
        }) {
            success
        }
    }
    `;

      setMessages((prev) => [
        ...prev,
        { id: prev.length, text, type: "self", user: "You" },
      ]);

      socket.send(chatFormat);
    },
    [socket, socketInfo]
  );

  useEffect(() => {
    if (!recording) {
      return;
    }

    const stt = async () => {
      const formData = new FormData();
      formData.append("audio", recording, new Date().toISOString());

      const result = await fetch("/stt", {
        method: "POST",
        body: formData,
      });

      const json = await result.json();
      const text = json.stt;

      sendMessage(text);
    };

    stt();
  }, [recording, sendMessage]);

  const submitHandler = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  const changeHandler = (e) => {
    setMessage(e.target.value);
  };

  const micControl = (e) => {
    e.preventDefault();
    toggleRecording();
  };

  let render = (
    <>
      <MessageList messages={messages} />
      <Input
        submitHandler={submitHandler}
        changeHandler={changeHandler}
        inputValue={message}
        micControl={micControl}
        recording={isRecording}
      />
    </>
  );

  if (!socket) {
    render = (
      <div className={styles.Spinner}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={styles.Chat} id={"chat-container"}>
      {render}
    </div>
  );
};

export default Chat;
