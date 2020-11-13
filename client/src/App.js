/***
 * 
 * author: Wenhao Zhang
 * 
 */


import React from "react";

import Home from "./containers/home";

import ChatProvider from "./context/chat/chatProvider";

function App() {
  return (
    <ChatProvider>
      <Home />
    </ChatProvider>
  );
}

export default App;
