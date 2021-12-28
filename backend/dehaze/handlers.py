import cv2 as cv
import numpy as np
from PIL import Image


def read_image(image):
    img = np.asarray(Image.open(image))
    img = cv.cvtColor(img, cv.COLOR_RGB2BGR)
    return img
