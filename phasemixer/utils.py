"""
 *
 * File Name  : utils.py
 * Description: Handling all the scenarios in the mixing of magnitude with phase
 * Author     : Mahmoud Salman
 *
 """
import numpy as np


def extract_magnitude_phase(picture_1, picture_2, c1_state: str, c2_state: str, c1_shapes: list,
                            c2_shapes: list, mode: str):
    # Picture 1: top center image
    # Picture 2: bottom center image

    magnitude = None
    phase = None

    pic_1 = picture_1.crop_img(c1_state, c1_shapes, mode)
    pic_2 = picture_2.crop_img(c2_state, c2_shapes, mode)

    if c1_state == 'disable' and c2_state == 'disable':
        magnitude = pic_1  # uniform magnitude
        phase = pic_2  # uniform phase

    elif not c1_state == 'disable' and not c2_state == 'disable':

        if c1_state == 'phase':
            phase = pic_1
            magnitude = pic_2

        elif c1_state == 'magnitude':
            magnitude = pic_1
            phase = pic_2

    elif c1_state == 'disable':

        if c2_state == 'magnitude':
            magnitude = pic_2
            phase = pic_1
        else:
            phase = pic_2
            magnitude = pic_1

    elif c2_state == 'disable':

        if c1_state == 'magnitude':
            magnitude = pic_1
            phase = pic_2
        else:
            phase = pic_1
            magnitude = pic_2

    return magnitude, phase
