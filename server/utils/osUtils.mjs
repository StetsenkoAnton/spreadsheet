import os from "os";

export function getIp() {
  const interfaces = os.networkInterfaces();
  const interfacesArr = Object.values(interfaces).flat();
  return interfacesArr
    .filter((el) => el.family === "IPv4" && !el.internal)
    .map((el) => el.address);
};