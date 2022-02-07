import { Heightmap } from "./types";

async function fetchImage(url: string): Promise<ImageData> {
    return new Promise((resolve, reject) => {
        var img = new Image();

        img.setAttribute('crossOrigin', 'anonymous');

        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            let ctx = canvas.getContext("2d");

            if (ctx != null) {
                ctx.drawImage(img, 0, 0);
                resolve(ctx.getImageData(0, 0, canvas.width, canvas.height))
            }
            else reject("Failed to load image");
        };

        img.src = url;
    })
}

export async function loadImages(src: string): Promise<[ImageData, Heightmap]> {
    return [await fetchImage('./' + src), readHeaight(await fetchImage('./' + src.replace(/C/, 'D').replace(/W/, '')))]
}

function readHeaight(data: ImageData): Heightmap {
    let res = {
        width: data.width,
        height: data.height,
        data: new Uint8ClampedArray(data.width * data.height)
    }

    for (let i = 0; i < res.data.length; ++i) {
        res.data[i] = data.data[i * 4];
    }

    return res;
}

