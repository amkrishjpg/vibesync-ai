import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
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

scaler = MinMaxScaler()
scaled_features = scaler.fit_transform(df[features])

# =========================
# SMART MOOD UNDERSTANDING
# =========================
def preprocess_text(text):
    text = text.lower().strip()
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text

def detect_emotions(text):
    text = preprocess_text(text)

    emotion_keywords = {
        "sad": [
            "sad", "cry", "crying", "heartbreak", "heart broken", "broken",
            "alone", "lonely", "shower", "pain", "hurt", "miss", "grief"
        ],
        "happy": [
            "happy", "fun", "party", "joy", "smile", "good mood", "celebrate",
            "sunshine", "cheerful"
        ],
        "chill": [
            "chill", "relax", "calm", "peaceful", "soft", "easy", "lofi",
            "quiet", "slow"
        ],
        "drive": [
            "drive", "night drive", "late night", "road", "highway", "car ride",
            "midnight", "window", "city lights"
        ],
        "focus": [
            "study", "focus", "work", "concentrate", "productive", "coding",
            "deep work", "read", "exam"
        ],
        "energy": [
            "gym", "workout", "hype", "power", "beast", "motivation", "run",
            "push", "strong", "high energy"
        ],
        "main_character": [
            "main character", "cinematic", "hero", "confident", "confidence",
            "iconic", "powerful", "spotlight", "walk", "boss"
        ],
        "romantic": [
            "love", "romantic", "date", "crush", "kiss", "falling", "butterflies",
            "dreamy"
        ]
    }

    detected = []

    for emotion, keywords in emotion_keywords.items():
        for keyword in keywords:
            if keyword in text:
                detected.append(emotion)
                break

    # phrase-level boosts
    if "cry in the shower" in text:
        detected.extend(["sad", "chill"])
    if "main character" in text:
        detected.extend(["main_character", "happy"])
    if "late night drive" in text:
        detected.extend(["drive", "chill"])
    if "study but not boring" in text:
        detected.extend(["focus", "happy"])
    if "feel powerful" in text:
        detected.extend(["main_character", "energy"])

    # remove duplicates but preserve order
    seen = set()
    unique_detected = []
    for item in detected:
        if item not in seen:
            seen.add(item)
            unique_detected.append(item)

    return unique_detected

def mood_to_vector(mood, intensity):
    detected = detect_emotions(mood)

    # fallback neutral
    if not detected:
        return [0.5, 0.5, 0.5, 0.1, 0.5], ["neutral"]

    emotion_vectors = {
        "sad": np.array([0.25, 0.20, 0.30, 0.10, 0.90]),
        "happy": np.array([0.85, 0.90, 0.65, 0.15, 0.20]),
        "chill": np.array([0.40, 0.30, 0.35, 0.08, 0.95]),
        "drive": np.array([0.65, 0.72, 0.55, 0.10, 0.30]),
        "focus": np.array([0.20, 0.30, 0.25, 0.05, 0.98]),
        "energy": np.array([0.92, 0.96, 0.75, 0.12, 0.10]),
        "main_character": np.array([0.88, 0.82, 0.70, 0.18, 0.20]),
        "romantic": np.array([0.55, 0.45, 0.45, 0.12, 0.70]),
    }

    final_vector = np.zeros(5)

    for emotion in detected:
        final_vector += emotion_vectors[emotion]

    final_vector = final_vector / len(detected)

    # apply intensity more intelligently
    intensity = float(intensity)

    # keep some stable baseline so low intensity does not become too flat
    baseline = np.array([0.15, 0.15, 0.15, 0.03, 0.15])
    final_vector = baseline + (final_vector * intensity)

    # clamp between 0 and 1
    final_vector = np.clip(final_vector, 0, 1)

    return final_vector.tolist(), detected

# =========================
# EXPLANATION ENGINE
# =========================
def get_reason(song, detected_emotions):
    reasons = []

    if song["Energy"] > 0.75:
        reasons.append("high energy ⚡")

    if song["Acousticness"] > 0.60:
        reasons.append("soft acoustic feel 🌙")

    if song["Danceability"] > 0.75:
        reasons.append("very danceable 💃")

    if song["Speechiness"] < 0.10:
        reasons.append("smooth flow 🎶")

    if "sad" in detected_emotions and song["Acousticness"] > 0.50:
        reasons.append("fits a crying mood 💔")

    if "main_character" in detected_emotions and song["Energy"] > 0.60:
        reasons.append("main character vibe ✨")

    if "drive" in detected_emotions and song["Energy"] > 0.50:
        reasons.append("good for a drive 🚗")

    if "focus" in detected_emotions and song["Speechiness"] < 0.08:
        reasons.append("good for concentration 📚")

    if not reasons:
        return "matches your vibe ✨"

    # keep it short
    return " | ".join(reasons[:2])

# =========================
# RECOMMENDATION ENGINE
# =========================
def recommend(mood, intensity):
    mood_vector, detected_emotions = mood_to_vector(mood, intensity)
    mood_vector = np.array(mood_vector).reshape(1, -1)

    similarities = cosine_similarity(mood_vector, scaled_features)[0]

    # take a wider pool first
    top_indices = similarities.argsort()[-50:][::-1]

    # add diversity
    sampled_indices = random.sample(list(top_indices), min(20, len(top_indices)))

    # sort sampled set again by similarity, so still relevant
    sampled_indices = sorted(
        sampled_indices,
        key=lambda idx: similarities[idx],
        reverse=True
    )

    results = []
    seen_tracks = set()

    for idx in sampled_indices:
        track = str(df.iloc[idx]["Track"]).strip()
        artist = str(df.iloc[idx]["Artist"]).strip()

        # normalize track title for duplicate prevention
        normalized_track = re.sub(r"\s*\(.*?\)", "", track.lower()).strip()
        normalized_track = re.sub(r"\s*-\s*.*$", "", normalized_track).strip()

        if normalized_track in seen_tracks:
            continue

        seen_tracks.add(normalized_track)

        song = df.iloc[idx]
        reason = get_reason(song, detected_emotions)

        results.append({
            "title": track,
            "artist": artist,
            "reason": reason,
            "detectedMood": detected_emotions
        })

        if len(results) == 5:
            break

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