const Nightmare = require("nightmare");
const cheerio = require("cheerio");
const fs = require("fs");

const nightmare = Nightmare({ show: true });

const url =
  "https://zakupki.gov.ru/epz/contractreporting/quicksearch/search.html";

nightmare
  .goto(url)
  .wait("body")
  .type("#searchString", "5027130207")
  .click('div.searchField input[type="button"]')
  .wait("body")
  .evaluate(() => document.querySelector("body").innerHTML)
  .end()
  .then(response => {
    getData(response);
  });

let getData = html => {
  const data = [];
  const $ = cheerio.load(html);
  $(
    "div.contractreporting div.registerBox table tbody tr td.descriptTenderTd"
  ).each((i, elem) => {
    let title = $(elem)
      .find("dl dt a")
      .text();
    let date = $(elem)
      .find("dl:nth-child(2) dt label")
      .text();
    let description = $(elem)
      .find("dl dt dd")
      .text();
    data.push({
      index: i,
      title: title,
      date: date,
      description: description
    });
  });
  fs.writeFileSync("./data/data.json", JSON.stringify(data), "utf-8");
  return data;
};
