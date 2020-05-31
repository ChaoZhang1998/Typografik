/**
 * @module gui
 * @author: Zhang Chao
 * @since: 2020-05-29 16:01:46
 */

'use strict';

var options = {
    Preset: 'Box',
    Background: '#1A2AD4',
    Alpha: 255,
    Detail: 48,
    Size: 240,
    Radius: 200,
    TubeRadius: 80,
    RadiusX: 130,
    RadiusY: 260,
    RadiusZ: 130,
    Height: 100,

    Font: 'Alibaba-PuHuiTi',
    Text: '字体实验室',
    TextColor: '#FFFFFF',
    TextSize: 50,
    TextCols: 5,
    TextRows: 75,
    LineSpacing: 50,

    Motion: true,
    Wave_Speed: 3,
    X_Rotation: 0,
    X_Speed: 0.02,
    Y_Rotation: 0,
    Y_Speed: 0.01,
    Z_Rotation: 45,
    Z_Speed: 0.01,

    Type: 'JPG',
    Save: function () {
        if (options.Type == 'JPG') {
            saveFrames("Font-Experiment", "jpg", 1, 1);
        } else if (options.Type == 'PNG') {
            saveFrames("Font-Experiment", "png", 1, 1);
        } else if (options.Type == 'GIF') {
            setTimeout(capturer.save(), 5000);
        }
    },
}

var gui, basic, text, motion, camera, save;

var preset_control, alpha_control, bg_control, size_control, radius_control, tube_radius_control, radius_x_control, radius_y_control, radius_z_control, height_control;

var txt_control, txt_color_control, txt_size_control, txt_repeat_control, txt_cols_control, txt_rows_control, line_space_control, font_control, detail_control;

var motion_control, wave_speed_control, x_rotation_control, x_speed_control, y_rotation_control, y_speed_control, z_rotation_control, z_speed_control;

var type_control, save_control;

window.onload = function () {
    gui = new dat.GUI();

    basic = gui.addFolder('Basic');

    preset_control = basic.add(options, 'Preset', ['Box', 'Sphere', 'Ellipsoid', 'Cylinder', 'Cone', 'Torus']);
    preset_control.onChange(() => {
        if (options.Preset === 'Box') {
            box_set();
        } else if (options.Preset === 'Sphere') {
            sphere_set()
        } else if (options.Preset === 'Ellipsoid') {
            ellipsoid_set();
        } else if (options.Preset === 'Cylinder') {
            cylinder_set();
        } else if (options.Preset === 'Cone') {
            cone_set();
        } else if (options.Preset === 'Torus') {
            torus_set();
        }

        setup();
        draw();
    });

    bg_control = basic.addColor(options, 'Background');
    bg_control.onChange(draw);

    alpha_control = basic.add(options, 'Alpha', 0, 255);
    alpha_control.onChange(draw);

    detail_control = basic.add(options, 'Detail', 0, 48, 2);
    detail_control.onChange(draw);

    size_control = basic.add(options, 'Size', 0, 600);
    size_control.onChange(draw);

    basic.open();

    text = gui.addFolder('Text');

    font_control = text.add(options, 'Font', ['Roboto', 'Motorless', 'Alibaba-PuHuiTi']);
    font_control.onChange(draw);

    txt_control = text.add(options, 'Text');
    txt_control.onChange(() => {
        if (options.Preset === 'Box') {
            size_control.setValue(options.Text.length * options.TextSize);
        } else if (options.Preset === 'Cylinder') {
            height_control.setValue(options.Text.length * options.TextSize);
        }

        draw();
    });

    txt_color_control = text.addColor(options, 'TextColor');
    txt_color_control.onChange(draw);

    line_space_control = text.add(options, 'LineSpacing', 0, 200);
    line_space_control.onChange(draw);

    txt_size_control = text.add(options, 'TextSize', 0, 200);
    txt_size_control.onChange(draw);

    txt_cols_control = text.add(options, 'TextCols', 0, 10, 1);
    txt_cols_control.onChange(draw);

    txt_rows_control = text.add(options, 'TextRows', 0, 100, 1);
    txt_rows_control.onChange(draw);

    text.open();

    motion = gui.addFolder('Motion');

    motion_control = motion.add(options, 'Motion');
    motion_control.onChange(draw);

    wave_speed_control = motion.add(options, 'Wave_Speed', {
        Static: 0,
        Slow: 1,
        Medium: 3,
        Fast: 6
    });
    wave_speed_control.onChange(setup);

    x_speed_control = motion.add(options, 'X_Speed', 0, 0.1);
    x_speed_control.onChange(draw);

    y_speed_control = motion.add(options, 'Y_Speed', 0, 0.1);
    y_speed_control.onChange(draw);

    z_speed_control = motion.add(options, 'Z_Speed', 0, 0.1);
    z_speed_control.onChange(draw);

    motion.open();

    camera = gui.addFolder('Camera');

    x_rotation_control = camera.add(options, 'X_Rotation', 0, 360);
    x_rotation_control.onChange(draw);

    y_rotation_control = camera.add(options, 'Y_Rotation', 0, 360);
    y_rotation_control.onChange(draw);

    z_rotation_control = camera.add(options, 'Z_Rotation', 0, 360);
    z_rotation_control.onChange(draw);

    camera.close();

    save = gui.addFolder('Save');

    type_control = save.add(options, 'Type', ['JPG', 'PNG', 'GIF']);
    type_control.onChange(setup);

    save_control = save.add(options, 'Save');

    save.close();
};

