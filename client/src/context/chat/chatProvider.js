import React, { useState } from "react";
import { ChatContext, defaultChatInfo } from "./chatContext";

const ChatProvider = ({ children }) => {
  const set = ({firstName, url, gender}) => {
    setInfo((prevState) => {
      return {
        ...prevState,
        firstName,
        url,
        gender,
      };
    });
  };

  const init = {
    ...defaultChatInfo,
    set,
  };

  const [chatInfo, setInfo] = useState(init);

  return (
    <ChatContext.Provider value={chatInfo}>{children}</ChatContext.Provider>
  );
};

export default ChatProvider;
