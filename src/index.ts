import Listr from "listr";
import path from "path";
import { createInterface } from "readline";
import { getVideoAndAudio } from "./getVideoAndAudio";
import { editTheVideo } from "./editTheVideo";
import { delay } from "./utils/delay";
import fs from "fs";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// example: https://www.netflix.com/br/clips/81604008?s=a&trkid=13747225&t=cp&vlang=pt
rl.question(
  "Enter the quick laughs link on Netflix (just press enter to load from info.json file): ",
  async (answer) => {
    if (!answer.length) {
      const info = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), "info.json"), "utf8")
      );
      main(info);
    }
    await main({ netflixLink: answer });
    rl.close();
  }
);

async function main({ netflixLink }: { netflixLink: string }) {
  if (!netflixLink) {
    console.error("netflixLink is required");
    return;
  }

  const tasks = new Listr([
    {
      title: "Configuring global context",
      task: async (ctx) => {
        ctx.outputFilePath = path.join(process.cwd(), "video", "result.mp4");
      },
    },
    {
      title: "Getting video and audio",
      task: async () => {
        return await getVideoAndAudio({ netflixLink });
      },
    },
    {
      title: "Joining video and audio",
      task: async (ctx) => {
        await delay(20000);
        const data = await editTheVideo({
          videoFilePath: ctx.videoFilePath,
          audioFilePath: ctx.audioFilePath,
          outputFilePath: ctx.outputFilePath,
        });
        return data;
      },
    },
  ]);

  tasks
    .run()
    .then((ctx) => {
      console.log("\n");
      console.log(
        `Successfully created the movie file at ${ctx.outputFilePath}`
      );
      console.log(
        "==========================================================="
      );
      console.log("More infos:");
      console.log(
        "In the same folder where the video is, there is the raw folder, inside it you can check the audio and video files that have been downloaded, you can delete the raw folder if it is not useful."
      );
    })
    .catch((err) => {
      console.error(err);
    });
}
