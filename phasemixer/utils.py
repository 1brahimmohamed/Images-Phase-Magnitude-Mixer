from PIL import Image, ImageDraw
import numpy as np


def crop_img(arr, img, tuple, id=0):  # Default crop is rectangle
    refactored_indices = refactor_shapes(tuple)
    img_mask = Image.new("L", img.size)
    img_draw = ImageDraw.Draw(img_mask)
    if id == 1:
        img_draw.ellipse(refactored_indices, fill=1)
    else:
        img_draw.rounded_rectangle(refactored_indices, 0, fill=1)
    img.putalpha(img_mask)
    arr_cropped = arr * np.array(img)[:, :, 1]
    return arr_cropped


def refactor_shapes(shapes):
    refactored_shapes = shapes
    return refactored_shapes
