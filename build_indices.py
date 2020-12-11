import os
import json
import re
from stop_words import get_stop_words
from pprint import pprint

STOPWORDS = get_stop_words('en')

with open(os.path.join("src", "data", "card_index.json")) as f:
    card_index = json.load(f)
with open(os.path.join("src", "data", "super_types.json")) as f:
    super_types = json.load(f)
with open(os.path.join("src", "data", "sub_types.json")) as f:
    sub_types = json.load(f)
with open(os.path.join("src", "data", "collection.json")) as f:
    collection = json.load(f)

# before we start we collect all keywords, to exclude those from cardtext search
KEYWORDS = set()
for card_id in collection:
    KEYWORDS.update(set([x.lower() for x in card_index[card_id]['keywords']]))
KEYWORDS_PATTERN = re.compile('|'.join(list(KEYWORDS)))


# todo:
# oracle text index (possibly just keywords?) (from catalogs!)

# NB: every string is normalized to be strictly lowercase

bad_type_lines = set()

cardid_to_name = dict()
name_index = dict()
rarity_index = dict()
legality_index = dict()
set_index = dict()
cmc_index = dict()
power_index = dict()
toughness_index = dict()
color_identity_index = dict()
keyword_index = dict()
cardtext_index = dict()
supertype_index = dict()
subtype_index = dict()
for card_id in collection:
    card = card_index[card_id]
    card_name = card['name'].lower()
    cardid_to_name[card_id] = card_name
    # name indexing
    card_name_length = len(card_name)
    i = min(card_name_length, 4) # start indexing with 4 characters, or less if cardname is shorter (e.g Opt)
    while i <= card_name_length:
        name_index.setdefault(card_name[:i], list()).append(card_id)
        i += 1
    rarity_index.setdefault(card['rarity'].lower(), list()).append(card_id)
    for play_format in card['legalities']:
        if card['legalities'][play_format] == "legal":
            legality_index.setdefault(play_format.lower(), list()).append(card_id)
    set_index.setdefault(card['set'], list()).append(card_id)
    cmc_index.setdefault(int(card['cmc']), list()).append(card_id)
    power_index.setdefault(card.get('power'), list()).append(card_id)
    toughness_index.setdefault(card.get('toughness'), list()).append(card_id)
    # cards with NO color are dubbed 'colorless' (denoted with a 'C')
    color_identity = card['color_identity']
    if len(color_identity) == 0:
        color_identity_index.setdefault('C', list()).append(card_id)
    else:
        for color in color_identity:
            color_identity_index.setdefault(color, list()).append(card_id)
    for keyword in card['keywords']:
        keyword_index.setdefault(keyword.lower(), list()).append(card_id)
    oracle_text = card['oracle_text'].lower()
    oracle_text = oracle_text.replace(card_name, "").replace("\n", "")
    oracle_text = re.sub(KEYWORDS_PATTERN, "", oracle_text) # remove keywords (already to be put into keywords index)
    for word in re.findall(r"[\w]+", oracle_text):
        if (word not in STOPWORDS) and (len(word) > 1):
            cardtext_index.setdefault(word, []).append(card_id)
    # super and sub types indices
    type_line = card['type_line'].split(" — ")
    if len(type_line) > 2:
        bad_type_lines.add(card['type_line'])
    for keyword in type_line[0].split(" "):
        supertype_index.setdefault(keyword.lower(), list()).append(card_id)
    if len(type_line) > 1:
        for keyword in type_line[1].split(" "):
            subtype_index.setdefault(keyword.lower(), list()).append(card_id)

pprint(f"A total of {len(bad_type_lines)} cards with possibly incorrectly parsed type lines")

# write indices to file
with open(os.path.join("src","data","cardid_to_name.json"), "w") as f:
    json.dump(cardid_to_name, f)
with open(os.path.join("src","data","name_index.json"), "w") as f:
    json.dump(name_index, f)
with open(os.path.join("src","data","rarity_index.json"), "w") as f:
    json.dump(rarity_index, f)
# todo: legality_index
# todo: set index
with open(os.path.join("src","data","cmc_index.json"), "w") as f:
    json.dump(cmc_index, f)
with open(os.path.join("src","data","power_index.json"), "w") as f:
    json.dump(power_index, f)
with open(os.path.join("src","data","toughness_index.json"), "w") as f:
    json.dump(toughness_index, f)
with open(os.path.join("src","data","color_identity_index.json"), "w") as f:
    json.dump(color_identity_index, f)
with open(os.path.join("src","data","keyword_index.json"), "w") as f:
    json.dump(keyword_index, f)
with open(os.path.join("src","data","cardtext_index.json"), "w") as f:
    json.dump(cardtext_index, f)
with open(os.path.join("src","data","supertype_index.json"), "w") as f:
    json.dump(supertype_index, f)
with open(os.path.join("src","data","subtype_index.json"), "w") as f:
    json.dump(subtype_index, f)

# dump all card_ids for termless 'search' (e.g. to get all blue legendary creatures, without matching for a search term)
with open(os.path.join("src", "data", "all_card_ids.json"), "w") as f:
    json.dump(list(collection), f)

