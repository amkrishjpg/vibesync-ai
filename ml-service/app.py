import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
import os
os.environ["LOKY_MAX_CPU_COUNT"] = "4"
import numpy as np
import json
import sys
import random
import re

# =========================
# LOAD DATA
# =========================
df = pd.read_csv("../ml-service/cleaned_dataset.csv")

features = [
    "Danceability",
    "Energy",
    "Loudness",
    "Speechiness",
    "Acousticness"
]

df = df[["Artist", "Track"] + features]
df = df.dropna()

# =========================
# SCALING
# =========================
scaler = MinMaxScaler()
scaled_features = scaler.fit_transform(df[features])

# =========================
# MODEL TRAINING 
# =========================
kmeans = KMeans(n_clusters=5, random_state=42)
clusters = kmeans.fit_predict(scaled_features)

df["cluster"] = clusters

# =========================
# TEXT PROCESSING
# =========================
def preprocess_text(text):
    text = text.lower().strip()
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text

# =========================
# MOOD → VECTOR
# =========================
def mood_to_vector(mood, intensity):
    mood = preprocess_text(mood)

    if "sad" in mood or "cry" in mood:
        base = np.array([0.25, 0.20, 0.30, 0.10, 0.90])
    elif "happy" in mood:
        base = np.array([0.85, 0.90, 0.65, 0.15, 0.20])
    elif "chill" in mood:
        base = np.array([0.40, 0.30, 0.35, 0.08, 0.95])
    else:
        base = np.array([0.5, 0.5, 0.5, 0.1, 0.5])

    intensity = float(intensity)
    base = base * intensity

    return base.reshape(1, -1)

# =========================
# RECOMMENDATION
# =========================
def recommend(mood, intensity):
    mood_vector = mood_to_vector(mood, intensity)

    # Find closest cluster
    cluster_id = kmeans.predict(mood_vector)[0]

    # Filter songs from that cluster
    cluster_songs = df[df["cluster"] == cluster_id]

    # Similarity inside cluster
    similarities = cosine_similarity(
        mood_vector,
        scaler.transform(cluster_songs[features])
    )[0]

    top_indices = similarities.argsort()[-5:][::-1]

    results = []

    for idx in top_indices:
        song = cluster_songs.iloc[idx]

        results.append({
            "title": song["Track"],
            "artist": song["Artist"]
        })

    return results

# =========================
# INPUT / OUTPUT
# =========================
try:
    input_data = json.loads(sys.stdin.read())
    mood_input = input_data.get("mood", "")
    intensity = input_data.get("intensity", 0.5)

    output = recommend(mood_input, intensity)
    print(json.dumps(output))

except Exception as e:
    print(json.dumps({
        "error": str(e)
    }))