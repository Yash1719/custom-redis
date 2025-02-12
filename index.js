const net = require("net");
const store = {};

function parseRESP(data) {
    const lines = data.toString().trim().split("\r\n"); // Ensure proper splitting
    let index = 0;
  
    function parse() {
      if (index >= lines.length) return null;
      const line = lines[index++];
  
      if (typeof line !== "string") return null; // Ensure it's a string
  
      if (line.startsWith("$")) { // Bulk String
        const length = parseInt(line.slice(1), 10);

        if (isNaN(length) || length < 0) return null; // Handle invalid cases
        return lines[index++] || ""; // Get the value
      } else if (line.startsWith("*")) { // Array (Command like SET name Alice)
        const length = parseInt(line.slice(1), 10);
        if (isNaN(length) || length < 0) return [];
        const array = [];
        for (let i = 0; i < length; i++) {
          array.push(parse()); // Recursively parse array elements
        }
        return array;
      } else if (line.startsWith(":")) { // Integer
        return parseInt(line.slice(1), 10) || 0;
      } else if (line.startsWith("+")) { // Simple String
        return line.slice(1);
      } else if (line.startsWith("-")) { // Error
        throw new Error(line.slice(1));
      }
  
      return null;
    }
  
    return parse();
  }

  
const server = net.createServer((connection) => {
  console.log("Client connected");
  connection.on("data", (data) => {
    try {
      const reply = parseRESP(data);
      console.log("=>", reply);

      if (!Array.isArray(reply)) {
        connection.write("-ERR Invalid command format\r\n");
        return;
      }

      const command = reply[0].toLowerCase();

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
          connection.write(value ? `$${value.length}\r\n${value}\r\n` : "$-1\r\n");
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
    } catch (err) {
      console.log("Parsing error:", err);
      connection.write("-ERR Invalid command\r\n");
    }
  });
});

server.listen(8080, () => console.log(`Custom Redis Server running on port 8080`));

