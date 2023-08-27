import pygame
import random
from waveforms import t_values, generate_full_waveform, \
    qrs_variation_1, qrs_variation_2, \
        no_p_wave , no_s_wave, no_t_wave

# Game constants
HEIGHT = 600
WIDTH = 800
WHITE, RED, GREEN, BLUE = (255, 255, 255), (255, 0, 0), (0, 255, 0), (0, 0, 255)

def generate_new_waveform_segment():
    abnormal_waveforms = [
        qrs_variation_1, qrs_variation_2,
        no_p_wave, no_s_wave, no_t_wave
    ]
    waveform_names = [
        "QRS Variation 1", "QRS Variation 2",
        "No P wave", "No S wave", "No T wave"
    ]

    if random.choice([True, False]):  # 50% chance
        waveform_function = generate_full_waveform
        waveform_type = 0  # Normal
        print("Selected Waveform: Normal")
    else:
        index = random.randrange(len(abnormal_waveforms))
        waveform_function = abnormal_waveforms[index]
        waveform_type = 1  # Abnormal
        print(f"Selected Waveform: {waveform_names[index]}")

    new_waveform = [waveform_function(t) for t in t_values]
    return new_waveform, waveform_type

def scale_waveform_amplitude(waveform, middle, desired_range=200):
    """Scale the amplitude of the waveform to the desired range, ensuring a consistent baseline."""
    min_val = min(waveform)
    max_val = max(waveform)
    
    if max_val == min_val:  # Avoid division by zero
        return [middle] * len(waveform)
    
    # Calculate the scaling factor based on the desired range and the range of the waveform
    scaling_factor = desired_range / (max_val - min_val)
    
    # Scale the waveform values by the scaling factor
    scaled_waveform = [
        middle + (value - min_val) * scaling_factor
        for value in waveform
    ]

    return scaled_waveform



pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("CardioQuest")
clock, font = pygame.time.Clock(), pygame.font.Font(None, 36)

# Initialize waveform with a mix of normal and abnormal segments
waveform, waveform_types = [], []
for _ in range(WIDTH // len(t_values)):
    new_waveform, waveform_type = generate_new_waveform_segment()
    waveform.extend(new_waveform)
    waveform_types.extend([waveform_type] * len(t_values))

score, scroll_speed, tagged = 0, 2, []
running = True

def update_scroll_speed():
    global scroll_speed
    scroll_speed = 2 + score // 50
    if scroll_speed < 1:
        scroll_speed = 1

while running:
    screen.fill(WHITE)

    instructions_text = "Find abnormal ECG patterns! Avoid clicking on normal ECG."
    screen.blit(font.render(instructions_text, True, BLUE), (10, HEIGHT - 40))

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            x, _ = pygame.mouse.get_pos()
            index = x + scroll_speed
            if 0 <= index < len(waveform_types):
                label = waveform_types[index]
                print("Current Label:", "Normal" if label == 0 else "Abnormal")
                
                if label == 1:
                    score += 10
                else:
                    score -= 10

                if score < 0:
                    score = 0

                tagged.append(index)
            update_scroll_speed()

    waveform = waveform[scroll_speed:]
    waveform_types = waveform_types[scroll_speed:]

    middle = HEIGHT // 2
    while len(waveform) < WIDTH:
        new_waveform, new_waveform_type = generate_new_waveform_segment()
        waveform.extend(new_waveform)
        waveform_types.extend([new_waveform_type] * len(t_values))

    tagged = [t - scroll_speed for t in tagged if 0 <= t - scroll_speed < len(waveform)]

    offset = HEIGHT // 6
    
    # Adjust the y-coordinates to correct the inversion
    pygame.draw.lines(screen, RED, False, [(x, HEIGHT - y - offset) for x, y in enumerate(waveform)], 2)

    for t in tagged:
        if 0 <= t < len(waveform):
            # pygame.draw.circle(screen, GREEN, (t, waveform[t] + offset), 5)
            pygame.draw.circle(screen, GREEN, (t, HEIGHT - waveform[t] - offset), 5)


    screen.blit(font.render(f"Score: {score}", True, GREEN), (10, 10))

    pygame.display.flip()
    clock.tick(30)

pygame.quit()
