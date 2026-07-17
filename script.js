// Находим кнопку-элемент списка и наше модальное окно
let benefitsItems = document.querySelectorAll('.benefits-item');

for (let benefitsItem of benefitsItems) {
    let benefitsButton = benefitsItem.querySelector('.benefits-button');
    let modalOverlay = benefitsItem.querySelector('.modal-overlay');

    // 1. При нажатии на элемент списка — открываем окно
    benefitsButton.addEventListener('click', function (event) {
        event.preventDefault(); // Отменяем стандартное поведение кнопки
        modalOverlay.classList.add('is-open'); // Добавляем класс, который делает его display: flex
    });

    // 2. При нажатии на область ВНЕ окошечка (на темный оверлей) — закрываем его
    modalOverlay.addEventListener('click', function (event) {
        // Проверяем: если кликнули именно по темному фону, а не по белому окну внутри
        if (event.target === modalOverlay) {
            modalOverlay.classList.remove('is-open'); // Убираем класс, окно скрывается
        }
    })
}

let slider = document.querySelector('.partners-container');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    // Высчитываем стартовую позицию курсора мыши относительно контейнера
    startX = e.pageX - slider.offsetLeft;
    // Запоминаем, на сколько изначально был прокручен контейнер
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
    isDown = false;
});

slider.addEventListener('mouseup', () => {
    isDown = false;
});

slider.addEventListener('mousemove', (e) => {
    if (!isDown) return; // Если мышка не зажата, ничего не делаем
    e.preventDefault(); // Отменяем стандартные события браузера (например, случайный переход по ссылке)

    // Считаем текущую позицию мыши и пройденное расстояние
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // Умножаем на 2 для ускорения скролла (скорость можно менять)

    // Двигаем скролл контейнера
    slider.scrollLeft = scrollLeft - walk;
});

// Плавная прокрутка к разделам по клику в шапке
let navLinks = document.querySelectorAll('.navigation-item a');

for (let link of navLinks) {
    link.addEventListener('click', function (event) {
        let targetId = link.getAttribute('href');

        // C якорями вида #section работаем
        if (!targetId || targetId.charAt(0) !== '#' || targetId === '#') return;

        event.preventDefault(); // Отменяем стандартный по якорю

        let target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    });
}
