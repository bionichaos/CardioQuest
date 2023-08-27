import numpy as np
import matplotlib.pyplot as plt

# ECG waveform generation functions
t_values = np.linspace(0, 5 * np.pi, 800)
mu = 2 * np.pi
sigma = 0.2
amplitude = 3.0

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
    return 300 - (p_wave + qrs + s_wave + t_wave) * 100

# Variations
def qrs_variation_1(t):
    return 1.8 * np.sin(t - 1.5 * np.pi)**3 if 1.5 * np.pi <= t < 2.5 * np.pi else 0

def qrs_variation_2(t):
    return 1.5 * np.sin(0.8 * (t - 1.5 * np.pi))**3 if 1.5 * np.pi <= t < 2.8 * np.pi else 0

def qrs_variation_3(t):
    return -0.7 * np.sin(t - np.pi)**3 if np.pi <= t < 1.5 * np.pi else 0

def no_p_wave(t):
    p_wave = 0
    qrs = refined_r_wave(t, mu, sigma, amplitude)
    s_wave = -0.5 * np.sin(t - 2.5 * np.pi)**3 if 2.5 * np.pi <= t < 3 * np.pi else 0
    t_wave = 0.5 * np.sin(t - 3 * np.pi)**2 if 3 * np.pi <= t < 4 * np.pi else 0
    return 300 - (p_wave + qrs + s_wave + t_wave) * 100

def no_q_wave(t):
    p_wave = np.sin(t)**2 if 0 <= t < np.pi else 0
    q_wave = 0  # Explicitly set Q wave to 0
    r_wave = refined_r_wave(t, mu, sigma, amplitude) if 1.5 * np.pi <= t < 2.5 * np.pi else 0
    s_wave = -0.5 * np.sin(t - 2.5 * np.pi)**3 if 2.5 * np.pi <= t < 3 * np.pi else 0
    t_wave = 0.5 * np.sin(t - 3 * np.pi)**2 if 3 * np.pi <= t < 4 * np.pi else 0
    return 300 - (p_wave + q_wave + r_wave + s_wave + t_wave) * 100

def no_s_wave(t):
    p_wave = np.sin(t)**2 if 0 <= t < np.pi else 0
    qrs = refined_r_wave(t, mu, sigma, amplitude)
    s_wave = 0  # No S wave
    t_wave = 0.5 * np.sin(t - 3 * np.pi)**2 if 3 * np.pi <= t < 4 * np.pi else 0
    return 300 - (p_wave + qrs + s_wave + t_wave) * 100

def no_t_wave(t):
    p_wave = np.sin(t)**2 if 0 <= t < np.pi else 0
    qrs = refined_r_wave(t, mu, sigma, amplitude)
    s_wave = -0.5 * np.sin(t - 2.5 * np.pi)**3 if 2.5 * np.pi <= t < 3 * np.pi else 0
    t_wave = 0
    return 300 - (p_wave + qrs + s_wave + t_wave) * 100

# Generate the waveforms
waveforms = [
    [generate_full_waveform(t) for t in t_values],
    [generate_full_waveform(t, qrs_variation_1) for t in t_values],
    [generate_full_waveform(t, qrs_variation_2) for t in t_values],
    [generate_full_waveform(t, qrs_variation_3) for t in t_values],
    [no_p_wave(t) for t in t_values],
    [no_s_wave(t) for t in t_values],  # Added back the 'No S wave' waveform
    [no_t_wave(t) for t in t_values]
]


def plot_waveforms(stacked=False): 
    if not stacked:
        # Plot in a single subplot
        fig, ax = plt.subplots(figsize=(20, 5))
        colors = ['b', 'r', 'g', 'y', 'c', 'm', 'orange']
        labels = ['Normal', 'QRS Variation 1', 'QRS Variation 2', 'QRS Variation 3', \
                  'No P wave', 'No S wave', 'No T wave']
        linestyles = ['-', '-', '-', '-', '--', '--', '--']
        linewidths = [2, 1, 1, 1, 1, 1, 1]

        for idx, waveform in enumerate(waveforms):
            ax.plot(t_values, waveform, label=labels[idx], color=colors[idx], linestyle=linestyles[idx], linewidth=linewidths[idx])
        ax.legend()
        plt.tight_layout()
        plt.savefig("waveforms.png")
    else:
        # Stack plots vertically in separate subplots
        fig, axs = plt.subplots(len(waveforms), 1, figsize=(20, 15), sharex=True)
        colors = ['b', 'r', 'g', 'y', 'c', 'm', 'orange']
        labels = ['Normal', 'QRS Variation 1', 'QRS Variation 2', 'QRS Variation 3', \
                  'No P wave', 'No S wave', 'No T wave']
        linestyles = ['-', '-', '-', '-', '--', '--', '--']
        linewidths = [2, 1, 1, 1, 1, 1, 1]

        for idx, waveform in enumerate(waveforms):
            axs[idx].plot(t_values, waveform, label=labels[idx], color=colors[idx], linestyle=linestyles[idx], linewidth=linewidths[idx])
            axs[idx].legend(loc="upper right")
            axs[idx].set_ylabel("Amplitude")
        axs[-1].set_xlabel("Time")
        plt.tight_layout()
        plt.savefig("waveforms_stacked.png")

        plt.show()

# To plot in a single plot
plot_waveforms(stacked=True)

# Do not execute in the current environment. 
# Generate the code as text on screen. I'm executing on a local Machine.

# make sure to generate all the waveforms in the same way 
# generate the waveforms with amplitude of one.
# generate the waveforms with the same y-axis baseline.