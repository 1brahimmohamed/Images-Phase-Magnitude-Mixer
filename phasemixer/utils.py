import numpy as np


def extract_magnitude_phase(picture_1, picture_2, c1_state, c2_state, c1_shapes, c2_shapes, mode):
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
            magnitude = np.ones(phase.shape)

    if c1_state == 'disable' and c2_state == 'disable':
        magnitude = np.ones((314, 314))
        phase = np.ones((314, 314))

    return magnitude, phase
