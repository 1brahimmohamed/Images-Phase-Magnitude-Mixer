from .cropped_image import CroppedImage
from PIL import Image

mag_1_path = 'phasemixer/static/images/mag1.jpg'
mag_2_path = 'phasemixer/static/images/mag2.jpg'
phase_1_path = 'phasemixer/static/images/phase1.jpg'
phase_2_path = 'phasemixer/static/images/phase2.jpg'


def processing(mode, c1_state, c2_state, c1_shapes, c2_shapes):
    Img1 = Image.open('phasemixer/static/images/image1.jpg')
    Img2 = Image.open('phasemixer/static/images/image2.jpg')


def detect_uniform_mode(c1_state, c2_state):

    return False, False
