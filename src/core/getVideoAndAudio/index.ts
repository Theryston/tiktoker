import fs from "fs";
import { getVideoAndAudioInfoFromUrl } from "./getVideoAndAudioInfoFromUrl";
import { handleRawFilePath } from "./handleRawFilePath";
import { requestVideoAndAudio } from "./requestVideoAndAudio";
import Listr from "listr";

export async function getVideoAndAudio({
  netflixLink,
}: {
  netflixLink: string;
}): Promise<any> {
  const tasks = new Listr([
    {
      title: "Configuring getVideoAndAudio context",
      task: async (ctx) => {
        ctx.getVideoAndAudio = {};
      },
    },
    {
      title: "Getting video and audio url from netflix",
      task: async (ctx) => {
        const { videoUrl, audioUrl, title, subtitle } =
          await getVideoAndAudioInfoFromUrl(netflixLink);

        ctx.getVideoAndAudio.videoUrl = videoUrl;
        ctx.getVideoAndAudio.audioUrl = audioUrl;
        ctx.title = title;
        ctx.subtitle = subtitle;
      },
    },
    {
      title: "Creating raw folder",
      task: async (ctx) => {
        const { videoFilePath, audioFilePath } = await handleRawFilePath({
          outputBasePath: ctx.outputBasePath,
        });

        ctx.getVideoAndAudio.videoFilePath = videoFilePath;
        ctx.getVideoAndAudio.audioFilePath = audioFilePath;
      },
    },
    {
      title: "Downloading video and audio",
      task: async (ctx) => {
        const { audioResponse, videoResponse } = await requestVideoAndAudio({
          audioUrl: ctx.getVideoAndAudio.audioUrl,
          videoUrl: ctx.getVideoAndAudio.videoUrl,
        });

        ctx.getVideoAndAudio.audioFile = fs.writeFileSync(
          ctx.getVideoAndAudio.audioFilePath,
          audioResponse.data
        );
        ctx.getVideoAndAudio.videoFile = fs.writeFileSync(
          ctx.getVideoAndAudio.videoFilePath,
          videoResponse.data
        );

        ctx.audioFilePath = ctx.getVideoAndAudio.audioFilePath;
        ctx.videoFilePath = ctx.getVideoAndAudio.videoFilePath;
      },
    },
  ]);

  return tasks;
}
