import os from "os";

export function getIp(isProd) {
  if (isProd) {
    const interfaces = os.networkInterfaces();
    const interfacesArr = Object.values(interfaces)
      .flat()
      .filter((el) => el.family === "IPv4" && !el.internal)
      .map((el) => el.address);

    const ips = ["localhost", "127.0.0.1", ...interfacesArr];
    const port = 3000;
    // todo: move to env

    return {
      ips: ips,
      port: port,
      cors: _cors(ips, port),
    };
  } else {
    const ips = ["localhost", "127.0.0.1"];
    const port = 3000;
    // used by vite during development phase
    const devPort = 5173;

    return {
      ips: ips,
      port: port,
      cors: _cors(ips, devPort),
    };
  }

  function _cors(ips, port) {
    return ips.map(ip => "http://" + ip + ":" + port);
  }
};