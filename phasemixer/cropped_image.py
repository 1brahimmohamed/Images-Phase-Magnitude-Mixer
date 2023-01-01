from image import ImageMain
from utils import crop_img
import numpy as np


class CroppedImage(ImageMain):
    Indices_Init = (0, 0, 1000, 1000)

    def __init__(self, img_url: str, indices_amp=Indices_Init,  indices_phase=Indices_Init, crop_type_amp=0,
                 crop_type_phase=0, amp=1, phase=1):  # 0 for uniform amp or phase
        # Call to super function to have access to all attributes / methods
        super().__init__(
            img_url
        )

        self.__cropped_arr_amp = crop_img(self.arr_amp, self.img_amp, indices_amp, crop_type_amp)
        self.__cropped_arr_phase = crop_img(self.arr_phase, self.img_phase, indices_phase, crop_type_phase)

        if amp == 0:
            self.__cropped_arr_amp = np.ones(self.Image_Size)
        if phase == 0:
            self.__cropped_arr_phase = np.ones(self.Image_Size)

        self.__arr_post = np.real(np.fft.ifft2(np.multiply(self.__cropped_arr_amp, np.exp(1j * self.__cropped_arr_phase))))

    @property
    def arr_post(self):
        return self.__arr_post
