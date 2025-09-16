import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

const commands = new Map();

// 🔹 Load all commands from ./commands folder
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const { default: command } = await import(`./commands/${file}`);
  commands.set(command.name, command);
}

app.get("/", (req, res) => {
  res.send(`<h1>${config.botName} is Running ✅</h1>`);
});

// 🔹 Command Handler
app.get("/cmd/:name", async (req, res) => {
  const cmdName = req.params.name.toLowerCase();
  const cmd = commands.get(cmdName);

  if (!cmd) return res.send(`❌ Command "${cmdName}" not found`);
  try {
    const result = await cmd.run(req.query);
    res.send(result);
  } catch (err) {
    res.send(`⚠ Error: ${err.message}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`${config.botName} running on port ${PORT}`));
