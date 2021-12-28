from dehaze.dehaze.handlers import truncate

import cv2
import numpy as np
from time import time
from cv2.ximgproc import guidedFilter
import math


class CEP():
    def __init__(self):

        self.radius = 23
        self.ksize = 2 * self.radius + 1, 2 * self.radius + 1
        self.eps = 0.008
        self.k = 0.95
        self.t_min = 0.001
        self.t_max = 1

        self.air_top_n = 0.001
        self.fast_trans_estimate = True
        self.show_airlight_loc = False
        self.show_trans_gray = False
        self.show_trans_jet = False

    def enhance_rgb(self, rgb):
        tt = time()
        self.data_type = rgb.dtype.name
        self.vmin, self.vmax = np.iinfo(
            self.data_type).min, np.iinfo(self.data_type).max
        rgb = rgb.astype('float')

        # estimate airlight
        air_locs = self.estimate_airlight(rgb)

        b, g, r = cv2.split(rgb)
        air_r, air_g, air_b = np.mean(r[air_locs]), np.mean(
            g[air_locs]), np.mean(b[air_locs])

        if self.fast_trans_estimate:
            t = self.estimate_trans_fast(rgb, (air_r, air_g, air_b))
        else:
            t = self.estimate_trans(rgb, (air_r, air_g, air_b))

        if self.show_trans_gray:
            cv2.imshow('transmission', (255*t).astype('uint8'))
        if self.show_trans_jet:
            cv2.imshow('transmission jet', cv2.applyColorMap(
                (255*t).astype('uint8'), cv2.COLORMAP_JET))

        out = np.zeros(rgb.shape, self.data_type)
        out[:, :, 0] = self.dehaze(b, air_b, t)
        out[:, :, 1] = self.dehaze(g, air_g, t)
        out[:, :, 2] = self.dehaze(r, air_r, t)

        if self.show_airlight_loc:
            out[air_locs] = (0, 255, 0)

        #print('Dehazing elapsed: %.3fs ...' % (time() - tt))

        return out

    def estimate_airlight(self, rgb):
        min_ch = np.amin(rgb, axis=2)
        h, w = min_ch.shape[:2]
        ss = max(4 * self.radius + 1, 61)
        mean_min_ch = cv2.boxFilter(min_ch, -1, (ss, ss))
        mean_min_ch = mean_min_ch.flatten()
        argsort = np.argsort(mean_min_ch)[::-1]
        air_locs_1D = argsort[:int(h * w * self.air_top_n)]
        air_Y = air_locs_1D // w
        air_X = air_locs_1D - air_Y * w

        return (air_Y, air_X)

    def estimate_trans(self, rgb, airlight):
        b, g, r = np.copy(rgb)
        air_r, air_g, air_b = airlight
        rn, gn, bn = r / air_r, g / air_g, b / air_b

        minr = self.get_mine(rn)
        ming = self.get_mine(gn)
        minb = self.get_mine(bn)

        t = 1 - self.k * np.minimum(np.minimum(minr, ming), minb)
        return truncate(t, vmin=self.t_min, vmax=self.t_max)

    def get_mine(self, im):
        im_float = im.astype('float32')
        u = guidedFilter(guide=im_float, src=im_float,
                         radius=self.radius, eps=self.eps)

        if self.fast_trans_estimate:
            sig = cv2.boxFilter(
                (im_float - u) * (im_float - u), -1, self.ksize)
        else:
            sig = guidedFilter(guide=im_float, src=(
                im_float - u) * (im_float - u), radius=self.radius, eps=self.eps)

        return u - np.abs(np.sqrt(sig))

    def dehaze(self, im, air, t):
        return truncate(np.divide(im - air, t) + air, vmin=self.vmin, vmax=self.vmax)

    def estimate_trans_fast(self, rgb, airlight):
        b, g, r = cv2.split(rgb)
        air_r, air_g, air_b = airlight
        rn, gn, bn = r / air_r, g / air_g, b / air_b

        min_ch = np.minimum(np.minimum(rn, gn), bn)
        mine = self.get_mine(min_ch)

        t = 1 - self.k * mine
        return truncate(t, vmin=self.t_min, vmax=self.t_max)


class DCP():
    def DarkChannel(self, im, sz):
        b, g, r = cv2.split(im)
        dc = cv2.min(cv2.min(r, g), b)
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (sz, sz))
        dark = cv2.erode(dc, kernel)
        return dark

    def AtmLight(self, im, dark):
        [h, w] = im.shape[:2]
        imsz = h*w
        numpx = int(max(math.floor(imsz/1000), 1))
        darkvec = dark.reshape(imsz)
        imvec = im.reshape(imsz, 3)

        indices = darkvec.argsort()
        indices = indices[imsz-numpx::]

        atmsum = np.zeros([1, 3])
        for ind in range(1, numpx):
            atmsum = atmsum + imvec[indices[ind]]

        A = atmsum / numpx
        return A

    def TransmissionEstimate(self, im, A, sz):
        omega = 0.95
        im3 = np.empty(im.shape, im.dtype)

        for ind in range(0, 3):
            im3[:, :, ind] = im[:, :, ind]/A[0, ind]

        transmission = 1 - omega*self.DarkChannel(im3, sz)
        return transmission

    def Guidedfilter(self, im, p, r, eps):
        mean_I = cv2.boxFilter(im, cv2.CV_64F, (r, r))
        mean_p = cv2.boxFilter(p, cv2.CV_64F, (r, r))
        mean_Ip = cv2.boxFilter(im*p, cv2.CV_64F, (r, r))
        cov_Ip = mean_Ip - mean_I*mean_p

        mean_II = cv2.boxFilter(im*im, cv2.CV_64F, (r, r))
        var_I = mean_II - mean_I*mean_I

        a = cov_Ip/(var_I + eps)
        b = mean_p - a*mean_I

        mean_a = cv2.boxFilter(a, cv2.CV_64F, (r, r))
        mean_b = cv2.boxFilter(b, cv2.CV_64F, (r, r))

        q = mean_a*im + mean_b
        return q

    def TransmissionRefine(self, im, et):
        gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
        gray = np.float64(gray)/255
        r = 60
        eps = 0.0001
        t = self.Guidedfilter(gray, et, r, eps)

        return t

    def Recover(self, im, t, A, tx=0.1):
        res = np.empty(im.shape, im.dtype)
        t = cv2.max(t, tx)

        for ind in range(0, 3):
            res[:, :, ind] = (im[:, :, ind]-A[0, ind])/t + A[0, ind]

        return res
