const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Чтение файла с новостями
function readNews() {
  const rawData = fs.readFileSync('newsData.json');
  return JSON.parse(rawData);
}

// Запись новостей в файл
function writeNews(news) {
  fs.writeFileSync('newsData.json', JSON.stringify(news, null, 2));
}

// Маршрут для получения всех новостей
app.get('/api/news', (req, res) => {
  const news = readNews();
  res.json(news);
});

// Маршрут для добавления новости
app.post('/api/news', (req, res) => {
  const { title, description, photo } = req.body;
  const news = readNews();
  const newNews = { title, description, photo };
  news.push(newNews);
  writeNews(news);
  res.status(201).json(newNews);
});

// Маршрут для удаления новости по индексу
app.delete('/api/news/:index', (req, res) => {
  const index = req.params.index;
  let news = readNews();
  
  if (index < 0 || index >= news.length) {
    return res.status(400).json({ message: "Новина не найдена" });
  }

  // Удаляем новость по индексу
  news.splice(index, 1);
  writeNews(news);
  
  res.status(200).json({ message: 'Новина удалена успешно' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
