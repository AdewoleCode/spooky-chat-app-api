const express = require("express");
const app = express();
require("dotenv").config();

const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoute");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const connectDB = require("./DB/connect");

const bodyParser = require("body-parser");
const cors = require("cors");
const socket = require("socket.io");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3030;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("connected");
  } catch (error) {
    console.log(error);
  }
};

const server = app.listen(port, () =>
  console.log(`Server is listening on port ${port}...`)
);

start();

const io = socket(server, {
  cors: {
    origin: "https://spooky-chat-app.onrender.com",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
