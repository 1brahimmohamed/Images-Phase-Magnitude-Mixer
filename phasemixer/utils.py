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

    if not c1_state == 'disable' and not c2_state == 'disable':
        if c1_state == 'phase':
            phase = picture_1.crop_img('phase', c1_shapes, mode)
            magnitude = picture_2.crop_img('magnitude', c2_shapes, mode)

        elif c1_state == 'magnitude':
            magnitude = picture_1.crop_img('magnitude', c1_shapes, mode)
            phase = picture_2.crop_img('phase', c2_shapes, mode)

    if c1_state == 'disable':
        if c2_state == 'magnitude':
            magnitude = picture_2.crop_img('magnitude', c2_shapes, mode)
            phase = np.ones(magnitude.shape)
        else:
            phase = picture_2.crop_img('phase', c2_shapes, mode)
            magnitude = np.ones(phase.shape)

    if c2_state == 'disable':
        if c1_state == 'magnitude':
            magnitude = picture_1.crop_img('magnitude', c1_shapes, mode)
            phase = np.ones(magnitude.shape)
        else:
            phase = picture_1.crop_img('phase', c1_shapes, mode)
            magnitude = np.ones(phase.shape)*200

    if c1_state == 'disable' and c2_state == 'disable':

        magnitude = np.ones((314, 314))*200  # uniform magnitude
        phase = np.ones((314, 314))      # uniform phase

    return magnitude, phase
