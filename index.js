import fs from "fs";
import path from "path";
import login from "fca-unofficial";

const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
const appState = JSON.parse(fs.readFileSync("./appstate.json", "utf-8"));

// 🔹 Load Commands
const commands = new Map();
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));
for (const file of commandFiles) {
  const { default: cmd } = await import(`./commands/${file}`);
  commands.set(cmd.name, cmd);
}

login({ appState }, (err, api) => {
  if (err) return console.error("❌ Login Error:", err);

  console.log(`${config.botName} logged in ✅`);

  api.listenMqtt(async (err, event) => {
    if (err) return console.error(err);
    if (!event.body) return;

    if (!event.body.startsWith(config.prefix)) return;
    const args = event.body.slice(config.prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const cmd = commands.get(cmdName);
    if (!cmd) return;

    try {
      await cmd.run({ api, event, args });
    } catch (e) {
      api.sendMessage(`⚠ Error: ${e.message}`, event.threadID);
    }
  });
});
