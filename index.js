async function fetchJsonData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function acceptTermsOfUse(terms) {
    const termsContainer = document.getElementById('terms-of-use');
    termsContainer.innerHTML = '';

    for (const paragraph of terms.paragraphs) {
        const p = document.createElement('p');
        p.textContent = paragraph.content;
        termsContainer.appendChild(p);
    }

    const acceptButton = document.createElement('button');
    acceptButton.textContent = 'Accept';
    acceptButton.onclick = () => {
        termsContainer.style.display = 'none';
        acceptTerms();
    };
    termsContainer.appendChild(acceptButton);

    return new Promise(resolve => {
        window.acceptTerms = () => {
            termsContainer.style.display = 'none';
            resolve();
        };
    });
}

function renderImageToCanvas(imageUrls) {
    const imageContainer = document.getElementById('image-collection');
    imageUrls.forEach((url, index) => {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const context = canvas.getContext('2d');

        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = url;
        image.onload = () => {
        context.drawImage(image, 0, 0, 200, 200);
        };

        const button = document.createElement('button');
        button.innerHTML = 'Save Image';
        button.className = 'button';
        button.addEventListener('click', () => handleSaveImage(canvas, `image_${index}.png`));

        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.appendChild(canvas);
        galleryItem.appendChild(button);

        imageContainer.appendChild(galleryItem);
    });

    const handleSaveImage = (canvas, fileName) => {
        canvas.toBlob((blob) => {
            saveAs(blob, fileName);
        });
    };
};

function saveImage(canvas, imageUrl) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `image_${imageUrl.split('/').pop()}.png`;
    link.click();
}

async function main() {
    const jsonData = await fetchJsonData('http://167.71.69.158/static/test.json');
    await acceptTermsOfUse(jsonData.terms_of_use);

    const imageCollection = document.getElementById('image-collection');
    imageCollection.style.display = 'block';
    renderImageToCanvas(jsonData.images.map((u) => new URL(u.image_url,'http://167.71.69.158').href));
}

main();