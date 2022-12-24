#!/usr/local/bin/node
const puppeteer = require('puppeteer');
const fs = require('fs');

console.log('Downloading Windy.com images...');
const folder = '/Users/lukestorry/Pictures/wallpaper/';

const dateFilter = new Date(Date.now() - 86400000 * 3)
const files = fs.readdirSync(folder)
    .filter(filename => filename.endsWith('.png'))
    .filter(filename => new Date(filename.split('.')[0]) < dateFilter);
if (files.length > 0) {
    files.forEach(filename => fs.renameSync(folder + filename, folder + 'old/' + filename))
    console.log(`Archived ${files.length} images older than ${dateFilter.toDateString()}`);
}

const width = 3200, height = 2000, clip = { x: 400, y: 160, width: width - 500, height: height - 300, };
puppeteer.launch().then(async (browser) => {
    const page = await browser.newPage();
    await page.setViewport({ width: width, height: height });
    await page.goto('https://www.windy.com/?54.828,-22.400,6', { waitUntil: ['networkidle0', 'networkidle2'] });
    // for (let i = 0; i < 5; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const path = folder + new Date().toISOString().split('.')[0] + '.png';
    await page.screenshot({ path, clip })
    console.log('Downloaded:', path)
    // }
    await browser.close();
});