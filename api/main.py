import discogs_client
from config import USER_TOKEN
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import time
from currency_converter import CurrencyConverter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not USER_TOKEN:
    raise ValueError("USER_TOKEN environment variable is not set!")

d = discogs_client.Client("my_collection/1.0", user_token=USER_TOKEN)

try:
    me = d.identity()
except Exception as e:
    print(f"Error initializing Discogs client: {e}")
    me = None

cache_data = None
cache_timestamp = 0
CACHE_TTL = 60  # et minutt

try:
    c = CurrencyConverter()
except Exception as e:
    print(f"Error initializing CurrencyConverter: {e}")
    c = None


class Lp:
    def __init__(self, title: str, releaseDate: int, img: str, artist: str):
        self.title = title
        self.releaseDate = releaseDate
        self.img = img
        self.artist = artist


@app.get("/collection/")
def get_collection(force_refresh: bool = False):
    global cache_data, cache_timestamp

    if not force_refresh and cache_data and (time.time() - cache_timestamp < CACHE_TTL):
        print("Serving cached data...")
        return cache_data

    try:
        my_collection = me.collection_folders[0]
        collection_items = []

        value_str = me.collection_value.median
        value_float = float(value_str.replace("€", "").replace(",", ""))
        value_int = c.convert(value_float, "EUR", "NOK")
        value = f"{value_int}kr"

        for lp in my_collection.releases:
            release = lp.release
            new_lp = Lp(
                title=release.title,
                releaseDate=release.year,
                artist=release.artists_sort,
                img=release.images[0]["uri"] if release.images else None,
            )
            collection_items.append(new_lp)

        collection = [lp.__dict__ for lp in collection_items]

        cache_data = {
            "status": "ok",
            "data": {"collection": collection, "value": value},
        }
        cache_timestamp = time.time()

        return cache_data

    except Exception as e:
        import traceback

        traceback.print_exc()
        return {"status": "error", "message": f"Error fetching collection: {str(e)}"}


@app.get("/debug/")
def debug_user():
    """Debug endpoint to see what attributes User object has"""
    if me is None:
        return {"error": "User not initialized"}

    try:
        # Check all attributes
        attrs = [attr for attr in dir(me) if not attr.startswith("_")]

        # Try to access collection_value
        has_collection_value = hasattr(me, "collection_value")
        collection_value = None

        if has_collection_value:
            try:
                collection_value = str(me.collection_value.median)
            except Exception as e:
                collection_value = f"Error accessing: {str(e)}"

        # Try alternative way to get value
        try:
            my_collection = me.collection_folders[0]
            items_count = len(list(my_collection.releases))
        except Exception as e:
            items_count = f"Error: {str(e)}"

        return {
            "username": me.username,
            "has_collection_value": has_collection_value,
            "collection_value": collection_value,
            "items_count": items_count,
            "all_attributes": attrs,
        }
    except Exception as e:
        import traceback

        traceback.print_exc()
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
