/***
 * 
 * author: Wenhao Zhang
 * 
 */


import React from "react";

export const defaultChatInfo = {
  firstName: "",
  url: "",
  gender: "Male",
  set: () => {},
};

export const ChatContext = React.createContext(defaultChatInfo);
