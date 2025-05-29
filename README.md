# SimpleRedis 🧠🚀

A Redis-like in-memory key-value store built from scratch using TypeScript.

SimpleRedis supports basic commands (`SET`, `GET`, `DEL`, `EXPIRE`, `TTL`), a custom RESP-like protocol, and runs over TCP. It's designed as an educational project to understand how Redis works internally.

---

## ✨ Features

- ✅ In-memory key-value store
- 🧩 Supports basic Redis-like commands: `SET`, `GET`, `DEL`, `EXISTS`
- ⏳ TTL support with `EXPIRE` and `TTL`
- 🔌 TCP server using Node.js `net` module
- 🧵 RESP-like protocol (Redis Serialization Protocol)
- ⚙️ Modular command architecture
- 🧪 Unit and integration tests with Vitest

---

## 📦 Installation

```bash
git clone https://github.com/aylonc22/simple-redis.git
cd simple-redis
npm install
```

---

## 🚀 Running the Server

```bash
npm run dev
```

The server will start on `localhost:6379` (or any port you configure).

---

## 📡 Example Usage

You can use `netcat`, `telnet`, or a custom TCP client to interact with the server.

### ▶️ Example session:
```bash
$ nc localhost 6379
*3
$3
SET
$3
foo
$3
bar
+OK

*2
$3
GET
$3
foo
$3
bar
```

---

## 🧪 Running Tests

```bash
npm run test
```

Unit tests cover individual commands and core components like the parser and in-memory store.

---

## 📂 Project Structure

```
simple-redis/
├── src/
│   ├── server.ts           # TCP server entry
│   ├── parser.ts           # RESP parser
│   ├── commands/           # Command implementations
│   ├── datastore/          # In-memory key-value store logic
│   ├── utils/              # Helper functions (e.g., TTL)
│   └── types.ts            # Shared type definitions
├── test/                   # Unit tests
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠 Supported Commands

| Command   | Description                          |
|-----------|--------------------------------------|
| `SET key value`      | Stores a key with the given value |
| `GET key`            | Retrieves the value for the key   |
| `DEL key`            | Deletes a key                     |
| `EXISTS key`         | Checks if a key exists            |
| `EXPIRE key seconds` | Sets time-to-live on a key        |
| `TTL key`            | Shows remaining time-to-live      |

More commands to come in future updates!

---

## 📘 Learn More

This project is inspired by the original [Redis](https://redis.io) server and designed for educational purposes. It helps developers understand:

- TCP networking
- Protocol parsing
- In-memory data stores
- TTL/expiration mechanics
- Command architecture and routing

---

## 🙌 Contributing

Pull requests are welcome! If you have ideas, suggestions, or bug reports, please open an issue or contribute directly.
