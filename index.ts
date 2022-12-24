import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const width = 3200, height = 2000;
    await page.setViewport({ width, height });
    await page.goto('https://www.windy.com/?54.828,-22.400,6', { waitUntil: ['networkidle0', 'networkidle2'] });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.screenshot({
        path: `screenshot_.png`,
        clip: {
            x: 400,
            y: 160,
            width: width - 500,
            height: height - 300,
        }
    });

    await browser.close();
})();