function component2hex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgb2hex(r, g, b) {
    return "#" + component2hex(r) + component2hex(g) + component2hex(b);
}

function hex2rgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function box_set() {
    clear_controller();

    size_control = basic.add(options, 'Size', 0, 600);
    size_control.onChange(draw);

    init_controller();

    options.Size = options.Text.length * options.TextSize;
}

function sphere_set() {
    clear_controller();

    radius_control = basic.add(options, 'Radius', 0, 600);
    radius_control.onChange(draw);

    init_controller();
}

function ellipsoid_set() {
    clear_controller();

    radius_x_control = basic.add(options, 'RadiusX', 0, 600);
    radius_x_control.onChange(draw);

    radius_y_control = basic.add(options, 'RadiusY', 0, 600);
    radius_y_control.onChange(draw);

    radius_z_control = basic.add(options, 'RadiusZ', 0, 600);
    radius_z_control.onChange(draw);

    init_controller();
}

function cylinder_set() {
    clear_controller();

    radius_control = basic.add(options, 'Radius', 0, 600);
    radius_control.onChange(draw);

    height_control = basic.add(options, 'Height', 0, 600);
    height_control.onChange(draw);

    init_controller();

    txt_control.setValue('字体');
    height_control.setValue(options.Text.length * options.TextSize);
    alpha_control.setValue(0);
}

function cone_set() {
    clear_controller();

    radius_control = basic.add(options, 'Radius', 0, 600);
    radius_control.onChange(draw);

    height_control = basic.add(options, 'Height', 0, 600);
    height_control.onChange(draw);

    init_controller();

    height_control.setValue(400);
    radius_control.setValue(150);
    alpha_control.setValue(0);
}

function torus_set() {
    clear_controller();

    radius_control = basic.add(options, 'Radius', 0, 600);
    radius_control.onChange(draw);

    tube_radius_control = basic.add(options, 'TubeRadius', 0, 600);
    tube_radius_control.onChange(draw);

    init_controller();
}

function init_controller() {
    alpha_control.setValue(255);

    txt_size_control.setValue(50);
    txt_cols_control.setValue(5);
    txt_rows_control.setValue(75);
    line_space_control.setValue(50);

    motion_control.setValue(true);
    wave_speed_control.setValue(3);
    x_rotation_control.setValue(0);
    x_speed_control.setValue(0.02);
    y_rotation_control.setValue(0);
    y_speed_control.setValue(0.01);
    z_rotation_control.setValue(45);
    z_speed_control.setValue(0.01);
}

function clear_controller() {
    if (size_control !== undefined) {
        size_control.remove();
        size_control = undefined;
    }

    if (radius_control !== undefined) {
        radius_control.remove();
        radius_control = undefined;
    }

    if (tube_radius_control !== undefined) {
        tube_radius_control.remove();
        tube_radius_control = undefined;
    }

    if (radius_x_control !== undefined) {
        radius_x_control.remove();
        radius_x_control = undefined;
    }

    if (radius_y_control !== undefined) {
        radius_y_control.remove();
        radius_y_control = undefined;
    }

    if (radius_z_control !== undefined) {
        radius_z_control.remove();
        radius_z_control = undefined;
    }

    if (height_control !== undefined) {
        height_control.remove();
        height_control = undefined;
    }
}