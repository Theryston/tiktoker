import fs from "fs";
import ffmpegPath from "ffmpeg-static";
import cp from "child_process";

export async function editTheVideo({
  videoFilePath,
  audioFilePath,
  outputFilePath,
}: {
  videoFilePath: string;
  audioFilePath: string;
  outputFilePath: string;
}) {
  const audioFile = fs.createReadStream(audioFilePath);
  const videoFile = fs.createReadStream(videoFilePath);
  const outputFile = fs.createWriteStream(outputFilePath);

  let ffmpegProcess: any = cp.spawn(
    ffmpegPath,
    [
      "-loglevel",
      "8",
      "-hide_banner",
      "-i",
      "pipe:3",
      "-i",
      "pipe:4",
      "-map",
      "0:a",
      "-map",
      "1:v",
      "-c",
      "copy",
      "-f",
      "matroska",
      "pipe:5",
    ],
    {
      windowsHide: true,
      stdio: ["inherit", "inherit", "inherit", "pipe", "pipe", "pipe"],
    }
  );

  audioFile.pipe(ffmpegProcess.stdio[3]);
  videoFile.pipe(ffmpegProcess.stdio[4]);
  ffmpegProcess.stdio[5].pipe(outputFile);
}
