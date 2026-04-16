# 🎧 VibeSync AI

An AI-powered music recommendation system that suggests songs based on user mood using audio feature analysis and cosine similarity.

---

## 🚀 Features

- 🎯 Mood-based song recommendation (e.g., happy, sad, chill)
- 🧠 Machine Learning using cosine similarity
- ⚡ Full-stack architecture (React + Node + Python)
- 🎨 Premium UI with Tailwind CSS and animations
- 🔄 Real-time recommendation pipeline
- 🧹 Duplicate removal for cleaner results
- 📊 Content-based filtering using audio features

---

## 🧠 How It Works

1. User enters a mood (e.g., "happy", "late night drive")
2. Frontend sends mood to backend (Node.js)
3. Backend invokes Python ML model
4. ML model:
   - Converts mood → feature vector
   - Compares with dataset using cosine similarity
   - Finds most similar songs
5. Results are returned and displayed in UI

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion (animations)

### Backend
- Node.js
- Express.js

### Machine Learning
- Python
- Pandas
- Scikit-learn (cosine similarity)
- NumPy

### Dataset
- Spotify songs dataset (Kaggle)
- ~20,000 songs with audio features

---

## 📂 Project Structure

```
vibesync-ai/
│
├── client/        # React frontend
├── server/        # Node backend
├── ml-service/    # Python ML model
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone repository
```bash
git clone https://github.com/your-username/vibesync-ai.git
cd vibesync-ai
```

---

### 2. Setup Frontend
```bash
cd client
npm install
npm run dev
```

---

### 3. Setup Backend
```bash
cd server
npm install
node index.js
```

---

### 4. Setup ML Service
```bash
cd ml-service
pip install pandas scikit-learn numpy
python app.py
```

---

## 🎯 Example Input

```
happy
sad
chill
late night drive
```

---

## 📈 Key Concepts Used

- Content-Based Filtering
- Cosine Similarity
- Feature Normalization
- Mood-to-Vector Mapping

---

## 🚀 Future Improvements

- 🎵 Spotify API integration (preview + album art)
- 🧠 NLP-based mood detection
- 📊 User personalization & history
- 🎧 Playlist generation
- 📈 Mood analytics dashboard

---

## 👤 Author

**Ami Krishna**

---

## 💡 Project Insight

This project demonstrates how machine learning can be integrated into a full-stack application to deliver personalized recommendations using real-world data.

---

⭐ If you like this project, give it a star!