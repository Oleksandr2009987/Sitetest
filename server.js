const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Для отдачи фронтенд-части из папки public

// Маршрут для добавления новости
app.post('/add-news', (req, res) => {
    const news = req.body; // Получаем данные новости из тела запроса

    // Читаем файл, если он существует
    fs.readFile('newsData.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }

        let newsData = [];
        if (data) {
            newsData = JSON.parse(data); // Парсим данные из файла
        }

        // Добавляем новую новость в массив
        newsData.push(news);

        // Сохраняем обновленные данные в файл
        fs.writeFile('newsData.json', JSON.stringify(newsData, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи в файл');
            }

            res.status(200).send('Новина додана');
        });
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
