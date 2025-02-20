import { throttle } from "lodash";

// Render predictions on the canvas
export const renderPredictions = (predictions, ctx) => {
  // Clear the canvas before rendering new predictions
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Font settings for labels
  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";

  // Render each prediction
  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction.bbox;

    // Check if the detected object is a person
    const isPerson = prediction.class === "person";

    // Set bounding box style
    ctx.strokeStyle = isPerson ? "#FF0000" : "#00FFFF"; // Red for person, cyan for others
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);

    // Fill the bounding box with a semi-transparent color
    ctx.fillStyle = `rgba(255, 0, 0, ${isPerson ? 0.2 : 0})`;
    ctx.fillRect(x, y, width, height);

    // Draw label background and text
    drawLabel(ctx, prediction.class, prediction.score, x, y, isPerson);

    // Play alarm if a person is detected
    if (isPerson) {
      playAudio();
    }
  });
};

// Draw label with background
const drawLabel = (ctx, className, score, x, y, isPerson) => {
  const text = `${className} (${Math.round(score * 100)}%)`;
  const textWidth = ctx.measureText(text).width;
  const textHeight = 16; // Font size is 16px

  // Draw label background
  ctx.fillStyle = isPerson ? "#FF0000" : "#00FFFF";
  ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

  // Draw label text
  ctx.fillStyle = "#000000"; // Black text
  ctx.fillText(text, x, y);
};

// Throttled audio playback function
const playAudio = throttle(() => {
  try {
    const audio = new Audio("/alarmAlert.mp3");
    audio.play().catch((error) => {
      console.error("Failed to play audio:", error);
    });
  } catch (error) {
    console.error("Error loading audio:", error);
  }
}, 2000); // Throttle to once every 2 seconds
