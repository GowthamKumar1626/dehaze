import cv2
import numpy as np


def img_sharpness(img_vector, method=None) -> float:
    if (method == 'cep') or (method == 'original'):
        laplacian1 = cv2.Laplacian(img_vector, cv2.CV_64F)
    else:
        laplacian1 = cv2.Laplacian(img_vector*255, cv2.CV_64F)
    gnorm1 = np.sqrt(laplacian1**2)
    sharpness1 = np.average(gnorm1)

    return str(round(sharpness1, 2))
