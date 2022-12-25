# Weather Downloader

Simple node script to download and archive images for a auto-refreshing weather desktop background, using puppeteer to screenshot from [windy.com](windy.com), and a mac launchctl plist to auto-run on the hour.

![weather screenshot](./screenshot.png)

## Installation

```bash
chmod +x ./weather-downloader.js
mkdir -p ~/Library/LaunchAgents
cp ./local.WeatherDownloader.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/local.WeatherDownloader.plist
launchctl enable gui/$(id -u)/local.WeatherDownloader.plist
```

## Run

```bash
yarn start
```

or

```bash
launchctl start local.WeatherDownloader
```

## Remove

Unload via

```bash
launchctl remove local.WeatherDownloader
```
