### Custom Redis-like Server

This is a simple Redis-like in-memory key-value store implemented in Node.js. It supports basic Redis commands such as SET, GET, DEL, EXISTS, and KEYS. 
The server communicates over a TCP connection and follows the **Redis serialization protocol (RESP)**

### Features

**SET**: Store a key-value pair. \
**GET**: Retrieve a value by key. \
**DEL**: Delete a key.  \
**EXISTS**: Check if a key exists. \
**KEYS**: List all stored keys.   

 ## Installation
# Prerequisites
# Node.js (v12 or later)

1. **Clone the Repository**
 ```sh
git clone https://github.com/Yash1719/custom-redis.git
cd custom-redis
```
2. **Install Dependencies**
```sh
npm install
 ```
3.  **Start the Server**
  ```sh
  node server.js
  ```
This will start the server on port 8080. \
4. **Connect Using Redis CLI**
In terminal move to the redis directory and run the command for cli-interact:-
```sh
PS C:\Users\YASH> cd D:\Redis-x64-5.0.14.1\
PS D:\Redis-x64-5.0.14.1> .\redis-cli.exe -p 8080
127.0.0.1:8080> 
```
## Examples
```sh
127.0.0.1:8080> SET name Alice
OK
127.0.0.1:8080> GET name
"Alice"
127.0.0.1:8080> DEL name
(integer) 1
127.0.0.1:8080> EXISTS name
(integer) 0
127.0.0.1:8080> KEYS *
(empty list or set)
```

# I am currently building this Redis-like server, and more features will be added soon.
Stay tuned! 
More features coming soon! 🎉






   
