import fs from "fs";
import path from "path";

export async function handleTmpFilePath() {
  if (fs.existsSync(path.join(process.cwd(), "movie-file"))) {
    fs.rmdirSync(path.join(process.cwd(), "movie-file"), { recursive: true });
  }
  fs.mkdirSync(path.join(process.cwd(), "movie-file"));
  fs.mkdirSync(path.join(process.cwd(), "movie-file", "tmp"));

  const videoFilePath = path.join(
    process.cwd(),
    "movie-file",
    "tmp",
    "video.mp4"
  );

  const audioFilePath = path.join(
    process.cwd(),
    "movie-file",
    "tmp",
    "audio.mp4"
  );

  return { videoFilePath, audioFilePath };
}
