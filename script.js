document.addEventListener('DOMContentLoaded', function() {
    function readLinesFromFile(filename, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', filename, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var lines = xhr.responseText.split('\n');
                callback(lines);
            }
        };
        xhr.send();
    }



    function mergeNames(firstNames, lastNames) {
        var randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)].trim();
        var randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)].trim();
        return `${randomFirstName} ${randomLastName}`;
    }

    function generateRandomLogin(desiredLength) {
        var request = new XMLHttpRequest();
        request.open('GET', 'words_list.txt', false);
        request.send(null);
        var words = request.responseText.split('\n');
        
        var randomWord = words[Math.floor(Math.random() * words.length)];
        var cleanedWord = randomWord.replace(/\s/g, ''); // Убираем все пробелы
        
        // Генерируем случайное количество цифр (от 1 до максимальной длины)
        var randomNumberCount = Math.floor(Math.random() * 6) + 1; // Случайное число от 1 до 6
        var randomNumbers = '';
        for (var i = 0; i < randomNumberCount; i++) {
            randomNumbers += Math.floor(Math.random() * 10); // Генерируем цифру от 0 до 9
        }
        
        var login = '';
        var totalLength = cleanedWord.length + randomNumbers.length;
        
        // Добавляем слово и цифры в случайном порядке
        while (login.length < totalLength) {
            if (Math.random() < 0.5 && cleanedWord.length > 0) {
                login += cleanedWord[0];
                cleanedWord = cleanedWord.slice(1);
            } else if (randomNumbers.length > 0) {
                login += randomNumbers[0];
                randomNumbers = randomNumbers.slice(1);
            }
        }
        
        if (desiredLength !== undefined) {
            if (login.length > desiredLength) {
                return login.slice(0, desiredLength);
            } else {
                while (login.length < desiredLength) {
                    var additionalWord = words[Math.floor(Math.random() * words.length)];
                    var cleanedAdditionalWord = additionalWord.replace(/\s/g, '');
                    login += cleanedAdditionalWord;
                }
                return login.slice(0, desiredLength);
            }
        }
        
        return login;
    }

    function generateRandomPassword(length) {
        var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?";
        var password = "";
        for (var i = 0; i < length; i++) {
            var randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }



    var generateButton = document.querySelector('.generate-button');
    generateButton.addEventListener('click', function() {

        var blocks = document.querySelector('.blocks');
        blocks.style.display = 'flex';
        setTimeout(function() {
            var blocks = document.querySelector('.blocks');
            blocks.style.opacity = '1';
        }, 15); 

        var blocks = document.querySelectorAll('.block');
        var loginLengthInput = document.getElementById('loginLengthInput');
        var passwordLengthInput = document.getElementById('passwordLengthInput');
        var loginDesiredLength = loginLengthInput.value !== '' ? parseInt(loginLengthInput.value) : undefined;
        var passwordDesiredLength = passwordLengthInput.value !== '' ? parseInt(passwordLengthInput.value) : undefined;

        readLinesFromFile('words_list.txt', function(words) {
            readLinesFromFile('names_list.txt', function(firstNames) {
                readLinesFromFile('sername_list.txt', function(lastNames) {
                    blocks.forEach(function(block) {
                        var generatedLogin = generateRandomLogin(loginDesiredLength, words);
                        var generatedPassword = generateRandomPassword(passwordDesiredLength || 16);
                        var generatedName = mergeNames(firstNames, lastNames);

                        var loginElement = block.querySelector('.login-wrapper');
                        var passwordElement = block.querySelector('.password-wrapper');
                        var nameElement = block.querySelector('.name-wrapper');

                        loginElement.innerHTML = `<span class="label">Логин:</span><span class="copy-login">${generatedLogin}</span>`;
                        passwordElement.innerHTML = `<span class="label">Пароль:</span><span class="copy-password">${generatedPassword}</span>`;
                        nameElement.innerHTML = `<span class="label">Имя Фамилия:</span><span class="copy-name">${generatedName}</span>`;


                        // Добавляем обработчики клика для копирования значений
                        loginElement.addEventListener('click', function() {
                            copyToClipboard(generatedLogin);
                        });

                        passwordElement.addEventListener('click', function() {
                            copyToClipboard(generatedPassword);
                        });

                        nameElement.addEventListener('click', function() {
                            copyToClipboard(generatedName);
                        });
                    });
                });
            });
        });
    });

    function copyToClipboard(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
});

