const btnLeft = document.querySelector(".btn-left"),
      btnRight = document.querySelector(".btn-right"),
      slider = document.querySelector("#slider"),
      imageInput = document.getElementById("imageInput");

let selectedImageIndex = null;

function loadCarouselImages() {
    const defaultImages = [
        "img/1.png", "img/2.png", "img/3.png", "img/4.png"
    ];

    let index = 0;
    let imageData;
    let loadedImages = [];

    slider.innerHTML = ''; // Limpiar cualquier contenido anterior

    while ((imageData = localStorage.getItem(`image_${index}`)) !== null || index < 4) {
        if (imageData) {
            loadedImages.push(imageData);
        } else {
            loadedImages.push(defaultImages[index]);
        }
        index++;
    }

    loadedImages.forEach((imgSrc, idx) => {
        const section = document.createElement('section');
        section.classList.add('slider-section');
        section.style.backgroundImage = `url(${imgSrc})`;  // Usar imagen como fondo
        section.style.backgroundSize = 'contain';  // Asegurar que la imagen se ajuste completamente dentro del contenedor
        section.style.backgroundPosition = 'center';  // Centrar la imagen
        section.style.backgroundRepeat = 'no-repeat';  // Evitar la repetición

        // Evento para reemplazar imagen
        section.addEventListener('click', () => {
            selectedImageIndex = idx;
            imageInput.click(); // Abrir el selector de archivos
        });

        slider.appendChild(section);
    });

    initializeCarousel();
}

// Reemplazar imagen seleccionada
imageInput.addEventListener('change', function () {
    const file = this.files[0];

    if (file && selectedImageIndex !== null) {
        const reader = new FileReader();
        
        reader.onload = function (event) {
            const section = document.querySelectorAll(".slider-section")[selectedImageIndex];
            section.style.backgroundImage = `url(${event.target.result})`;  // Actualizar la imagen de fondo

            // Guardar la nueva imagen en localStorage
            localStorage.setItem(`image_${selectedImageIndex}`, event.target.result);
        };

        reader.readAsDataURL(file); // Leer la imagen como base64
    }
});

function initializeCarousel() {
    const sliderSections = document.querySelectorAll(".slider-section");
    let operacion = 0, counter = 0;
    let widthImg = 100 / sliderSections.length;

    function moveToRight() {
        if (counter >= sliderSections.length - 1) {
            counter = 0;
            operacion = 0;
            slider.style.transform = `translate(-${operacion}%)`;
            slider.style.transition = "none";
            return;
        }
        counter++;
        operacion = operacion + widthImg;
        slider.style.transform = `translate(-${operacion}%)`;
        slider.style.transition = "all ease 2s";
    }

    function moveToLeft() {
        counter--;
        if (counter < 0) {
            counter = sliderSections.length - 1;
            operacion = widthImg * (sliderSections.length - 1);
            slider.style.transform = `translate(-${operacion}%)`;
            slider.style.transition = "none";
            return;
        }
        operacion = operacion - widthImg;
        slider.style.transform = `translate(-${operacion}%)`;
        slider.style.transition = "all ease .6s";
    }

    btnLeft.addEventListener("click", moveToLeft);
    btnRight.addEventListener("click", moveToRight);

    setInterval(moveToRight, 5000);
}

window.onload = loadCarouselImages;
