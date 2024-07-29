// src/SignalGenerator.js
import React, { useState, useEffect } from 'react';

const SignalGenerator = () => {
  const frequency = 250;  // Frequency to be played
  const dbLevels = Array.from({ length: 14 }, (_, i) => -10 + i * 10);  // dB levels from -10 to 120 in steps of 10
  const [isPlaying, setIsPlaying] = useState(false);  // State to manage whether sound is playing
  const [currentDb, setCurrentDb] = useState(null);  // State to track the current dB level
  const [displayDb, setDisplayDb] = useState(null);  // State to display the current dB level
  const [audioContext, setAudioContext] = useState(null);  // State to store the audio context
  const [shouldStop, setShouldStop] = useState(false);  // State to control stopping the playback

  const playSound = async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    setAudioContext(audioCtx);

    setIsPlaying(true);  // Set the isPlaying state to true to disable the button
    setShouldStop(false);  // Ensure shouldStop is false when starting playback

    for (let i = 0; i < dbLevels.length; i++) {
      if (shouldStop) break;  // Stop the loop if shouldStop is true
      setCurrentDb(dbLevels[i]);  // Update the current dB level
      setDisplayDb(dbLevels[i]);  // Update the display dB level
      await playFrequency(audioCtx, frequency, dbLevels[i]);  // Play the frequency with the current dB level
      if (i < dbLevels.length - 1 && !shouldStop) await sleep(4000);  // 2-second play time + 2-second stop time
    }

    setIsPlaying(false);  // Set the isPlaying state to false to enable the button
    if (!shouldStop) setCurrentDb(null);  // Reset the current dB display if not manually stopped
  };

  const playFrequency = (audioCtx, frequency, dbLevel) => {
    return new Promise((resolve) => {
      const osc = audioCtx.createOscillator();  // Create an oscillator node
      const gain = audioCtx.createGain();  // Create a gain node

      osc.type = 'sine';  // Set the type of waveform
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);  // Set the frequency

      // Connect oscillator to gain node and gain node to the destination
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      // Convert dB level to linear gain
      const gainValue = Math.pow(10, dbLevel / 20);
      gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);

      // Start oscillator
      osc.start();

      // Stop oscillator after 2 seconds
      setTimeout(() => {
        osc.stop();
        resolve();
      }, 2000);  // Play each frequency for 2 seconds
    });
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));  // Sleep function to pause for the given duration
  };

  const handleDisplayDb = () => {
    setShouldStop(true);  // Set shouldStop to true to stop playback
    if (audioContext) {
      audioContext.close();  // Close the audio context to stop all sounds
      setAudioContext(null);  // Reset the audio context
    }
    setIsPlaying(false);  // Ensure the play button is re-enabled
  };

  useEffect(() => {
    if (shouldStop) {
      setCurrentDb(null);  // Clear current dB when stopping
    }
  }, [shouldStop]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button onClick={playSound} disabled={isPlaying}>
          Play Frequency
        </button>
        <p>Current Frequency: {frequency} Hz</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button onClick={handleDisplayDb} disabled={!isPlaying}>
          Terminate Current Frequency
        </button>
        <p>Current dB Level: {displayDb !== null ? displayDb : 'N/A'} dB</p>
      </div>
    </div>
  );
};

export default SignalGenerator;
