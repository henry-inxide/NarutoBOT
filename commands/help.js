const fs = require("fs");
const path = require("path");

module.exports = {
  name: "help",
  description: "Stylish command list dikhata hai (Credit: HENRY-X)",
  async execute(api, event) {
    try {
      const commandsPath = path.join(__dirname);
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

      let helpMessage = "🌌 ───── 𝗛𝗘𝗡𝗥𝗬-𝗫 𝗕𝗢𝗧 ───── 🌌\n\n";
      helpMessage += "⚡ 𝗔𝗟𝗟 𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ⚡\n\n";

      for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if (command.name && command.description) {
          helpMessage += `🟢 𝗖𝗠𝗗: ${command.name.toUpperCase()}\n💡 ${command.description}\n━━━━━━━━━━━━━━━\n`;
        }
      }

      helpMessage += "\n👑 𝗖𝗥𝗘𝗗𝗜𝗧𝗦: HENRY-X";
      helpMessage += "\n🚀 Stay Connected | More Features Coming Soon!";

      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } catch (err) {
      api.sendMessage("❌ [HENRY-X] Stylish Help command error!", event.threadID);
      console.error("help.js error:", err);
    }
  },
};
