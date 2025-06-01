// Dictionary to map model predictions to game controls
const PREDICTION_TO_CONTROL = {
  "like": "up",
  "dislike": "down",
  "three2": "left",
  "ok": "right"
};

async function getPredictedLabel(landmarks) {
  try {
      // Convert MediaPipe landmark objects (with x, y, z) to a flat array
      const features = landmarks.flatMap(point => [point.x, point.y, point.z]);

      // Make API call to backend
      const response = await fetch('https://hand-gesture-api-production-8d7f.up.railway.app/predict', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              features: features
          })
      });

      if (!response.ok) {
          console.error('API call failed:', response.statusText);
          return null;
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Map the predicted gesture to game control
      const control = PREDICTION_TO_CONTROL[data.predicted_label];

      if (!control) {
          console.warn(`No mapping found for gesture: ${data.predicted_label}`);
          return null;
      }

      return control;

  } catch (error) {
      console.error('Error calling prediction API:', error);
      return null;
  }
}
