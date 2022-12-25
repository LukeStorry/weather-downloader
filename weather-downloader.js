#!/usr/local/bin/node
const { formatDistanceToNow, format, parse, add, differenceInHours } = require("date-fns");
const puppeteer = require("puppeteer");
const { readdirSync, renameSync } = require("fs");

const folder = "/Users/lukestorry/Pictures/wallpaper/";
const threeDaysAgo = add(Date.now(), { days: -3 });
const dateFormatString = "yyyy-MM-dd_HH-mm.'png'";

const images = readdirSync(folder)
  .filter((filename) => filename.endsWith(".png"))
  .sort()
  .map((filename) => ({ filename, date: parse(filename, dateFormatString, 0) }));

console.log(`Downloading Windy.com images... (${format(Date.now(), "do MMM H:m")})`);
console.log(`Currently ${images.length} images.`);
console.log(`Last downloaded ${formatDistanceToNow(images.at(-1).date)} ago`);

const archivable = images.filter(
  ({ date }, i) =>
    date < threeDaysAgo ||
    images
      .slice(i + 1)
      .find(({ date: otherDate }) => differenceInHours(date, otherDate) < 1 && date <= otherDate)
);

if (archivable.length > 0) {
  archivable.forEach(({ filename }) => renameSync(folder + filename, folder + "old/" + filename));
  console.log(`Archived ${archivable.length} images older than ${threeDaysAgo.toDateString()}`);
}

const width = 3200,
  height = 2000,
  clip = { x: 400, y: 160, width: width - 500, height: height - 300 };
puppeteer.launch().then(async (browser) => {
  const page = await browser.newPage();
  await page.setViewport({ width: width, height: height });
  await page.goto("https://www.windy.com/?54.828,-22.400,6", {
    waitUntil: ["networkidle0", "networkidle2"],
  });
  // for (let i = 0; i < 5; i++) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const path = folder + format(Date.now(), dateFormatString);
  await page.screenshot({ path, clip });
  console.log("Downloaded:", path);
  // }
  await browser.close();
});
