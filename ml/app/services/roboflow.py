from roboflow import Roboflow

class RoboflowModel:
    _instance = None
    model = None
    
    def __new__(cls):
        if cls._instance is None:
            print("Initializing Roboflow model...")
            cls._instance = super(RoboflowModel, cls).__new__(cls)
            rf = Roboflow(api_key="Fo9HQJW3695XWsuyPt2k")
            project = rf.workspace().project("egg-candling_f2")
            cls.model = project.version(2).model
        return cls._instance