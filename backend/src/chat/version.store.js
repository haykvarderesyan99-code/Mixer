import fs from "fs/promises";
import path from "path";

const FILE = path.join(process.cwd(), "backend-data", "chatVersions.json");

async function ensureFile() {
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, JSON.stringify({}), "utf8");
  }
}

export async function getVersion(chatId) {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf8");
  const data = JSON.parse(raw || "{}");
  return data[String(chatId)] || "Gemini";
}

export async function setVersion(chatId, version) {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf8");
  const data = JSON.parse(raw || "{}");
  data[String(chatId)] = version;
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
  return version;
}

export default { getVersion, setVersion };
