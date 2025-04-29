const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Путь к директории с изображениями
const imagesDirectory = path.join(__dirname, 'public', 'images');

// Функция для получения всех файлов и их хешированных имен
const generateFileNames = () => {
    // Читаем все файлы в директории
    const files = fs.readdirSync(imagesDirectory);

    // Массив для хранения оригинальных и хешированных имен
    const fileData = [];

    // Проходим по всем файлам
    files.forEach((file) => {
        // Проверяем, что это файл с изображением (можно добавить проверку по расширению)
        if (fs.statSync(path.join(imagesDirectory, file)).isFile()) {
            // Генерация хеша для имени файла
            const hashedName = crypto.createHash('sha256').update(file).digest('hex').slice(0, 6);

            // Добавляем в массив объект с оригинальным именем и хешированным
            fileData.push({
                original: file,
                hashed: hashedName,
            });
        }
    });

    return fileData;
};

// Пример использования
const fileNames = generateFileNames();
console.log(fileNames);
