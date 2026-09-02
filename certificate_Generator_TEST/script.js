const templateUpload =
    document.getElementById("templateUpload");

const previewCanvas =
    document.getElementById("previewCanvas");

const emptyPreview =
    document.getElementById("emptyPreview");

const nameInput =
    document.getElementById("nameInput");

const fontSelect =
    document.getElementById("fontSelect");

const fontSize =
    document.getElementById("fontSize");

const fontColor =
    document.getElementById("fontColor");

const positionX =
    document.getElementById("positionX");

const positionY =
    document.getElementById("positionY");

const generateBtn =
    document.getElementById("generateBtn");

const clearBtn =
    document.getElementById("clearBtn");

const resultsSection =
    document.getElementById("resultsSection");

const results =
    document.getElementById("results");

const downloadAllBtn =
    document.getElementById("downloadAllBtn");

const selectedFile =
    document.getElementById("selectedFile");

const ctx =
    previewCanvas.getContext("2d");



let certificateImage = null;

let nameX = 0;
let nameY = 0;

let isDragging = false;



function generateReferenceNumber() {

    const year =
        new Date().getFullYear();

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    const randomValues =
        new Uint32Array(8);

    crypto.getRandomValues(randomValues);

    let randomPart = "";

    for (let i = 0; i < randomValues.length; i++) {

        randomPart +=
            characters[
                randomValues[i] %
                characters.length
            ];

    }

    return `CERT-${year}-${randomPart}`;
}


function createFileName(
    name,
    referenceNumber
) {

    const safeName =
        name
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase();

    return `${referenceNumber}-${safeName}-certificate.png`;
}



templateUpload.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];

        if (!file) {
            return;
        }



        if (selectedFile) {

            selectedFile.textContent =
                "Selected: " + file.name;

        }


        if (!file.type.startsWith("image/")) {

            alert(
                "Please select a PNG, JPG, or JPEG image."
            );

            this.value = "";

            if (selectedFile) {

                selectedFile.textContent =
                    "No file selected";

            }

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                const img =
                    new Image();


                img.onload =
                    function () {

                        certificateImage =
                            img;


                        previewCanvas.width =
                            img.naturalWidth;

                        previewCanvas.height =
                            img.naturalHeight;

                        nameX =
                            img.naturalWidth / 2;

                        nameY =
                            img.naturalHeight / 2;


                        previewCanvas.style.display =
                            "block";

                        emptyPreview.style.display =
                            "none";


                        updatePositionDisplay();

                        drawPreview();

                    };


                img.onerror =
                    function () {

                        alert(
                            "The certificate image could not be loaded."
                        );

                    };


                img.src =
                    event.target.result;

            };


        reader.onerror =
            function () {

                alert(
                    "There was a problem reading the file."
                );

            };


        reader.readAsDataURL(file);

    }
);


function getCanvasPosition(event) {

    const rect =
        previewCanvas.getBoundingClientRect();


    const scaleX =
        previewCanvas.width /
        rect.width;

    const scaleY =
        previewCanvas.height /
        rect.height;


    return {

        x:
            (event.clientX - rect.left) *
            scaleX,

        y:
            (event.clientY - rect.top) *
            scaleY

    };

}


previewCanvas.addEventListener(
    "click",
    function (event) {

        if (!certificateImage) {
            return;
        }


        const position =
            getCanvasPosition(event);


        nameX =
            position.x;

        nameY =
            position.y;


        updatePositionDisplay();

        drawPreview();

    }
);


previewCanvas.addEventListener(
    "mousedown",
    function (event) {

        if (!certificateImage) {
            return;
        }


        isDragging = true;

        moveName(event);

    }
);


document.addEventListener(
    "mousemove",
    function (event) {

        if (!isDragging) {
            return;
        }


        moveName(event);

    }
);


document.addEventListener(
    "mouseup",
    function () {

        isDragging = false;

    }
);


function moveName(event) {

    if (!certificateImage) {
        return;
    }


    const rect =
        previewCanvas.getBoundingClientRect();


    if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
    ) {
        return;
    }


    const position =
        getCanvasPosition(event);


    nameX =
        position.x;

    nameY =
        position.y;


    updatePositionDisplay();

    drawPreview();

}


function drawPreview() {

    if (!certificateImage) {
        return;
    }


    ctx.clearRect(
        0,
        0,
        previewCanvas.width,
        previewCanvas.height
    );


    ctx.drawImage(
        certificateImage,
        0,
        0
    );

    const names =
        getNames();

    let previewName =
        "Sample Name";


    if (names.length > 0) {

        previewName =
            names[0];

    }


    ctx.font =
        `${fontSize.value}px "${fontSelect.value}"`;

    ctx.fillStyle =
        fontColor.value;

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";


    ctx.fillText(
        previewName,
        nameX,
        nameY
    );

    ctx.beginPath();

    ctx.arc(
        nameX,
        nameY,
        7,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle =
        "#007bff";

    ctx.lineWidth =
        3;

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        nameX - 15,
        nameY
    );

    ctx.lineTo(
        nameX + 15,
        nameY
    );

    ctx.moveTo(
        nameX,
        nameY - 15
    );

    ctx.lineTo(
        nameX,
        nameY + 15
    );

    ctx.strokeStyle =
        "#007bff";

    ctx.lineWidth =
        2;

    ctx.stroke();

}

