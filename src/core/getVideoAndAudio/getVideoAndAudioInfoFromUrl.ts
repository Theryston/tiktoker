import puppeteer from "puppeteer";

export async function getVideoAndAudioInfoFromUrl(netflixLink: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44"
  );
  await page.goto(netflixLink);

  const response = await page.waitForResponse(
    (response) =>
      response.url().indexOf("https://www.netflix.com/playapi") !== -1
  );

  const body = await response.json();
  const audioUrl = body.result.audio_tracks[0].streams[0].urls[0].url;
  const videoMaxCroppedWidth = body.result.video_tracks[0].maxCroppedWidth;
  const videoUrl = body.result.video_tracks[0].streams.find(
    (stream: any) => stream.crop_w === videoMaxCroppedWidth
  ).urls[0].url;
  const title = await page.evaluate(() => {
    const title: any = document.querySelector(".modal-header-title");
    return title.innerText;
  });
  const subtitle = await page.evaluate(() => {
    const subtitle: any = document.querySelector(".modal-header-subtitle");
    if (subtitle) return subtitle.innerText;
    return "";
  });

  await browser.close();

  return { videoUrl, audioUrl, title, subtitle };
}
