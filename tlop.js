window.onload = () => {
    fetch("./tlop1.jpg").then(response => response.blob()).then(blob => updateImage(blob, document.getElementById("image1")));
    fetch("./tlop2.jpg").then(response => response.blob()).then(blob => updateImage(blob, document.getElementById("image2")));
    updateText();
}

function updateText() {
    document.querySelectorAll(".primaryText").forEach(element => {
        element.textContent = document.getElementById("primaryInput").value.toUpperCase();
    });
    document.querySelectorAll(".secondaryText").forEach(element => {
        element.textContent = document.getElementById("secondaryInput").value.toUpperCase();
    });
    document.querySelectorAll(".tertiaryText").forEach(element => {
        element.textContent = document.getElementById("tertiaryInput").value.toUpperCase();
    });
}

function updateImage(file, element) {
    let image = new Image();
    image.onload = function() {
        let reader = new FileReader();
        reader.onloadend = () => {
            element.setAttribute("href", reader.result)
            element.setAttribute("x", element.getAttribute("midpoint") - (((element.getAttribute("height") / image.height) * image.width) / 2));
        }
        reader.readAsDataURL(file);
    }
    image.src = URL.createObjectURL(file);
}

async function save() {
    let svg = document.getElementById("svg").cloneNode(true);
    svg.setAttribute("width", 2000);
    svg.setAttribute("height", 2000);
    const reader = new FileReader();
    await fetch("./Helvetica-Bold.ttf").then(response => response.blob()).then(blob => {
        reader.onload = () => {
            let fontFace = `
            @font-face {
                font-family: 'HelveticaBold';
                src: url('${reader.result}') format('truetype');
            }`
            svg.querySelector("style").textContent += fontFace;
            let image = new Image();
            image.onload = function () {
                let canvas = document.createElement('canvas');
                let context = canvas.getContext('2d');
                canvas.width = 2000;
                canvas.height = 2000;
                context.drawImage(image, 0, 0, 2000, 2000);
                console.log(svg);
                let link = document.createElement('a');
                link.setAttribute('download', 'TLOPcover.png');
                link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
                link.click();
            };
            image.src = "data:image/svg+xml;base64," + btoa(new XMLSerializer().serializeToString(svg));
        }
        reader.readAsDataURL(blob)
    });
}

document.getElementById("saveButton").addEventListener("click", () => save());

document.querySelectorAll("input").forEach(element => {
    element.addEventListener("keyup", () => {
        updateText();
    })
})

document.getElementById("firstImage").addEventListener("change", event => {
    document.querySelector("label[for='firstImage']").textContent = event.target.files[0].name;
    updateImage(event.target.files[0], document.getElementById("image1"));
})

document.getElementById("secondImage").addEventListener("change", event => {
    document.querySelector("label[for='secondImage']").textContent = event.target.files[0].name;
    updateImage(event.target.files[0], document.getElementById("image2"));
})

document.getElementById("backgroundColor").addEventListener("change", event => {
    document.querySelector("label[for='backgroundColor']").textContent = "Background colour: " + event.target.value;
    document.getElementById("svg").style.background = event.target.value;
    updateCanvas();
})

document.getElementById("textColor").addEventListener("change", event => {
    document.querySelector("label[for='textColor']").textContent = "Text colour: " + event.target.value;
    document.getElementById("svg").style.fill = event.target.value;
    updateCanvas();
})