import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export async function editTheVideo({
  videoFilePath,
  audioFilePath,
  outputFilePath,
}: {
  videoFilePath: string;
  audioFilePath: string;
  outputFilePath: string;
}) {
  const loadPromise = new Promise((resolve, reject) => {
    const videoFile = fs.createReadStream(videoFilePath);
    const proc = ffmpeg()
      .addInput(videoFile)
      .addInput(audioFilePath)
      .format("mp4")
      .save(outputFilePath);
    proc.on("end", () => {
      resolve("done");
    });
    proc.on("error", (err) => {
      reject(err);
    });
  });
  return loadPromise;
}
