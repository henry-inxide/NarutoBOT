import axios from "axios";

const OWNER_ID = "1000123456789"; // ✅ Apna FB UID Yaha Dalo
let activeFytSessions = {};

export default {
  name: "fyt",
  description: "Spam messages using EAAD token (Owner Only, Credit: HENRY-X)",
  async execute(api, event) {
    const userID = event.senderID;

    // ✅ Owner Check
    if (userID !== OWNER_ID) {
      api.sendMessage("⛔ Access Denied! Sirf owner fyt use kar sakta hai.", event.threadID);
      return;
    }

    if (!activeFytSessions[userID]) {
      activeFytSessions[userID] = { step: "token" };
      api.sendMessage("🔑 Apna EAAD token bhejo:", event.threadID);
      return;
    }

    const session = activeFytSessions[userID];

    if (session.step === "token") {
      const token = event.body.trim();
      if (!token.startsWith("EAAD")) {
        api.sendMessage("❌ Invalid Token! Sirf EAAD token accept hoga.", event.threadID);
        delete activeFytSessions[userID];
        return;
      }
      session.token = token;
      session.step = "thread";
      api.sendMessage("🧵 Thread ID bhejo jisme spam karna hai:", event.threadID);
      return;
    }

    if (session.step === "thread") {
      session.threadID = event.body.trim();
      session.step = "delay";
      api.sendMessage("⏳ Delay (ms) bhejo (e.g. 1000 for 1s):", event.threadID);
      return;
    }

    if (session.step === "delay") {
      session.delay = parseInt(event.body.trim());
      session.step = "hatername";
      api.sendMessage("😈 Hater ka naam bhejo:", event.threadID);
      return;
    }

    if (session.step === "hatername") {
      session.hater = event.body.trim();
      session.step = "ready";
      api.sendMessage(
        `✅ Config Ready!\n\n🔑 Token: ✅\n🧵 Thread: ${session.threadID}\n⏳ Delay: ${session.delay}ms\n😈 Hater: ${session.hater}\n\n✍ Type 'start' to begin or 'stop' to cancel.`,
        event.threadID
      );
      return;
    }

    if (session.step === "ready") {
      if (event.body.toLowerCase() === "start") {
        session.running = true;
        api.sendMessage("🚀 Fyt Started! Type 'stop' to end.", event.threadID);

        const spamLoop = async () => {
          if (!session.running) return;

          try {
            await axios.post(
              `https://graph.facebook.com/v15.0/${session.threadID}/messages`,
              { message: `🔥 ${session.hater}🔥` },
              { headers: { Authorization: `Bearer ${session.token}` } }
            );
            console.log(`[FYT] Sent message to ${session.threadID}`);
          } catch (err) {
            console.error("[FYT] Error:", err.response?.data || err.message);
          }

          setTimeout(spamLoop, session.delay);
        };

        spamLoop();
      }

      if (event.body.toLowerCase() === "stop") {
        session.running = false;
        delete activeFytSessions[userID];
        api.sendMessage("🛑 Fyt Stopped!", event.threadID);
      }
    }
  },
};
