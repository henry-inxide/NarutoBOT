export default {
  name: "block",
  description: "Predefined IDs ko group me add karega (Credit: HENRY-X)",
  async execute(api, event) {
    try {
      // 🆔 Yaha apne predefined user IDs add karein
      const userIDs = [
        "100089654321234", 
        "100076543219876"
      ];

      api.sendMessage("🔒 [HENRY-X] Adding users to GC...", event.threadID);

      for (const uid of userIDs) {
        api.addUserToGroup(uid, event.threadID, (err) => {
          if (err) {
            api.sendMessage(
              `❌ Failed to add UID ${uid} (Maybe already in GC or privacy issue)`,
              event.threadID
            );
          } else {
            api.sendMessage(`✅ Added UID: ${uid}`, event.threadID);
          }
        });
      }
    } catch (err) {
      api.sendMessage("❌ [HENRY-X] Error while adding users!", event.threadID);
      console.error("block.js error:", err);
    }
  },
};
