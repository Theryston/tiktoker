import Axios from "axios";

export async function requestVideoAndAudio({
  audioUrl,
  videoUrl,
}: {
  audioUrl: string;
  videoUrl: string;
}) {
  const audioResponse = await Axios({
    method: "GET",
    url: audioUrl,
    responseType: "stream",
  });

  const videoResponse = await Axios({
    method: "GET",
    url: videoUrl,
    responseType: "stream",
  });

  return { audioResponse, videoResponse };
}
