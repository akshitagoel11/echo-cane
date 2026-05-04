from ultralytics import YOLO

# 1. Load a pretrained YOLOv8n model
model = YOLO('yolov8n.pt')

# 2. Train the model
# Using Indian Driving Dataset (IDD) + COCO is recommended
# Add custom classes: auto-rickshaw, cow, pothole
# Note: You need a yaml file defining your dataset paths and classes
results = model.train(
    data='idd_plus_coco.yaml', 
    epochs=100, 
    imgsz=640, 
    batch=16,
    device=0 # use GPU
)

# 3. Export to TFLite for mobile use
model.export(format='tflite', imgsz=320, int8=True)

print("Training complete. TFLite model exported to runs/detect/train/weights/yolov8n_saved_model/")
