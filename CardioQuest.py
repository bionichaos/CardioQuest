# Complete CardioQuest Game Script

import pygame
import numpy as np
import random
import matplotlib.pyplot as plt

# ---------------- ECG waveform generation functions ----------------

t_values = np.linspace(0, 5 * np.pi, 800)
# t_values = np.linspace(0, 2.5 * np.pi, 400)
mu = 2 * np.pi
sigma = 0.2
amplitude = 3.0

def gaussian(x, mu, sigma):
    return np.exp(-((x - mu) ** 2) / (2 * sigma ** 2))

def refined_r_wave(t, mu, sigma, amplitude):
    return amplitude * gaussian(t, mu, sigma)

def generate_full_waveform(t, qrs_variation_function=None):
    p_wave = np.sin(t)**2 if 0 <= t < np.pi else 0
    if qrs_variation_function is None:
        qrs = refined_r_wave(t, mu, sigma, amplitude)
    else:
        qrs = qrs_variation_function(t)
    s_wave = -0.5 * np.sin(t - 2.5 * np.pi)**3 if 2.5 * np.pi <= t < 3 * np.pi else 0
    t_wave = 0.5 * np.sin(t - 3 * np.pi)**2 if 3 * np.pi <= t < 4 * np.pi else 0
    return int(600/2 - (p_wave + qrs + s_wave + t_wave) * 100)

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
    return 600/2 - (p_wave + qrs + s_wave + t_wave) * 100

def no_q_wave(t):
    return 0 if 1.0 * np.pi <= t < 1.5 * np.pi else refined_r_wave(t, mu, sigma, amplitude)

def no_s_wave(t):
    p_wave = np.sin(t)**2 if 0 <= t < np.pi else 0
    qrs = refined_r_wave(t, mu, sigma, amplitude)
    s_wave = 0
    t_wave = 0.5 * np.sin(t - 3 * np.pi)**2 if 3 * np.pi <= t < 4 * np.pi else 0
    return 600/2 - (p_wave + qrs + s_wave + t_wave) * 100

def no_t_wave(t):
    p_wave = np.sin(t)**2 if 0 <= t < np.pi else 0
    qrs = refined_r_wave(t, mu, sigma, amplitude)
    s_wave = -0.5 * np.sin(t - 2.5 * np.pi)**3 if 2.5 * np.pi <= t < 3 * np.pi else 0
    t_wave = 0
    return 600/2 - (p_wave + qrs + s_wave + t_wave) * 100

# ---------------- Multi-segment waveform generation ----------------

def generate_multiple_waveforms(desired_length, segment_count=3):
    waveform_functions = [
        lambda t: generate_full_waveform(t),
        lambda t: generate_full_waveform(t, qrs_variation_1),
        lambda t: generate_full_waveform(t, qrs_variation_2),
        lambda t: generate_full_waveform(t, qrs_variation_3),
        lambda t: no_p_wave(t),
        lambda t: generate_full_waveform(t, no_q_wave),
        lambda t: no_s_wave(t),
        lambda t: no_t_wave(t)
    ]
    types = [0, 1, 1, 1, 1, 1, 1, 1]

    full_waveform = []
    full_types = []
    last_function_index = None
    while len(full_waveform) < desired_length:
        index = random.choice(range(len(waveform_functions)))
        while index == last_function_index:
            index = random.choice(range(len(waveform_functions)))
        last_function_index = index
        segment_waveform = [waveform_functions[index](t) for t in t_values]
        segment_types = [types[index]] * len(t_values)
        
        # Append segment waveform and types to the full waveform and full types
        full_waveform.extend(segment_waveform)
        full_types.extend(segment_types)

    # If the full_waveform is longer than the desired length, truncate it
    if len(full_waveform) > desired_length:
        truncation_length = len(full_waveform) - desired_length
        full_waveform = full_waveform[:-truncation_length]
        full_types = full_types[:-truncation_length]

    return full_waveform, full_types

