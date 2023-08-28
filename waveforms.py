import numpy as np
import matplotlib.pyplot as plt

# ECG waveform generation functions without qrs_variation_3

t_values = np.linspace(0, 5 * np.pi, 800)
mu = 2 * np.pi
sigma = 0.2
amplitude = 3

def gaussian(x, mu, sigma):
    """Generates a Gaussian wave based on the provided parameters."""
    return np.exp(-((x - mu) ** 2) / (2 * sigma ** 2))

def refined_r_wave(t, mu, sigma, amplitude):
    """Generates the R-wave component of the ECG."""
    return amplitude * gaussian(t, mu, sigma)

def generate_full_waveform(t, qrs_variation_function=None):
    """Generates the full ECG waveform."""
    p_wave = np.sin(t)**2 if 0 <= t < np.pi else 0
    if qrs_variation_function is None:
        qrs = refined_r_wave(t, mu, sigma, amplitude)
    else:
        qrs = qrs_variation_function(t)
    s_wave = -0.5 * np.sin(t - 2.5 * np.pi)**3 if 2.5 * np.pi <= t < 3 * np.pi else 0
    t_wave = 0.5 * np.sin(t - 3 * np.pi)**2 if 3 * np.pi <= t < 4 * np.pi else 0
    return 300 - (p_wave + qrs + s_wave + t_wave) * -100

# Variations
def qrs_variation_1(t):
    return 1.8 * np.sin(t - 1.5 * np.pi)**3 if 1.5 * np.pi <= t < 2.5 * np.pi else 0

def qrs_variation_2(t):
    return 1.5 * np.sin(0.8 * (t - 1.5 * np.pi))**3 if 1.5 * np.pi <= t < 2.8 * np.pi else 0

def qrs_variation_1(t):
    pWave = np.sin(t) ** 2 if 0 <= t < np.pi else 0
    qrs = refined_r_wave(t, mu, 4 * sigma, 0.5 * amplitude)
    sWave = -0.5 * np.sin(t - 2.5 * np.pi) ** 3 if 2.5 * np.pi <= t < 3 * np.pi else 0
    tWave = 0.5 * np.sin(t - 3 * np.pi) ** 2 if 3 * np.pi <= t < 4 * np.pi else 0
    return 300 - (pWave + qrs + sWave + tWave) * -100

def qrs_variation_2(t):
    pWave = np.sin(t) ** 2 if 0 <= t < np.pi else 0
    qrs = refined_r_wave(t, 1.3 * mu, sigma, 0.8 * amplitude) # Different QRS complex
    sWave = -0.5 * np.sin(t - 2.5 * np.pi) ** 3 if 2.5 * np.pi <= t < 3 * np.pi else 0
    tWave = 0.5 * np.sin(t - 3 * np.pi) ** 2 if 3 * np.pi <= t < 4 * np.pi else 0
    return 300 - (pWave + qrs + sWave + tWave) * -100

def no_p_wave(t):
    p_wave = 0
    qrs = refined_r_wave(t, mu, sigma, amplitude)
    s_wave = -0.5 * np.sin(t - 2.5 * np.pi)**3 if 2.5 * np.pi <= t < 3 * np.pi else 0
    t_wave = 0.5 * np.sin(t - 3 * np.pi)**2 if 3 * np.pi <= t < 4 * np.pi else 0
    return 300 - (p_wave + qrs + s_wave + t_wave) * -100

def no_s_wave(t):
    p_wave = np.sin(t)**2 if 0 <= t < np.pi else 0
    qrs = refined_r_wave(t, mu, sigma, amplitude)
    s_wave = 0  # No S wave
    t_wave = 0.5 * np.sin(t - 3 * np.pi)**2 if 3 * np.pi <= t < 4 * np.pi else 0
    return 300 - (p_wave + qrs + s_wave + t_wave) * -100

def no_t_wave(t):
    p_wave = np.sin(t)**2 if 0 <= t < np.pi else 0
    qrs = refined_r_wave(t, mu, sigma, amplitude)
    s_wave = -0.5 * np.sin(t - 2.5 * np.pi)**3 if 2.5 * np.pi <= t < 3 * np.pi else 0
    t_wave = 0
    return 300 - (p_wave + qrs + s_wave + t_wave) * -100

waveforms = [
    [generate_full_waveform(t) for t in t_values],
    [generate_full_waveform(t, qrs_variation_1) for t in t_values],
    [generate_full_waveform(t, qrs_variation_2) for t in t_values],
    [no_p_wave(t) for t in t_values],
    [no_s_wave(t) for t in t_values],
    [no_t_wave(t) for t in t_values]
]

# this is waforms.py
# can you convert This into javascript?