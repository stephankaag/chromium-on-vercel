import Image from "next/image";
import { tmpdir } from "os";
import { join } from "path";
import puppeteer from "puppeteer";

export default async function Home() {
  const image = await getScreenshot();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image
        src={`data:image/png;base64,${image.image.toString("base64")}`}
        alt={image.title}
        width={800}
        height={600}
      />
    </main>
  );
}

async function getScreenshot() {
  const url = `https://news.ycombinator.com`;

  const install = require(`puppeteer/internal/node/install.js`).downloadBrowser;
  await install();

  const browser = await puppeteer.launch({
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--single-process"],
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto(url);

  const [image, title] = await Promise.all([page.screenshot(), page.title()]);

  await page.close();
  await browser.close();

  return {
    title: title,
    image: image,
  };
}
