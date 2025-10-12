import discogs_client
from config import USER_TOKEN


d = discogs_client.Client("my_collection/1.0", user_token=USER_TOKEN)
me = d.identity()

resp = d._get("https://api.discogs.com/users/jespertl/collection/folders")
print(resp)