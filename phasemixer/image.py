"""
 *
 * File Name  : image.py
 * Description: ImageMain Class declaration and implementation
 * Author     : Mahmoud Salman
 *

=> Class ImageMain
* Attributes:
    - Class attributes
        - Image_Size
        - Path_Img
    - Object attributes (private)
        - img_url
        - img_orig
        - arr_mag
        - arr_phase
        - img_mag
        - img_phase
* Functions:
    - Getters:
        - img_url
        - img_orig
        - arr_mag
        - arr_phase
        - img_mag
        - img_phase
    - Normal Functions:
        - crop_img
"""
from PIL import Image, ImageDraw
import numpy as np
from matplotlib import pyplot as plt


class ImageMain:
    Image_Size = (314, 314)
    # div area pixels - offset pixels (=1)
    Path_Img = "phasemixer\\static\\images\\"
    # path to save/read all the images

    def __init__(self, file, img_name: str, img_mag_name: str, img_phase_name: str):  # Define Constructor

        self.__img_url = self.Path_Img + img_name
        self.__img_orig = Image.open(file).convert('L')  # 'L' convert to grayscale
        self.__img_orig = self.__img_orig.resize(self.Image_Size)

        arr_fft = np.fft.fftshift(np.fft.fft2(self.__img_orig))
        self.__arr_mag = np.sqrt(np.real(arr_fft) ** 2 + np.imag(arr_fft) ** 2)
        self.__arr_phase = np.arctan2(np.imag(arr_fft), np.real(arr_fft))

        plt.imsave(f'{self.Path_Img}{img_name}', self.__img_orig, cmap='gray')
        plt.imsave(f'{self.Path_Img}{img_mag_name}', np.log(self.__arr_mag), cmap='gray')
        plt.imsave(f'{self.Path_Img}{img_phase_name}', self.__arr_phase, cmap='gray')

        self.__img_mag = Image.open(f'{self.Path_Img}{img_mag_name}').convert('L')
        self.__img_mag = self.img_mag.resize(self.Image_Size)

        self.__img_phase = Image.open(f'{self.Path_Img}{img_phase_name}').convert('L')
        self.__img_phase = self.img_phase.resize(self.Image_Size)

    # Setting Getters
    @property
    def img_url(self):
        return self.__img_url

    @property
    def img_orig(self):
        return self.__img_orig

    @property
    def arr_mag(self):
        return self.__arr_mag

    @property
    def arr_phase(self):
        return self.__arr_phase

    @property
    def img_mag(self):
        return self.__img_mag

    @property
    def img_phase(self):
        return self.__img_phase

    def crop_img(self, cropped_type: str, shapes: list, mode='or'):

        if cropped_type == 'magnitude':
            arr = self.__arr_mag
            img = self.__img_mag
        elif cropped_type == 'phase':
            arr = self.__arr_phase
            img = self.__img_phase
        else:   # uniform phase or magnitude
            return np.ones(self.Image_Size)

        img_copy = img.copy()
        arr = arr.copy()

        arr_zeros = np.zeros(img_copy.size)  # for logical or, xor operations
        arr_ones = np.ones(img_copy.size)  # for logical and operations
        arr_cropped = np.zeros(img_copy.size)  # init output array

        for shape in shapes:  # iterate over all shapes
            img_mask = Image.new("L", img_copy.size)  # Create a new mask
            img_draw = ImageDraw.Draw(img_mask)
            if shape['className'] == 'Ellipse':
                img_draw.ellipse(((shape['attrs']['x'] - shape['attrs']['radiusX']), (shape['attrs']['y'] -
                                                                                      shape['attrs']['radiusY']),
                                  (shape['attrs']['x'] + shape['attrs']['radiusX']), (shape['attrs']['y'] +
                                                                                      shape['attrs']['radiusY'])),
                                 fill=1)  # fill mask with ones
            else:
                img_draw.rounded_rectangle((shape['attrs']['x'], shape['attrs']['y'], shape['attrs']['x'] +
                                            shape['attrs']['width'], shape['attrs']['y'] + shape['attrs']['height']), 0,
                                           fill=1)  # 0 means make rounded edges equal zero
            img_copy.putalpha(img_mask)  # paste mask at the alpha channel

            if mode == 'and':
                arr_ones = np.logical_and(arr_ones, np.array(img_copy)[:, :, 1])  # access the alpha channel only
                arr_cropped = arr * arr_ones
            elif mode == 'xor':
                arr_zeros = np.logical_xor(arr_zeros, np.array(img_copy)[:, :, 1])
                arr_cropped = arr * arr_zeros
            else:
                arr_zeros = np.logical_or(arr_zeros, np.array(img_copy)[:, :, 1])
                arr_cropped = arr * arr_zeros
        return arr_cropped
