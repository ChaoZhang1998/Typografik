/**
 * @module sketch
 * @author: Zhang Chao
 * @since: 2020-05-28 16:27:14
 */

'use strict';

let canvas;
let p5canvas;
let capturer; // Gif capturer
let fonts; // Save available fonts
let text_texture; // Text map texture
let pre_wave; // Save last wave angle

let gif_length = 60;
let frame_tag; // Gif start frame tag

function preload() {
    let roboto = loadFont('./assets/fonts/Roboto-Bold.ttf');
    let motorless = loadFont('./assets/fonts/Motorless-Default.ttf');
    let puhuiti = loadFont('./assets/fonts/Alibaba-PuHuiTi.otf');
    fonts = {
        'Roboto': roboto,
        'Motorless': motorless,
        'Alibaba-PuHuiTi': puhuiti
    };
}

function setup() {
    p5canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas = p5canvas.canvas;

    pre_wave = ((sin(0 * 0.03) * 4) * options.Wave_Speed);

    capturer = new CCapture({
        framerate: 60,
        format: 'gif',
        workersPath: './assets/scripts/',
        verbose: true
    });
    if (options.Type === 'GIF') {
        frame_tag = frameCount;
        capturer.start();
    }
}

function draw() {
    background(options.Background);
    noStroke();

    // Create a map texture for text
    if (options.Preset === 'Box') {
        text_texture = createGraphics(options.Size, options.Size);
    } else if (options.Preset === 'Sphere') {
        text_texture = createGraphics(2 * PI * options.Radius, PI * options.Radius);
    } else if (options.Preset === 'Ellipsoid') {
        text_texture = createGraphics(2 * PI * options.Radius, 2 * PI * options.Radius);
    } else if (options.Preset === 'Cylinder') {
        text_texture = createGraphics(2 * PI * options.Radius, options.Height);
        text_texture.rotate(HALF_PI);
    } else if (options.Preset === 'Cone') {
        let l = sqrt(options.Radius * options.Radius + options.Height * options.Height);
        text_texture = createGraphics(PI * options.Radius, l);
        text_texture.rotate(HALF_PI);
    } else if (options.Preset === 'Torus') {
        text_texture = createGraphics(2 * PI * options.Radius, 2 * PI * options.TubeRadius);
    }

    text_texture.fill(options.TextColor);
    text_texture.textFont(fonts[options.Font]);
    text_texture.textSize(options.TextSize);

    let c = hex2rgb(options.Background);
    if (options.Type === 'PNG') {
        background(0, 0, 0, 0);
        text_texture.background(0, 0, 0, 0);
    } else {
        text_texture.background(c.r, c.g, c.b, options.Alpha);
    }

    if (options.Motion) {
        text_texture.translate(0, pre_wave);
        pre_wave = pre_wave + ((sin(frameCount * 0.03) * 4) * options.Wave_Speed);
    }

    text_texture.translate(0, -0.5 * options.TextRows * options.LineSpacing);
    for (let i = 0; i < options.TextRows; i++) {
        for (let j = 0; j < options.TextCols; j++) {
            text_texture.text(options.Text, options.Text.length * options.TextSize * j, i * options.LineSpacing);
        }
    }

    // Motion of text
    push();
    if (options.Motion) {
        rotateX(frameCount * options.X_Speed);
        rotateY(frameCount * options.Y_Speed);
        rotateZ(frameCount * options.Z_Speed);

        rotateX(radians(options.X_Rotation));
        rotateY(radians(options.Y_Rotation));
        rotateZ(radians(options.Z_Rotation));
    } else {
        rotateX(radians(options.X_Rotation));
        rotateY(radians(options.Y_Rotation));
        rotateZ(radians(options.Z_Rotation));
    }

    texture(text_texture);
    if (options.Preset === 'Box') {
        box(options.Size, options.Size, options.Size, options.Detail, options.Detail);
    } else if (options.Preset === 'Sphere') {
        sphere(options.Radius, options.Detail, options.Detail);
    } else if (options.Preset === 'Ellipsoid') {
        ellipsoid(options.RadiusX, options.RadiusY, options.RadiusZ, options.Detail, options.Detail);
    } else if (options.Preset === 'Cylinder') {
        cylinder(options.Radius, options.Height, options.Detail, options.Detail);
    } else if (options.Preset === 'Cone') {
        cone(options.Radius, options.Height, options.Detail, options.Detail);
    } else if (options.Preset === 'Torus') {
        torus(options.Radius, options.TubeRadius, options.Detail, options.Detail);
    }
    pop();

    if (options.Type === 'GIF') {
        if (frameCount - frame_tag < gif_length) {
            capturer.capture(canvas);
        } else if (frameCount - frame_tag === gif_length) {
            capturer.stop();
        }
    }
}