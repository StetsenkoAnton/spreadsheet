// import { io } from "socket.io-client";

const serverRoot = "http://localhost:3000";
const serverPath = `${serverRoot}/api/v1/`;
function apiRequest(path) {
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(path, options)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      throw new Error(error);
    });
}
export function getAllFiles() {
  return apiRequest(`${serverPath}document`)
    .then((response) => response)
    .catch((error) => {
      throw new Error(error);
    });
}
export function getTable(name) {
  return apiRequest(`${serverPath}document/${name}`)
    .then((response) => response)
    .catch((error) => {
      throw new Error(error);
    });
}
