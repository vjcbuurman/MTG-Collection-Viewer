from re import sub
import requests
from util import card_id, read_decks, read_collection, download_file, image_filename, create_global_indices, make_prices_overview
import json
import time
import glob
import os
import tqdm
from pprint import pprint

# set some global variables
redirect_key = "faces_redirect"

# read config for location of collection and deck files
with open("config.json") as f:
    config = json.load(f)
collectionfiles_dir = config['collectionfiles_dir']
deckfiles_dir = config['deckfiles_dir']

# get uri and request info for bulk data set from scryfall.
# can basically be replaced with any bulk set
# code below may need to be changed depending on the format of the bulk set of course
response = requests.get("https://api.scryfall.com/bulk-data")
data_info = [x for x in response.json()['data'] if x['name'] == "Default Cards"][0] # get the entry whose name is "Default Cards"

# download the data
carddata = requests.get(
    data_info['download_uri'], 
    stream = True, 
    headers =  {
        "Content-Type" : data_info["content_type"],
        "Content-Encoding" : data_info["content_encoding"]}
).json()

# create sub/super type indices

creature_types = requests.get("https://api.scryfall.com/catalog/creature-types").json()['data']
planeswalker_types = requests.get("https://api.scryfall.com/catalog/planeswalker-types").json()['data']
land_types = requests.get("https://api.scryfall.com/catalog/land-types").json()['data']
artifact_types = requests.get("https://api.scryfall.com/catalog/artifact-types").json()['data']
enchantment_types = requests.get("https://api.scryfall.com/catalog/enchantment-types").json()['data']
spell_types = requests.get("https://api.scryfall.com/catalog/spell-types").json()['data']
sub_types = creature_types + planeswalker_types + land_types + \
    artifact_types + enchantment_types + spell_types

super_types = [
    "Artifact", "Conspiracy", "Creature", "Emblem", "Enchantment", "Hero", "Instant",
    "Land", "Phenomenon", "Plane", "Planeswalker", "Scheme", "Sorcery", "Tribal", "Vanguard",
    "Legendary"
]

with open(os.path.join("src", "data", "sub_types.json"), "w") as f:
    json.dump(sub_types, f)
with open(os.path.join("src", "data", "super_types.json"), "w") as f:
    json.dump(super_types, f)


# create full card index
# simply maps card_ids to info about that card
# in case a card has multiple faces, we create an entry for each face
# e.g. some adventures are both sorceries and creatures
# for search purposes we would like to find these cards both when searching for creatures
# as when searching for sorceries.

card_index, cardname_to_id, setcodes = create_global_indices(carddata, redirect_key)

decks = read_decks(deckfiles_dir, card_index, setcodes, cardname_to_id, redirect_key)

# export overal card_index, mainly for build_indices script
with open(os.path.join("src", "data", "card_index.json"), "w") as f:
    json.dump(card_index, f)

# make collection from collection files
collection = read_collection(collectionfiles_dir, card_index, setcodes, cardname_to_id, redirect_key, decks)
with open(os.path.join("src", "data", "collection.json"), "w") as f:
    json.dump(collection, f)

# collect card images for cards in collection
image_folder = os.path.join("public", "images")
try:
    os.mkdir(image_folder)
except:
    pass
image_extension = ".jpg"
# determine missing images
image_filelist = set(glob.glob(os.path.join(image_folder, "*")))
missing_images = {x for x in collection if image_filename(x, image_folder, image_extension) not in image_filelist}
# download missing card images with rate limiter
no_uri = 0
failed = set()
for c_id in tqdm.tqdm(missing_images, desc = "downloading missing images"):
    card = card_index[c_id]
    if 'image_uris' in card:
        try:
            uri = card['image_uris']['normal']
            download_file(uri, headers = None, filename = image_filename(c_id, image_folder, image_extension))
            time.sleep(0.1) # rate limiter
        except:
            failed.add(c_id)
    else:
        no_uri += 1

pprint(f"no image uri available for {no_uri} cards")
pprint(f"download failed for cards: {failed}")

make_prices_overview(collection, card_index)