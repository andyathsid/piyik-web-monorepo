from inference_sdk import InferenceHTTPClient
import supervision as sv
import cv2

class EggDetector:
    _instance = None
    client = None
    
    def __new__(cls):
        if cls._instance is None:
            print("Initializing Egg Detection model...")
            cls._instance = super(EggDetector, cls).__new__(cls)
            cls.client = InferenceHTTPClient(
                api_url="https://detect.roboflow.com",
                api_key="Fo9HQJW3695XWsuyPt2k"
            )
        return cls._instance

    def detect_and_annotate(self, image):
        """Detect eggs and annotate image"""
        # Get predictions
        result = self.client.infer(image, model_id="egg-candling_f2/2")
        
        # Extract labels
        labels = [item["class"] for item in result["predictions"]]
        
        # Create detections object
        detections = sv.Detections.from_inference(result)
        
        # Setup annotators dengan warna yang dibalik
        # Hijau (#00FF00) untuk fer, Merah (#FF0000) untuk unf
        colors = sv.ColorPalette.from_hex(['#00FF00', '#FF0000'])  # [fer, unf]
        label_annotator = sv.LabelAnnotator(color=colors)
        box_annotator = sv.BoxAnnotator(color=colors)
        
        # Annotate image
        annotated_image = box_annotator.annotate(
            scene=image, detections=detections)
        annotated_image = label_annotator.annotate(
            scene=annotated_image, detections=detections, labels=labels)
            
        return annotated_image, result 