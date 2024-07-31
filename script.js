function getImageSize() {
    const imageInput = document.getElementById('imageInput').files[0];
    if (!imageInput) {
        alert('Please select an image first.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            document.getElementById('widthInput').value = img.width;
            document.getElementById('heightInput').value = img.height;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(imageInput);
}

function reduceImageSize(percentage) {
    const imageInput = document.getElementById('imageInput').files[0];
    if (!imageInput) {
        alert('Please select an image first.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const factor = (100 - percentage) / 100;
            const newWidth = Math.floor(img.width * factor);
            const newHeight = Math.floor(img.height * factor);
            document.getElementById('widthInput').value = newWidth;
            document.getElementById('heightInput').value = newHeight;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(imageInput);
}

function convertImageToJson() {
    const imageInput = document.getElementById('imageInput').files[0];
    const width = parseInt(document.getElementById('widthInput').value);
    const height = parseInt(document.getElementById('heightInput').value);

    if (!imageInput || !width || !height) {
        alert('Please provide an image and dimensions.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const imageData = ctx.getImageData(0, 0, width, height);
            const pixels = imageData.data;
            const pixelData = [];

            for (let y = 0; y < height; y++) {
                const row = [];
                for (let x = 0; x < width; x++) {
                    const index = (y * width + x) * 4;
                    const r = pixels[index];
                    const g = pixels[index + 1];
                    const b = pixels[index + 2];
                    const a = pixels[index + 3];
                    if (a > 0) {
                        row.push([r, g, b]);
                    } else {
                        row.push(null);
                    }
                }
                pixelData.push(row);
            }

            const data = {
                width: width,
                height: height,
                pixels: pixelData
            };

            const json = JSON.stringify(data, null, 4);
            downloadJson(json);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(imageInput);
}

function downloadJson(json) {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'File.json';
    a.click();
    URL.revokeObjectURL(url);
}