function updatePositionDisplay() {

    positionX.textContent =
        Math.round(nameX);

    positionY.textContent =
        Math.round(nameY);

}


function getNames() {

    return nameInput.value
        .split("\n")
        .map(
            name => name.trim()
        )
        .filter(
            name => name !== ""
        );

}



nameInput.addEventListener(
    "input",
    drawPreview
);

fontSelect.addEventListener(
    "change",
    drawPreview
);

fontSize.addEventListener(
    "input",
    drawPreview
);

fontColor.addEventListener(
    "input",
    drawPreview
);


generateBtn.addEventListener(
    "click",
    function () {

        if (!certificateImage) {

            alert(
                "Please upload a certificate design first."
            );

            return;
        }


        const names =
            getNames();


        if (names.length === 0) {

            alert(
                "Please enter at least one name."
            );

            return;
        }


        results.innerHTML =
            "";

        resultsSection.style.display =
            "block";


        names.forEach(
            function (name) {



                const referenceNumber =
                    generateReferenceNumber();


                const canvas =
                    document.createElement("canvas");

                const context =
                    canvas.getContext("2d");


                canvas.width =
                    certificateImage.naturalWidth;

                canvas.height =
                    certificateImage.naturalHeight;


                context.drawImage(
                    certificateImage,
                    0,
                    0
                );


                context.font =
                    `${fontSize.value}px "${fontSelect.value}"`;

                context.fillStyle =
                    fontColor.value;

                context.textAlign =
                    "center";

                context.textBaseline =
                    "middle";


                context.fillText(
                    name,
                    nameX,
                    nameY
                );


                context.font = "11px Arial";

                context.fillStyle = "#777777";

                context.textAlign = "center";

                context.textBaseline = "bottom";

                context.fillText(
                `Ref: ${referenceNumber}`,
                canvas.width / 2,
                canvas.height - 15
                    );


                const imageURL =
                    canvas.toDataURL(
                        "image/png"
                    );


                const card =
                    document.createElement("div");

                card.className =
                    "result-card";



                card.dataset.reference =
                    referenceNumber;

                card.dataset.name =
                    name;

                card.dataset.image =
                    imageURL;


                const image =
                    document.createElement("img");

                image.src =
                    imageURL;



                const info =
                    document.createElement("div");

                info.className =
                    "result-info";



                const nameLabel =
                    document.createElement("div");

                nameLabel.className =
                    "result-name";

                nameLabel.textContent =
                    name;


                const referenceLabel =
                    document.createElement("div");

                referenceLabel.className =
                    "reference-number";

                referenceLabel.textContent =
                    `Reference No.: ${referenceNumber}`;



                const download =
                    document.createElement("a");

                download.className =
                    "download-btn";

                download.href =
                    imageURL;

                download.download =
                    createFileName(
                        name,
                        referenceNumber
                    );

                download.textContent =
                    "Download Certificate";



                info.appendChild(
                    nameLabel
                );

                info.appendChild(
                    referenceLabel
                );

                info.appendChild(
                    download
                );

                card.appendChild(
                    image
                );

                card.appendChild(
                    info
                );

                results.appendChild(
                    card
                );

            }
        );



        resultsSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);



downloadAllBtn.addEventListener(
    "click",
    async function () {


        if (typeof JSZip === "undefined") {

            alert(
                "The ZIP library could not be loaded. Please make sure you are connected to the internet."
            );

            return;
        }


        const cards =
            document.querySelectorAll(
                ".result-card"
            );


        if (cards.length === 0) {

            alert(
                "Please generate certificates first."
            );

            return;
        }


        const zip =
            new JSZip();



        cards.forEach(
            function (card) {

                const imageData =
                    card.dataset.image;

                const name =
                    card.dataset.name;

                const referenceNumber =
                    card.dataset.reference;


                if (!imageData) {
                    return;
                }


                const base64Data =
                    imageData.split(",")[1];


                const fileName =
                    createFileName(
                        name,
                        referenceNumber
                    );


                zip.file(
                    fileName,
                    base64Data,
                    {
                        base64: true
                    }
                );

            }
        );


        const originalText =
            downloadAllBtn.textContent;

        downloadAllBtn.textContent =
            "Creating ZIP...";

        downloadAllBtn.disabled =
            true;


        try {


            const zipBlob =
                await zip.generateAsync({
                    type: "blob"
                });


            const downloadURL =
                URL.createObjectURL(
                    zipBlob
                );


            const link =
                document.createElement("a");

            link.href =
                downloadURL;

            link.download =
                "Generated-Certificates.zip";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );



            setTimeout(
                function () {

                    URL.revokeObjectURL(
                        downloadURL
                    );

                },
                1000
            );


        } catch (error) {

            console.error(
                "ZIP creation error:",
                error
            );

            alert(
                "There was a problem creating the ZIP file."
            );

        }


        downloadAllBtn.textContent =
            originalText;

        downloadAllBtn.disabled =
            false;

    }
);


clearBtn.addEventListener(
    "click",
    function () {

        results.innerHTML =
            "";

        resultsSection.style.display =
            "none";

    }
);