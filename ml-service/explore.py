import pandas as pd
import json

try:
    df = pd.read_csv("../ml-service/cleaned_dataset.csv")

    df = df.dropna()

    # Ensure columns exist
    required_cols = ["Track", "Artist", "Views", "Likes"]

    for col in required_cols:
        if col not in df.columns:
            raise Exception(f"Missing column: {col}")

    trending = df.sort_values("Views", ascending=False).head(5)
    popular = df.sort_values("Likes", ascending=False).head(5)
    random = df.sample(5)

    def format_data(data):
        result = []
        for _, row in data.iterrows():
            result.append({
                "title": row["Track"],
                "artist": row["Artist"]
            })
        return result

    output = {
        "trending": format_data(trending),
        "popular": format_data(popular),
        "random": format_data(random)
    }

    print(json.dumps(output))

except Exception as e:
    print(f"ERROR: {str(e)}")