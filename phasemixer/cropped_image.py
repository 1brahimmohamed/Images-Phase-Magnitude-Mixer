from .image import ImageMain
from PIL import Image, ImageDraw
import numpy as np


class CroppedImage(ImageMain):
    Indices_Init = (0, 0, 1000, 1000)

    def __init__(self, file, img_name: str, img_amp_name: str, img_phase_name: str, shapes, mode, uniform_amp=False,
                 uniform_phase=False):
        # Call to super function to have access to all attributes / methods
        super().__init__(
            file, img_name, img_amp_name, img_phase_name
        )

        self.__cropped_arr_amp = self.crop_img(self.arr_amp, self.img_amp, shapes, mode)
        self.__cropped_arr_phase = self.crop_img(self.arr_phase, self.img_phase, shapes, mode)

        if uniform_amp:
            self.__cropped_arr_amp = np.ones(self.Image_Size)
        if uniform_phase:
            self.__cropped_arr_phase = np.ones(self.Image_Size)

        self.__arr_post = np.real(np.fft.ifft2(np.multiply(self.__cropped_arr_amp, np.exp(1j * self.__cropped_arr_phase))))

    @property
    def cropped_arr_amp(self):
        return self.__cropped_arr_amp

    @property
    def cropped_arr_phase(self):
        return self.__cropped_arr_phase

    @property
    def arr_post(self):
        return self.__arr_post

    @staticmethod
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
