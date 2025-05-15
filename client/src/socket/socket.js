import io from "socket.io-client";
const isDevelopment = import.meta.env.MODE === "development";
let SOCKET_URL;
if (isDevelopment) {
  SOCKET_URL = "http://localhost:8080";
} else {
  SOCKET_URL = "/";
}

let socket = null;

export const initializeSocket = (userId) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    auth: { userId },
  });
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
