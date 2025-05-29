
// Получаем текущий URL
const currentUrl = new URL(window.location.href);

// Получаем значение параметра 'Мой_Запрос'
const myRequest = currentUrl.searchParams.get('Мой_Запрос');

// Задаем dkhash равным значению из GET-запроса или используем значение по умолчанию
const dkhash = myRequest || 'pagedtrtgrfgrg_ded.fff'; // Замените 'default_value' на нужное вам значение по умолчанию

console.log(dkhash);



//const dkhash = 'ansari'; // Замените на ваш запрос
    const apiUrl = `https://api-gallery-srv-js-cr-key.dkon.app/?dkhash=${dkhash}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Проверка на наличие ошибки
            if (data.error) {
                const errorMessageDiv = document.getElementById('error-message');
                errorMessageDiv.innerHTML = "Страница не существует.";
                errorMessageDiv.style.display = 'block';
                return Promise.reject('Пользователь не найден');
            }

            // Установка аватарки по умолчанию
            const defaultAvatar = 'https://res.dkon.app/img/profile_default_photo.png';
            const profileAvatar = data.normalPhotoUrl || defaultAvatar;

            // Отображение профиля
            const profileDiv = document.getElementById('profile');
            profileDiv.innerHTML = `
                <img src="${profileAvatar}" alt="${data.fullname}">
                <div>
                    <h2>${data.fullname}</h2>
                    <p>Галерея: ${data.galleryItemsCount} фото</p>
                </div>
            `;

            // Проверка на количество фотографий и доступность галереи
            if (data.galleryItemsCount > 0) {
                const photoApiUrl = `https://api-photo-srv-js-cr-key.dkon.app/?id=${data.id}`;
                return fetch(photoApiUrl);
            } else {
                // Если нет фотографий
                const noPhotosDiv = document.getElementById('no-photos');
                noPhotosDiv.innerHTML = data.allowShowMyGallery == "1" 
                    ? "Галерея закрыта." 
                    : "Нет фотографий для отображения.";
                noPhotosDiv.style.display = 'block';
                return Promise.reject('Нет доступных фотографий');
            }
        })
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                const gallery = document.getElementById('gallery');
                data.items.forEach(item => {
                    const photoDiv = document.createElement('div');
                    photoDiv.className = 'photo';
                    photoDiv.innerHTML = `
                        <img src="${item.imgUrl}" alt="Фото">
                    `;
                    gallery.appendChild(photoDiv);
                });
            } else {
                                console.error('Ошибка при получении фотографий:', data.error_code);
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
