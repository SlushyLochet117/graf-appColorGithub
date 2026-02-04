const red = document.getElementById("red");
const green = document.getElementById("green");
const blue = document.getElementById("blue");

const redInput = document.getElementById("redInput");
const greenInput = document.getElementById("greenInput");
const blueInput = document.getElementById("blueInput");

const colorPicker = document.getElementById("colorPicker");
const colorBox = document.getElementById("colorBox");
const hexText = document.getElementById("hexColor");
const colorNameText = document.getElementById("colorName");
const historyContainer = document.getElementById("colorHistory");

let history = JSON.parse(localStorage.getItem("colorHistory")) || [];

/* Nombre aproximado del color */
function getColorName(r, g, b) {
    if (r === 0 && g === 0 && b === 0) return "Negro";
    if (r === 255 && g === 255 && b === 255) return "Blanco";
    if (r === 255 && g === 0 && b === 0) return "Rojo";
    if (r === 0 && g === 255 && b === 0) return "Verde";
    if (r === 0 && g === 0 && b === 255) return "Azul";
    if (r === 255 && g === 255 && b === 0) return "Amarillo";
    if (r === 255 && g === 165 && b === 0) return "Naranja";
    if (r === 128 && g === 0 && b === 128) return "Morado";
    return "Color personalizado";
}

function updateHistory(hex) {
    history = history.filter(c => c !== hex);
    history.unshift(hex);
    history = history.slice(0, 5);
    localStorage.setItem("colorHistory", JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyContainer.innerHTML = "";
    history.forEach(hex => {
        const div = document.createElement("div");
        div.className = "history-color";
        div.style.backgroundColor = hex;
        div.onclick = () => {
            const r = parseInt(hex.slice(1,3),16);
            const g = parseInt(hex.slice(3,5),16);
            const b = parseInt(hex.slice(5,7),16);
            updateColor(r,g,b,false);
        };
        historyContainer.appendChild(div);
    });
}

function updateColor(r, g, b, saveHistory = true) {
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    red.value = redInput.value = r;
    green.value = greenInput.value = g;
    blue.value = blueInput.value = b;

    const rgb = `rgb(${r}, ${g}, ${b})`;
    colorBox.style.backgroundColor = rgb;

    const hex =
        "#" +
        r.toString(16).padStart(2, "0") +
        g.toString(16).padStart(2, "0") +
        b.toString(16).padStart(2, "0");

    hexText.textContent = hex.toUpperCase();
    colorPicker.value = hex;
    colorNameText.textContent = getColorName(r, g, b);

    localStorage.setItem("lastColor", JSON.stringify({ r, g, b }));
    if (saveHistory) updateHistory(hex);
}

/* Eventos */
[red, green, blue].forEach(e =>
    e.addEventListener("input", () =>
        updateColor(red.value, green.value, blue.value)
    )
);

[redInput, greenInput, blueInput].forEach(e =>
    e.addEventListener("input", () =>
        updateColor(redInput.value, greenInput.value, blueInput.value)
    )
);

colorPicker.addEventListener("input", () => {
    const hex = colorPicker.value;
    updateColor(
        parseInt(hex.slice(1,3),16),
        parseInt(hex.slice(3,5),16),
        parseInt(hex.slice(5,7),16)
    );
});

/* Inicialización */
const saved = JSON.parse(localStorage.getItem("lastColor"));
saved ? updateColor(saved.r, saved.g, saved.b, false) : updateColor(0,0,0,false);
renderHistory();
