/***
 * 
 * author: Wenhao Zhang
 * 
 */


import React from "react";

import Text from "./text/text";

import styles from "./messageList.module.css";

const MessageList = (props) => {

  return (
    <div className={styles.MessageWindow}>
      <ul className={styles.MessageList} id="chatList">
        {props.messages.map((message) => {
          return (
            <Text
              key={message.id}
              type={message.type}
              text={message.text}
              user={message.user}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default MessageList;
