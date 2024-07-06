import { createServer } from "http";
import { Server } from "socket.io";
export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    const io = new Server(strapi.server.httpServer, {
      cors: {
        // cors setup
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });
    io.on("connection", function (socket) {
      socket.on("join_room", (data: { username: string; room: string }) => {
        const { username, room } = data;
        socket.join(room);
        let __createdtime__ = Date.now();

        // Send message to all users currently in the room, apart from the user that just joined
        socket.to(room).emit("receive_message", {
          message: `${username} has joined the chat room`,
          username: username,
          __createdtime__,
        });
      });
      socket.on("send_message", (data: { username: string; room: string, message: string }) => {
        const { username, message, room } = data;
        let __createdtime__ = Date.now();

        // Send message to all users currently in the room, apart from the user that just joined
        socket.to(room).emit("receive_message", {
          message: message,
          username: username,
          __createdtime__,
        });
      });
    });
  },
};
