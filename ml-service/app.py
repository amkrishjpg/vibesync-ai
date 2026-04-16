import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import sys
import json

# Load dataset
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

# Normalize
scaler = MinMaxScaler()
scaled_features = scaler.fit_transform(df[features])

# 🔥 Convert mood → vector
def mood_to_vector(mood):
    mood = mood.lower()

    if "happy" in mood:
        return [0.8, 0.9, 0.6, 0.1, 0.2]
    elif "sad" in mood:
        return [0.3, 0.2, 0.3, 0.1, 0.8]
    elif "chill" in mood:
        return [0.4, 0.3, 0.4, 0.1, 0.9]
    else:
        return [0.5, 0.5, 0.5, 0.1, 0.5]

# Recommendation function
def recommend(mood):
    mood_vector = np.array(mood_to_vector(mood)).reshape(1, -1)

    similarities = cosine_similarity(mood_vector, scaled_features)[0]
    top_indices = similarities.argsort()[-5:][::-1]

    results = []
    for idx in top_indices:
        results.append({
            "title": df.iloc[idx]["Track"],
            "artist": df.iloc[idx]["Artist"]
        })

    return results

# 🔥 Get mood from backend
mood_input = sys.argv[1]

output = recommend(mood_input)

print(json.dumps(output))