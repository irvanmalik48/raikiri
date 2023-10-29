import fs from "fs/promises";

export async function checkDir(dir: string) {
  try {
    await fs.access(dir);
    return true;
  } catch (err) {
    return false;
  }
}
