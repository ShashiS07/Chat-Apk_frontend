import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsersList } from "../../redux/slices/chatSlice";
import io from "socket.io-client";

const Chat = () => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]); 
  const [typingUser, setTypingUser] = useState(null);
  const chatRef = useRef(null);
  const socketRef = useRef(null);
  const { users } = useSelector((state) => state.chatSlice);
  const { user } = useSelector((state) => state.authSlice);

  useEffect(() => {
    dispatch(getUsersList());
  }, [dispatch]);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_APP_SOCKET_URL, {
      extraHeaders: { token: localStorage.getItem("token") },
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("adduser", { id: user._id });
    });

    socketRef.current.on("updateOnlineUsers", (onlineUserIds) => {
      setOnlineUsers(onlineUserIds);
    });

    socketRef.current.on("receivemessage", ({ senderId, message }) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [senderId]: [
          ...(prevMessages[senderId] || []),
          { sender: senderId, text: message },
        ],
      }));
    });

    socketRef.current.on("usertyping", ({ senderId, isTyping }) => {
      setTypingUser(isTyping ? senderId : null);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      senderId: user?._id,
      receiverId: selectedUser._id,
      message: newMessage,
    };

    socketRef.current.emit("sendmessage", messageData, (response) => {
      if (response.error) {
        console.error("Error sending message:", response.error);
        return;
      }

      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedUser._id]: [
          ...(prevMessages[selectedUser._id] || []),
          { sender: "Me", text: newMessage },
        ],
      }));

      setNewMessage("");
    });
  };

  const handleTyping = () => {
    socketRef.current.emit("typing", {
      senderId: user._id,
      receiverId: selectedUser?._id,
      isTyping: true,
    });
    setTimeout(() => {
      socketRef.current.emit("typing", {
        senderId: user._id,
        receiverId: selectedUser?._id,
        isTyping: false,
      });
    }, 1000);
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 shadow-lg rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>
        {users.map((usr) => (
          <div
            key={usr._id}
            className={`p-3 cursor-pointer border-b flex items-center hover:bg-gray-200 ${
              selectedUser?._id === usr._id ? "bg-gray-300" : ""
            }`}
            onClick={() => setSelectedUser(usr)}
          >
            {/* ✅ Online Indicator */}
            <div
              className={`w-3 h-3 mr-2 rounded-full ${
                onlineUsers.includes(usr._id) ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
            <div>
              <div className="font-semibold">{usr.mobileNumber}</div>
              <div className="text-sm text-gray-500">
                {messages[usr._id]?.length > 0
                  ? messages[usr._id][messages[usr._id].length - 1].text
                  : "No messages yet"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 bg-white border-b font-semibold flex justify-between">
              {selectedUser.mobileNumber}
              {typingUser === selectedUser._id && (
                <span className="text-gray-500 text-sm">Typing...</span>
              )}
            </div>
            <div ref={chatRef} className="flex-1 p-4 overflow-auto bg-gray-100">
              {(messages[selectedUser._id] || []).map((msg, index) => (
                <div
                  key={index}
                  className={`flex mb-2 ${
                    msg.sender === "Me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.sender === "Me"
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white border-t flex items-center">
              <input
                type="text"
                className="flex-1 border p-2 rounded-lg"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
