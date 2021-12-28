import numpy as np


def truncate(input, vmax=None, vmin=None):
    out = np.copy(input)
    is_ndarray = isinstance(input, np.ndarray)
    if vmin is not None and vmax is None:
        if is_ndarray:
            out[np.where(input < vmin)] = vmin
        else:
            out = max(out, vmin)
    if vmin is None and vmax is not None:
        if is_ndarray:
            out[np.where(input > vmax)] = vmax
        else:
            out = min(out, vmax)
    if vmin is not None and vmax is not None:
        if vmin > vmax:
            return out
        if is_ndarray:
            out[np.where(input < vmin)] = vmin
            out[np.where(input > vmax)] = vmax
        else:
            out = max(out, vmin)
            out = min(out, vmax)
    return out
