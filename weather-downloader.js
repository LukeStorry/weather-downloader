#!/usr/local/bin/node
const { formatDistanceToNow, format, parse, add, differenceInHours } = require("date-fns");
const puppeteer = require("puppeteer");
const { readdirSync, renameSync, unlinkSync } = require("fs");

const folder = "/Users/lukestorry/Pictures/wallpaper/";
const threeDaysAgo = add(Date.now(), { days: -3 });
const dateFormatString = "yyyy-MM-dd_HHmm.'png'";

const images = readdirSync(folder)
  .filter((filename) => filename.endsWith(".png"))
  .sort()
  .map((filename) => ({ filename, date: parse(filename, dateFormatString, 0) }));

console.log(`Downloading Windy.com images... (${format(Date.now(), "do MMM H:m")})`);
console.log(
  `Currently ${images.length} images. ${
    images.length > 0 ? "Last downloaded " + formatDistanceToNow(images.at(-1).date) + " ago" : ""
  }`
);

const old = images.filter(({ date }) => date < threeDaysAgo);
if (old.length > 0) {
  archivable.forEach(({ filename }) => renameSync(folder + filename, folder + "old/" + filename));
  console.log(`Archived ${archivable.length} images older than ${threeDaysAgo.toDateString()}`);
}

const dupes = images.filter(({ date }, i) =>
  images.find(
    ({ date: otherDate }, otherI) => i != otherI && date <= otherDate && differenceInHours(date, otherDate) == 0
  )
);
if (dupes.length > 0) {
  dupes.forEach(({ filename }) => unlinkSync(folder + filename));
  console.log(`Deleted ${dupes.length} images that were duplicates`);
}

const width = 3400,
  height = 2000,
  clip = { x: 160, y: 150, width: width - 500, height: height - 187 };
puppeteer.launch().then(async (browser) => {
  const page = await browser.newPage();
  await page.setViewport({ width: width, height: height });
  await page.goto("https://www.windy.com/?54.828,-20.400,6", {
    waitUntil: ["networkidle0", "networkidle2"],
  });
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const path = folder + format(Date.now(), dateFormatString);
  await page.screenshot({ path, clip });
  console.log("Downloaded:", path);
  await browser.close();
});
