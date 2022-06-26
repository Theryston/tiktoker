import fs from "fs";
import path from "path";

export async function handleRawFilePath({
  outputBasePath,
}: {
  outputBasePath: string;
}) {
  if (fs.existsSync(path.join(outputBasePath, "video"))) {
    fs.rmdirSync(path.join(outputBasePath, "video"), { recursive: true });
  }
  fs.mkdirSync(path.join(outputBasePath, "video"));
  fs.mkdirSync(path.join(outputBasePath, "video", "raw"));

  const videoFilePath = path.join(outputBasePath, "video", "raw", "video.mp4");

  const audioFilePath = path.join(outputBasePath, "video", "raw", "audio.mp4");

  return { videoFilePath, audioFilePath };
}
