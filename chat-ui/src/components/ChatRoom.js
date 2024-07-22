import React, { useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;

const ChatRoom = () => {
  const [publicChats, setPublicChats] = useState([]);
  const [privateChats, setPrivateChats] = useState(new Map());
  const [tab, setTab] = useState("CHATROOM");
  const [userData, setUserData] = useState({
    username: "",
    receiverName: "",
    connected: false,
    message: ""
  });

  function handleUsername(event) {
    const { value } = event.target;
    setUserData({ ...userData, "username": value });
  }

  function registerUser() {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  }

  function onConnected() {
    setUserData({ ...userData, "connected": true });
    stompClient.subscribe('/chatroom/public', onPublicMessageReceived);
    stompClient.subscribe(`/user/${userData.username}/private`, onPrivateMessageReceived);
    userJoined();
  }

  function userJoined() {
    let chatMessage = {
      senderName: userData.username,
      status: "JOIN"
    }
    stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
  }

  function onPublicMessageReceived(payload) {
    const payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case 'JOIN':
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        break;

      case 'MESSAGE':
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        break;
    }
  }

  function onPrivateMessageReceived(payload) {
    const payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
  }

  function onError(error) {
    console.log(error);
  }

  function handleMessage(event) {
    const { value } = event.target;
    setUserData({ ...userData, "message": value });
  }

  function sendPublicMessage() {
    if (stompClient) {
      let chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE"
      }
      stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, "message": "" });
    }
  }

  function sendPrivateMessage() {
    if (stompClient) {
      let chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE"
      }
      if (userData.username !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, "message": "" });
    }
  }

  return (
    <div className='container'>
      {userData.connected ? (
        <div className='chat-box'>
          <div className='member-list'>
            <ul>
              <li onClick={() => { setTab("CHATROOM") }} className={`member ${tab === "CHATROOM" && "active"}`}>ChatRoom</li>
              {[...privateChats.keys()].map((name, index) => (
                <li onClick={() => { setTab(name) }} className={`member ${tab === name && "active"}`} key={index}>
                  <div className='avatar small'>{name[0]}</div> {name}
                </li>
              ))}
            </ul>
          </div>
          <div className='chat-content'>
            <ul className='chat-messages'>
              {tab === "CHATROOM" && publicChats.map((chat, index) => (
                <li className={`message ${chat.senderName === userData.username ? 'self' : ''}`} key={index}>
                  <div className='avatar small'>{chat.senderName[0]}</div>
                  <div className='message-details'>
                    <div className='name'>{chat.senderName}</div>
                    <div className='message-data'>{chat.message}</div>
                  </div>
                </li>
              ))}
              {tab !== "CHATROOM" && [...privateChats.get(tab)].map((chat, index) => (
                <li className={`message ${chat.senderName === userData.username ? 'self' : ''}`} key={index}>
                  <div className='avatar small'>{chat.senderName[0]}</div>
                  <div className='message-details'>
                    <div className='name'>{chat.senderName}</div>
                    <div className='message-data'>{chat.message}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className='send-message'>
              <input type='text' className='input-message' placeholder={tab === "CHATROOM" ? 'Message #public' : `Message #${tab}`} value={userData.message} onChange={handleMessage} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); (tab === "CHATROOM" ? sendPublicMessage : sendPrivateMessage)(); } }} />
              <button type='button' className='send-button' onClick={tab === "CHATROOM" ? sendPublicMessage : sendPrivateMessage}>send</button>
            </div>
          </div>
        </div>
      ) : (
        <div className='register'>
          <input id="user-name" placeholder='Enter your cool name' value={userData.username} onChange={handleUsername} />
          <button type='button' className='register-button' onClick={registerUser}>Join</button>
        </div>
      )}
    </div>
  );
}

export default ChatRoom;