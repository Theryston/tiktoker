import fs from "fs";
import { getVideoAndAudioUrl } from "./getVideoAndAudioUrl";
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
        const { videoUrl, audioUrl } = await getVideoAndAudioUrl(netflixLink);

        ctx.getVideoAndAudio.videoUrl = videoUrl;
        ctx.getVideoAndAudio.audioUrl = audioUrl;
      },
    },
    {
      title: "Creating raw folder",
      task: async (ctx) => {
        const { videoFilePath, audioFilePath } = await handleRawFilePath();

        ctx.getVideoAndAudio.videoFilePath = videoFilePath;
        ctx.getVideoAndAudio.audioFilePath = audioFilePath;
      },
    },
    {
      title: "Requesting video and audio",
      task: async (ctx) => {
        const { audioResponse, videoResponse } = await requestVideoAndAudio({
          audioUrl: ctx.getVideoAndAudio.audioUrl,
          videoUrl: ctx.getVideoAndAudio.videoUrl,
        });

        ctx.getVideoAndAudio.audioResponse = audioResponse;
        ctx.getVideoAndAudio.videoResponse = videoResponse;
      },
    },
    {
      title: "Saving video and audio",
      task: async (ctx) => {
        ctx.getVideoAndAudio.audioFile = fs.createWriteStream(
          ctx.getVideoAndAudio.audioFilePath
        );
        ctx.getVideoAndAudio.videoFile = fs.createWriteStream(
          ctx.getVideoAndAudio.videoFilePath
        );

        ctx.getVideoAndAudio.audioResponse.data.pipe(
          ctx.getVideoAndAudio.audioFile
        );
        ctx.getVideoAndAudio.videoResponse.data.pipe(
          ctx.getVideoAndAudio.videoFile
        );

        ctx.videoFilePath = ctx.getVideoAndAudio.videoFilePath;
        ctx.audioFilePath = ctx.getVideoAndAudio.audioFilePath;
      },
    },
  ]);

  return tasks;
}
