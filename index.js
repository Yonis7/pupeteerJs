const puppeteer = require('puppeteer')
const fs = require('fs/promises')

async function start() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://learnwebcode.github.io/practice-requests/');
  
  const names = await page.evaluate(() => {
  return Array.from(document.querySelectorAll(".info strong")).map( name => name.textContent)
  });

  await fs.writeFile('colors.txt', names.join("\r\n"));

  await page.click("#clickme");
  const clickedData = await page.$eval("#data", (el) => el.textContent);
  console.log(clickedData);

  const photos = await page.$$eval("img", (imgs) => {
    return imgs.map( x => x.src)
  });

  for (const currentPhoto of photos) {
    const imgPage = await page.goto(currentPhoto);
    await fs.writeFile(currentPhoto.split("/").pop(), await imgPage.buffer())

  }

  await browser.close();
}
  start();