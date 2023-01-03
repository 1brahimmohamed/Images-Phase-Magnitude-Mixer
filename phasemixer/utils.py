from PIL import Image, ImageDraw
import numpy as np


def crop_img(arr, img, shapes, mode='or'):
    img_copy = img.copy()
    arr_zeros = np.zeros(img_copy.size)
    arr_ones = np.ones(img_copy.size)
    for shape in shapes:
        img_mask = Image.new("L", img_copy.size)
        img_draw = ImageDraw.Draw(img_mask)

        if shape['className'] == 'Ellipse':
            img_draw.ellipse(((shape['x'] - shape['radiusX']), (shape['y'] - shape['radiusY']),
                              (shape['x'] + shape['radiusX']), (shape['y'] + shape['radiusY'])), fill=1)
        else:
            img_draw.rounded_rectangle((shape['x'], shape['y'], shape['width'], shape['height']), 0, fill=1)
        img_copy.putalpha(img_mask)

        if mode == 'and':
            arr_ones = np.logical_and(arr_ones, np.array(img_copy)[:, :, 1])
            arr_cropped = arr * arr_ones
        elif mode == 'xor':
            arr_zeros = np.logical_xor(arr_zeros, np.array(img_copy)[:, :, 1])
            arr_cropped = arr * arr_zeros
        else:
            arr_zeros = np.logical_or(arr_zeros, np.array(img_copy)[:, :, 1])
            arr_cropped = arr * arr_zeros
    return arr_cropped
