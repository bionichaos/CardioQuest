// ECG waveform generation functions without qrs_variation_3

const tValues = new Array(800).fill(0).map((_, index) => (index / 800) * 5 * Math.PI);
const mu = 2 * Math.PI;
const sigma = 0.2;
const amplitude = 3;

function gaussian(x, mu, sigma) {
    return Math.exp(-((x - mu) ** 2) / (2 * sigma ** 2));
}

function refinedRWave(t, mu, sigma, amplitude) {
    return amplitude * gaussian(t, mu, sigma);
}

function generateFullWaveform(t, qrsVariationFunction = null) {
    const pWave = (0 <= t && t < Math.PI) ? Math.sin(t) ** 2 : 0;
    const qrs = (qrsVariationFunction === null) ? refinedRWave(t, mu, sigma, amplitude) : qrsVariationFunction(t);
    const sWave = (2.5 * Math.PI <= t && t < 3 * Math.PI) ? -0.5 * Math.sin(t - 2.5 * Math.PI) ** 3 : 0;
    const tWave = (3 * Math.PI <= t && t < 4 * Math.PI) ? 0.5 * Math.sin(t - 3 * Math.PI) ** 2 : 0;
    return 300 - (pWave + qrs + sWave + tWave) * -100;
}

// Variations
function qrsVariation1(t) {
    const pWave = (0 <= t && t < Math.PI) ? Math.sin(t) ** 2 : 0;
    const qrs = refinedRWave(t, mu, 4*sigma, 0.5*amplitude);
    const sWave = (2.5 * Math.PI <= t && t < 3 * Math.PI) ? -0.5 * Math.sin(t - 2.5 * Math.PI) ** 3 : 0;
    const tWave = (3 * Math.PI <= t && t < 4 * Math.PI) ? 0.5 * Math.sin(t - 3 * Math.PI) ** 2 : 0;
    return 300 - (pWave + qrs + sWave + tWave) * -100;
}

function qrsVariation2(t) {
    const pWave = (0 <= t && t < Math.PI) ? Math.sin(t) ** 2 : 0;
    const qrs = refinedRWave(t, 1.3 * mu, sigma, 0.8*amplitude); // Different QRS complex
    const sWave = (2.5 * Math.PI <= t && t < 3 * Math.PI) ? -0.5 * Math.sin(t - 2.5 * Math.PI) ** 3 : 0;
    const tWave = (3 * Math.PI <= t && t < 4 * Math.PI) ? 0.5 * Math.sin(t - 3 * Math.PI) ** 2 : 0;
    return 300 - (pWave + qrs + sWave + tWave) * -100;
}

function noPWave(t) {
    const pWave = 0;
    const qrs = refinedRWave(t, mu, sigma, amplitude);
    const sWave = (2.5 * Math.PI <= t && t < 3 * Math.PI) ? -0.5 * Math.sin(t - 2.5 * Math.PI) ** 3 : 0;
    const tWave = (3 * Math.PI <= t && t < 4 * Math.PI) ? 0.5 * Math.sin(t - 3 * Math.PI) ** 2 : 0;
    return 300 - (pWave + qrs + sWave + tWave) * -100;
}

function noSWave(t) {
    const pWave = (0 <= t && t < Math.PI) ? Math.sin(t) ** 2 : 0;
    const qrs = refinedRWave(t, mu, sigma, amplitude);
    const sWave = 0; // No S wave
    const tWave = (3 * Math.PI <= t && t < 4 * Math.PI) ? 0.5 * Math.sin(t - 3 * Math.PI) ** 2 : 0;
    return 300 - (pWave + qrs + sWave + tWave) * -100;
}

function noTWave(t) {
    const pWave = (0 <= t && t < Math.PI) ? Math.sin(t) ** 2 : 0;
    const qrs = refinedRWave(t, mu, sigma, amplitude);
    const sWave = (2.5 * Math.PI <= t && t < 3 * Math.PI) ? -0.5 * Math.sin(t - 2.5 * Math.PI) ** 3 : 0;
    const tWave = 0;
    return 300 - (pWave + qrs + sWave + tWave) * -100;
}

const waveforms = [
    tValues.map(t => generateFullWaveform(t)),
    tValues.map(t => generateFullWaveform(t, qrsVariation1)),
    tValues.map(t => generateFullWaveform(t, qrsVariation2)),
    tValues.map(t => noPWave(t)),
    tValues.map(t => noSWave(t)),
    tValues.map(t => noTWave(t))
];

// this is waveforms.js
// qrsVariation1 and qrsVariation2 look very different
// They should just have different qrs Everything else should be the same As normal ecg.
// qrsVariation1 and qrsVariation2 are missing pWave + qrs + sWave + tWave