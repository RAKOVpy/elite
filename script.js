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

// ===== Карусель «НАМ ДОВЕРЯЮТ»: бесконечная автопрокрутка + перетаскивание мышью =====
let slider = document.querySelector('.partners-container');
let partnersList = slider ? slider.querySelector('.partners-list') : null;

if (slider && partnersList) {
    const AUTO_SPEED = 0.6;   // пикселей за кадр — скорость автопрокрутки
    const DRAG_SPEED = 1.5;   // множитель скорости перетаскивания

    // Дублируем логотипы, чтобы прокрутка была бесшовной (зацикленной):
    // как только первый набор ушёл влево, его место занимает точная копия.
    let originalItems = Array.from(partnersList.children);
    let firstClone = null;
    for (let item of originalItems) {
        let clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true'); // копии не нужны скринридерам
        partnersList.appendChild(clone);
        if (!firstClone) firstClone = clone;
    }

    // Ширина одного полного набора логотипов — на неё зацикливаем прокрутку.
    // Считаем как расстояние между первым оригиналом и его первой копией,
    // чтобы не зависеть от отступов и внутренней геометрии.
    let singleWidth = 0;
    function measure() {
        singleWidth = firstClone.offsetLeft - originalItems[0].offsetLeft;
    }
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(measure); // шрифт Roboto подгружается асинхронно
    }

    // Держим scrollLeft в пределах одного набора — за счёт копий это выглядит
    // как бесконечная лента и работает в обе стороны (в т.ч. при перетаскивании назад).
    function normalizeScroll() {
        if (singleWidth <= 0) return;
        if (slider.scrollLeft >= singleWidth) {
            slider.scrollLeft -= singleWidth;
        } else if (slider.scrollLeft <= 0) {
            slider.scrollLeft += singleWidth;
        }
    }

    let isDragging = false; // тянем мышкой (или пальцем) — на это время автопрокрутка на паузе
    let lastX = 0;

    // Цикл автопрокрутки: пока не перетаскиваем — плавно двигаем ленту.
    function tick() {
        if (!isDragging) {
            slider.scrollLeft += AUTO_SPEED;
        }
        normalizeScroll();
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // --- Перетаскивание мышью ---
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;              // останавливаем автопрокрутку
        slider.classList.add('active');
        lastX = e.pageX;
        e.preventDefault();             // не выделяем текст и не тащим элементы
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        // Двигаем ленту вслед за курсором: считаем сдвиг относительно прошлого кадра,
        // поэтому бесшовный перескок через край не сбивает позицию.
        const delta = (e.pageX - lastX) * DRAG_SPEED;
        lastX = e.pageX;
        slider.scrollLeft -= delta;
        normalizeScroll();
    });

    function stopDrag() {
        if (!isDragging) return;
        isDragging = false;             // отпустили мышь — лента снова крутится
        slider.classList.remove('active');
    }
    slider.addEventListener('mouseup', stopDrag);
    slider.addEventListener('mouseleave', stopDrag);

    // --- Пальцем на тач-устройствах: даём нативной прокрутке работать,
    // а автопрокрутку ставим на паузу, чтобы она не мешала свайпу. ---
    slider.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });
    slider.addEventListener('touchend', () => { isDragging = false; });
    slider.addEventListener('touchcancel', () => { isDragging = false; });
}

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
