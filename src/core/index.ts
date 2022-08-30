import Listr from "listr";
import path from "path";
import { getVideoAndAudio } from "./getVideoAndAudio";
import { editTheVideo } from "./editTheVideo";

export async function TiktokerCore({
  netflixLink,
  outputBasePath,
}: {
  netflixLink: string;
  outputBasePath: string;
}) {
  if (!netflixLink) {
    console.error("netflixLink is required");
    return;
  }

  if (!outputBasePath) {
    throw new Error("outputBasePath is required");
  }

  const tasks = new Listr([
    {
      title: "Getting video and audio",
      task: async () => {
        return await getVideoAndAudio({ netflixLink });
      },
    },
    {
      title: "Handling output file name",
      task: async (ctx) => {
        ctx.outputFilePath = path.join(
          outputBasePath,
          "video",
          `${ctx.title.replace(/[^a-zA-Z 0-9]/gi, "")}${
            ctx.subtitle.length ? " - " : ""
          }${ctx.subtitle.replace(/[^a-zA-Z 0-9]/gi, "")}.mp4`
        );
      },
    },
    {
      title: "Joining video and audio",
      task: async (ctx) => {
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
    .run({
      outputBasePath,
    })
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
