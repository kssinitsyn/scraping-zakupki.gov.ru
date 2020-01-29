const fs = require("fs");

const Nightmare = require("nightmare");
const cheerio = require("cheerio");

const nightmare = Nightmare({ show: true });

// Целевой URL для поиска отчета по договорам
const url =
  "https://zakupki.gov.ru/epz/contractreporting/quicksearch/search.html";

// Целевой ИНН (Поиск осуществляется по ИНН), нужно реализовать цикл по поиску по массиву предприятий
const target = "5027130207";

// Создаем папку для данных
fs.mkdirSync('data');

// Погнали скрапить
// Грузим страницу, вводим ИНН и жмем на поиск
nightmare
  .goto(url)
  .wait("body")
  .type("#searchString", target)
  .click('div.searchField input[type="button"]')
  .wait("body")
  .evaluate(() => document.querySelector("body").innerHTML)
  .end()
  .then(response => {
    getData(response);
  });

// Получив данные, обрабатываем
let getData = html => {
  const data = [];
  const $ = cheerio.load(html);
  $(
    "div.contractreporting div.registerBox table tbody tr td.descriptTenderTd"
  ).each((i, elem) => {
    let title = $(elem)
      .find("dl dt a")
      .text();
    let description = $(elem)
      .find("dl dd")
      .text();
    let date = $(elem)
      .find("dl:nth-child(2) dd")
      .text();
    data.push({
      index: i,
      inn: target,
      title: title.replace(/\s+/g,''),
      date: date,
      description: description
    });
  });
  // Записываем в файл, надо прикрутить гугл таблицу, так будет интересней
  fs.writeFileSync("./data/data.json", JSON.stringify(data), "utf-8");
  return data;
};
