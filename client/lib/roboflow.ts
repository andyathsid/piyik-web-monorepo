const ROBOFLOW_API_KEY = "Fo9HQJW3695XWsuyPt2k";
const ROBOFLOW_MODEL = "egg-candling_f2/2";

export interface RoboflowPrediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: 'fer' | 'unf';
  class_id: number;
  detection_id: string;
}

export interface RoboflowResponse {
  predictions: RoboflowPrediction[];
}

export async function detectEggFertility(base64Image: string): Promise<RoboflowResponse> {
  try {
    const response = await fetch(
      `https://detect.roboflow.com/${ROBOFLOW_MODEL}?api_key=${ROBOFLOW_API_KEY}&labels=true&format=json`,
      {
        method: "POST",
        body: base64Image,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling Roboflow API:", error);
    throw error;
  }
} 