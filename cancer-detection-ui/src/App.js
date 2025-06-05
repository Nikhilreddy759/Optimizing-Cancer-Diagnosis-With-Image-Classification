import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [selectedCancer, setSelectedCancer] = useState("");
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cancerTypes = {
    brain_cancer: "Brain Cancer",
    breast_cancer: "Breast Cancer",
    cervical_cancer: "Cervical Cancer",
    kidney_cancer: "Kidney Cancer",
    lung_colon_cancer: "Lung & Colon Cancer",
    lymphoma: "Lymphoma",
    oral_cancer: "Oral Cancer",
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCancer || !image) {
      setError("Please select a cancer type and upload an image.");
      return;
    }

    setLoading(true);
    setError("");
    setPrediction(null);

    const formData = new FormData();
    formData.append("cancer_type", selectedCancer);
    formData.append("image", image);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error predicting the image. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="display-5 fw-semibold text-primary">Cancer Detection</h2>
        <p className="text-muted">Select a cancer type and upload an image to get predictions.</p>
      </div>

      <div className="card shadow-lg p-4 rounded-4 border-0 form-card mx-auto" style={{ maxWidth: "700px" }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-medium">Select Cancer Type</label>
            <select
              className="form-select form-control-lg rounded-pill"
              onChange={(e) => setSelectedCancer(e.target.value)}
            >
              <option value="">-- Select --</option>
              {Object.entries(cancerTypes).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium">Upload Image</label>
            <input
              type="file"
              className="form-control form-control-lg rounded-pill"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-gradient-primary w-100 py-2 rounded-pill fw-bold"
            disabled={loading}
          >
            {loading ? "Predicting..." : "Submit"}
          </button>
        </form>

        
        {/* Error message */}
        {error && (
          <div className="alert alert-danger mt-3 rounded-3 fw-medium">{error}</div>
        )}

        {/* Prediction result */}
        {prediction && (
          <div className="prediction-card mt-4 shadow-sm p-4 rounded-4">
            <div className="d-flex align-items-center mb-3">
              <div className="prediction-icon me-3">🔬</div>
              <h5 className="mb-0 fw-bold text-success">Prediction Result</h5>
            </div>
            <div className="text-muted mb-2">
              The model has analyzed your image and returned the following:
            </div>
            <div className="mb-2">
              <span className="fw-semibold text-dark">Class:</span>{" "}
              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill text-capitalize">
                {prediction.prediction}
              </span>
            </div>
            <div>
              <span className="fw-semibold text-dark">Confidence:</span>{" "}
              <span className="badge bg-info-subtle text-info px-3 py-2 rounded-pill">
                {prediction.confidence.toFixed(2)}%
              </span>
            </div>
          </div>
        )}
        {/* Always-Visible Disclaimer */}
      {/* <div className="alert alert-warning mt-4 rounded-4 p-3 small">
          ⚠️ <strong>AI Disclaimer:</strong> This tool is powered by AI and may not always be
           accurate. Always consult a qualified medical professional for official diagnosis.
        </div> */}
      </div>


    </div>
  );
}

export default App;
