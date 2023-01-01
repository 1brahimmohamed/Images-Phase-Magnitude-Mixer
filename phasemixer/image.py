from PIL import Image
import numpy as np
from matplotlib import pyplot as plt


class ImageMain:
    Image_Size = (1000, 1000)
    Path_Img = "A:\\Professional\\Phase-Mixer\\phasemixer\\static\\images\\"

    def __init__(self, img_url: str):
        self.__img_url = img_url
        self.__img_orig = Image.open(self.__img_url).convert('L')
        self.__img_orig = self.__img_orig.resize(self.Image_Size)

        arr_fft = np.fft.fftshift(np.fft.fft2(self.__img_orig))
        self.__arr_amp = np.sqrt(np.real(arr_fft) ** 2 + np.imag(arr_fft) ** 2)
        self.__arr_phase = np.arctan2(np.imag(arr_fft), np.real(arr_fft))

        plt.imsave(f'{self.Path_Img}amplitude_image.jpg', np.log(self.__arr_amp), cmap='gray')
        plt.imsave(f'{self.Path_Img}phase_image.jpg', self.__arr_phase, cmap='gray')

        self.__img_amp = Image.open(f'{self.Path_Img}amplitude_image.jpg').convert('L')
        self.__img_amp = self.img_amp.resize(self.Image_Size)

        self.__img_phase = Image.open(f'{self.Path_Img}phase_image.jpg').convert('L')
        self.__img_phase = self.img_phase.resize(self.Image_Size)

    @property
    def img_url(self):
        return self.__img_url

    @property
    def img_orig(self):
        return self.__img_orig

    @property
    def arr_amp(self):
        return self.__arr_amp

    @property
    def arr_phase(self):
        return self.__arr_phase

    @property
    def img_amp(self):
        return self.__img_amp

    @property
    def img_phase(self):
        return self.__img_phase
