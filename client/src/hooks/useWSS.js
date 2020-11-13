/***
 * 
 * author: Wenhao Zhang
 * 
 */


import { useEffect, useState } from "react";

const useWSS = (firstName, url, handleMessage) => {
  const [socket, setSocket] = useState(null);
  const [socketInfo, setSocketInfo] = useState(null);

  useEffect(() => {
    if (!firstName || !url) {
      return;
    }

    const fetchInfo = async () => {
      const formData = new FormData();
      formData.append("firstName", firstName);

      const options = {
        method: "POST",
        body: formData,
      };

      try {
        const response = await fetch(url, options);
        const chatInfo = await response.json();
        setSocketInfo(chatInfo);
        setSocket(new WebSocket(chatInfo.websocketUrl));
      } catch (error) {
        console.log("Something went wrong");
      }
    };

    fetchInfo();
  }, [firstName, url]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.addEventListener("open", () => {
      const subFormat = `
      subscription {
        chat(input: {
            participationId: "${socketInfo.participationId}"
        }) {
            role
            text
            type
            display{
                data{
                    questions{
                        heading
                        kind
                    }
                }
            }
        }
    }`;
      socket.send(subFormat);
    });

    socket.addEventListener("message", (incoming) => {
      handleMessage(incoming);
    });

    return () => {
      if (!socket) {
        socket.close();
      }
    };
  }, [socket, socketInfo, handleMessage]);

  return [socket, socketInfo];
};

export default useWSS;
