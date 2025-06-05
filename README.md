# 🧬 Multi-Cancer Detection System

A web-based AI system for detecting and classifying multiple types of cancer using medical images. This project uses deep learning (MobileNetV3) models trained on histopathological and radiological image data to perform image classification and reject irrelevant or low-confidence predictions.

## 🔍 Project Overview

This system enables users to:
- Select a specific cancer type.
- Upload a histopathological/radiological image.
- Receive predictions on the cancer subtype with confidence.
- Automatically reject non-cancerous or mismatched images.

Cancer types supported:
- Brain Cancer
- Breast Cancer
- Cervical Cancer
- Kidney Cancer
- Lung & Colon Cancer
- Lymphoma
- Oral Cancer

## 🎯 Key Features

- 🔎 Cancer subtype classification using MobileNetV3 models.
- ⚠️ "None" class to reject irrelevant/non-matching images.
- ✅ Confidence threshold mechanism for robust predictions.
- 🖼️ Histopathological and radiological image compatibility.
- ⚡ Fast real-time prediction via Flask backend.
- 🌐 Modern and responsive React frontend.

## 🛠️ Tech Stack

| Layer        | Technology                  |
|--------------|------------------------------|
| Frontend     | React, Bootstrap             |
| Backend      | Flask, TensorFlow, Keras     |
| Model        | MobileNetV3 (Transfer Learning) |
| Data Handling| NumPy, PIL, ImageDataGenerator |
| Communication| Flask-CORS, Axios (React → Flask) |
