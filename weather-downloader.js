#!/usr/local/bin/node
const { formatDistanceToNow, format, parse } = require("date-fns");
const puppeteer = require("puppeteer");
const { readdirSync, renameSync } = require("fs");

const folder = "/Users/lukestorry/Pictures/wallpaper/";
const date = new Date();
const dateFormatString = "yyyy-MM-dd_HHmm-ss.'png'";

const images = readdirSync(folder)
  .filter((filename) => filename.endsWith(".png"))
  .sort()
  .map((filename) => ({ filename, date: parse(filename, dateFormatString, 0) }));

console.log(`Downloading Windy.com images... (${format(Date.now(), "do MMM H:mm")})`);

if (images.length > 0) {
  images.forEach(({ filename }) => renameSync(folder + filename, folder + "old/" + filename));
  console.log(`Archived ${images.length} images, last download was ${formatDistanceToNow(images.at(-1).date)} ago.`);
}

const width = 3400,
  height = 2000,
  clip = { x: 100, y: 150, width: width - 500, height: height - 187 };

puppeteer.launch().then(async (browser) => {
  const page = await browser.newPage();
  await page.setViewport({ width: width, height: height });
  await page.goto("https://www.windy.com/?54.828,-18.400,6", { waitUntil: "networkidle0" });
  await page.click('#playpause');
  console.log(`Loaded page.`);


  for (let i = 0; i < 24; i++) {
    // Let animations load
    await new Promise((resolve) => setTimeout(resolve, 2345));

    // Screenshot
    const path = folder + format(date.setSeconds(i), dateFormatString);
    await page.screenshot({ path, clip });
    console.log("Downloaded:", path);

    // Click play button
    await Promise.all([
      page.click('#playpause.off'),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    // ~ 6 hours forwards
    await new Promise((resolve) => setTimeout(resolve, 1080));

    // Pause
    await page.click('#playpause')
  }
  await browser.close();
});