# ---------------- Game Logic ----------------

pygame.init()
SCREEN_WIDTH_MULTIPLIER = 2
WIDTH, HEIGHT = 800 * SCREEN_WIDTH_MULTIPLIER, 600
WHITE, RED, GREEN, BLUE = (255, 255, 255), (255, 0, 0), (0, 255, 0), (0, 0, 255)
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("CardioQuest")
clock, font = pygame.time.Clock(), pygame.font.Font(None, 36)

score, scroll_speed, tagged, remainder = 0, 2, [], []
# waveform, waveform_types = generate_multiple_waveforms()
waveform, waveform_types = generate_multiple_waveforms(desired_length=WIDTH)
running = True

def update_scroll_speed():
    global scroll_speed
    scroll_speed = 2 + score // 50
    if scroll_speed < 1:
        scroll_speed = 1

# Adding debugging print statements to key parts of the game loop

def game_loop_with_debugging():
    global scroll_speed, waveform, waveform_types, tagged, score  # Declaring these as global
    print("Game loop iteration started")
    initial_length = len(waveform)
    print(f"Initial waveform length: {initial_length}")

    running = True
    while running:
        screen.fill(WHITE)

        # Draw instructions on the screen
        instructions_text = "Find abnormal ECG patterns! Avoid clicking on normal ECG."
        screen.blit(font.render(instructions_text, True, BLUE), (10, HEIGHT - 40))

        for event in pygame.event.get():
            print(f"Processing event: {event.type}")
            if event.type == pygame.QUIT: 
                running = False
            if event.type == pygame.MOUSEBUTTONDOWN:
                x, _ = pygame.mouse.get_pos()
                if 0 <= x < WIDTH:
                    index = x  # No need to adjust for scrolling here
                    if waveform_types[index] == 1:
                        score += 10
                    else:
                        score -= 10
                    if score < 0:
                        score = 0
                    tagged.append(x)
                update_scroll_speed()

        # Removing the left-most elements based on scroll_speed
        del waveform[:scroll_speed]
        del waveform_types[:scroll_speed]

        # Debugging: Print the waveform length after truncation
        print(f"After truncation, waveform length: {len(waveform)}")

        # Keep adding new waveforms until we reach the desired width
        missing_points = WIDTH - len(waveform)
        new_wave, new_types = generate_multiple_waveforms(desired_length=missing_points)
        transition_index = len(waveform)  # Store the index where the new waveform starts
        waveform.extend(new_wave)
        waveform_types.extend(new_types)

        # Debugging: Print the waveform length after appending new segments
        print(f"After appending, waveform length: {len(waveform)}")

        # Consistency check
        assert len(waveform) == len(waveform_types), f"Game loop mismatch! Waveform length: {len(waveform)}, Types length: {len(waveform_types)}"

        tagged = [t - scroll_speed for t in tagged if t - scroll_speed >= 0]

        # Drawing the waveform and tagged positions
        x_coords = list(range(len(waveform)))
        pygame.draw.lines(screen, RED, False, list(zip(x_coords[:transition_index], waveform[:transition_index])), 2)
        pygame.draw.lines(screen, BLUE, False, list(zip(x_coords[transition_index:], waveform[transition_index:])), 2)

        for t in tagged: 
            pygame.draw.circle(screen, GREEN, (t, waveform[int(t - x_coords[0])]), 5)

        # Displaying the current score
        screen.blit(font.render(f"Score: {score}", True, GREEN), (10, 10))

        assert len(waveform) == WIDTH, f"Waveform length mismatch! Expected {WIDTH}, but got {len(waveform)}"

        # Updating the display and setting the frame rate
        pygame.display.flip()
        clock.tick(30)

    pygame.quit()

# Commenting out the call to the function to avoid execution errors in this environment
game_loop_with_debugging()


# The drawing is not right
# the screen is not refreshed properly
# the waveform is not drawn properly