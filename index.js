const net = require("net");
const Parser = require("redis-parser");

const store = {};

const server = net.createServer((connection) => {
  console.log("Client connected");

  connection.on("data", (data) => {
    const parser = new Parser({
      returnReply: (reply) => {
        const command = reply[0].toLowerCase(); 
        console.log("=>", reply);

        switch (command) {
          case "set": {
            const key = reply[1];
            const value = reply[2];
            store[key] = value;
            connection.write("+OK\r\n"); 
            break;
          }
          case "get": {
            const key = reply[1];
            const value = store[key];

            if (value === undefined) {
              connection.write("$-1\r\n"); 
            } else {
              connection.write(`$${value.length}\r\n${value}\r\n`); 
            }
            break;
          }
          case "del": {
            const key = reply[1];
            if (store[key] !== undefined) {
              delete store[key];
              connection.write(":1\r\n"); 
            } else {
              connection.write(":0\r\n"); 
            }
            break;
          }
          case "exists": {
            const key = reply[1];
            connection.write(`:${store[key] !== undefined ? 1 : 0}\r\n`);
            break;
          }
          case "keys": {
            const keys = Object.keys(store);
            let response = `*${keys.length}\r\n`;
            keys.forEach((key) => {
              response += `$${key.length}\r\n${key}\r\n`;
            });
            connection.write(response);
            break;
          }
          
          
          default:
            connection.write("-ERR unknown command\r\n"); 
        }
      },
      returnError: (err) => {
        console.log("=> Error:", err);
        connection.write(`-ERR ${err.message}\r\n`);
      },
    });

    try {
      parser.execute(data);
    } catch (err) {
      console.log("Parsing error:", err);
      connection.write("-ERR Invalid command\r\n");
    }
  });
});

server.listen(8080, () =>
  console.log(`Custom Redis Server running on port 8080`)
);
