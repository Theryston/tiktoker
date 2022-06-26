import path from "path";
import { createInterface } from "readline";
import fs from "fs";
import { CmvftCore } from "./core";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// example: https://www.netflix.com/br/clips/81604008?s=a&trkid=13747225&t=cp&vlang=pt
rl.question(
  "Enter the quick laughs link on Netflix (just press enter to load from info.json file): ",
  async (answer) => {
    const cwd = process.cwd();

    if (!answer.length) {
      const info = JSON.parse(
        fs.readFileSync(path.join(cwd, "info.json"), "utf8")
      );
      CmvftCore({
        ...info,
        outputBasePath: cwd,
      });
    }
    await CmvftCore({ netflixLink: answer, outputBasePath: cwd });
    rl.close();
  }
);
