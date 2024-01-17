import numpy as np
import matplotlib.pyplot as plt

from waveforms import t_values, waveforms

def plot_waveforms(): 
        # Plot in a single subplot
        fig, ax = plt.subplots(figsize=(20, 5))
        colors = ['b', 'r', 'g', 'c', 'm', 'orange']
        labels = ['Normal', 'QRS Variation 1', 'QRS Variation 2', 'No P wave', 'No S wave', 'No T wave']
        linestyles = ['-', '-', '-', '--', '--', '--']
        linewidths = [2, 1, 1, 1, 1, 1]

        for idx, waveform in enumerate(waveforms):
            ax.plot(t_values, waveform, label=labels[idx], color=colors[idx], linestyle=linestyles[idx], linewidth=linewidths[idx])
        ax.legend()
        plt.tight_layout()
        plt.savefig("waveforms_corrected.png")
        
        # Stack plots vertically in separate subplots
        fig, axs = plt.subplots(len(waveforms), 1, figsize=(20, 15), sharex=True, sharey=True)
        colors = ['b', 'r', 'g', 'c', 'm', 'orange']
        labels = ['Normal', 'QRS Variation 1', 'QRS Variation 2', 'No P wave', 'No S wave', 'No T wave']
        linestyles = ['-', '-', '-', '--', '--', '--']
        linewidths = [2, 1, 1, 1, 1, 1]

        for idx, waveform in enumerate(waveforms):
            axs[idx].plot(t_values, waveform, label=labels[idx], color=colors[idx], linestyle=linestyles[idx], linewidth=linewidths[idx])
            axs[idx].legend(loc="upper right")
            axs[idx].set_ylabel("Amplitude")
        axs[-1].set_xlabel("Time")
        plt.tight_layout()
        plt.savefig("waveforms_stacked_corrected.png")

        plt.show()

# Re-plot the waveforms without qrs_variation_3
plot_waveforms()

