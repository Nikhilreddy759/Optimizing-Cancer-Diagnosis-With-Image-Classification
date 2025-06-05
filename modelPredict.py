from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import os
from tensorflow.keras.preprocessing import image
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Model paths and class names
MODEL_PATHS = {
    "brain_cancer": "D:/Projects/MultiCancer/brain_cancer/RE Brain Cancer V3.h5",
    "breast_cancer": "D:/Projects/MultiCancer/breast_cancer/RE Breast Cancer.h5",
    "cervical_cancer": "D:/Projects/MultiCancer/cervical_cancer/RE Cervical Cancer V3.h5",
    "kidney_cancer": "D:/Projects/MultiCancer/kidney_cancer/RE Kidney Cancer V3.h5",
    "lung_colon_cancer": "D:/Projects/MultiCancer/lung_and_colon_cancer/RE Lung And Colon Cancer V3.h5",
    "lymphoma": "D:/Projects/MultiCancer/lymphoma_cancer/RE Lymphoma Cancer V3.h5",
    "oral_cancer": "D:/Projects/MultiCancer/oral_cancer/RE Oral Cancer V3.h5"
}

# Add 'none' class to each cancer type
CLASS_NAMES = {
    "brain_cancer": ["brain_glioma", "brain_menin", "brain_tumor", "none"],
    "breast_cancer": ["breast_benign", "breast_malignant", "none"],
    "cervical_cancer": ["Cervix_dyk", "Cervix_koc", "Cervix_mep", "Cervix_pab", "Cervix_sfi", "none"],
    "kidney_cancer": ["kidney_normal", "kidney_tumor", "none"],
    "lung_colon_cancer": ["colon_aca", "colon_bnt", "lung_aca", "lung_bnt", "lung_scc", "none"],
    "lymphoma": ["lymph_cll", "lymph_fl", "lymph_mcl", "none"],
    "oral_cancer": ["oral_normal", "oral_scc", "none"]
}

# Load all models
models = {}
for cancer_type, path in MODEL_PATHS.items():
    if os.path.exists(path):
        models[cancer_type] = tf.keras.models.load_model(path)

def preprocess_input_image(img):
    img = img.resize((224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.mobilenet_v3.preprocess_input(img_array)
    return img_array

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files or "cancer_type" not in request.form:
        return jsonify({"error": "Missing file or cancer type"}), 400

    cancer_type = request.form["cancer_type"]
    if cancer_type not in models:
        return jsonify({"error": "Invalid cancer type"}), 400

    file = request.files["image"]
    img = Image.open(file.stream)
    img_array = preprocess_input_image(img)

    model = models[cancer_type]
    prediction = model.predict(img_array)
    class_index = np.argmax(prediction)
    confidence = float(np.max(prediction)) * 100
    class_label = CLASS_NAMES[cancer_type][class_index]

    # Confidence th reshold
    CONFIDENCE_THRESHOLD = 90

    # Reject low-confidence predictions
    if confidence < CONFIDENCE_THRESHOLD:
        return jsonify({
            "error": "Low confidence prediction. The image may not belong to the selected cancer type."
        }), 400

    # Reject if predicted class is 'none'
    if class_label.lower() == "none":
        return jsonify({
            "error": "The uploaded image does not match the selected cancer type. Please upload a valid image."
        }), 400

    return jsonify({"prediction": class_label, "confidence": confidence})

if __name__ == "__main__":
    app.run(debug=False)
