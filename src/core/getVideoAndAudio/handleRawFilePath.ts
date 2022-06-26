import fs from "fs";
import path from "path";

export async function handleRawFilePath() {
  if (fs.existsSync(path.join(process.cwd(), "video"))) {
    fs.rmdirSync(path.join(process.cwd(), "video"), { recursive: true });
  }
  fs.mkdirSync(path.join(process.cwd(), "video"));
  fs.mkdirSync(path.join(process.cwd(), "video", "raw"));

  const videoFilePath = path.join(process.cwd(), "video", "raw", "video.mp4");

  const audioFilePath = path.join(process.cwd(), "video", "raw", "audio.mp4");

  return { videoFilePath, audioFilePath };
}
