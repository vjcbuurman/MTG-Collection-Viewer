import requests
import pandas
import glob
import os
import re
from copy import deepcopy

def download_file(uri, headers, filename):
    # NOTE the stream = True parameter below
    with requests.get(uri, stream = True, headers = headers) as r:
        r.raise_for_status()
        with open(filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size = 4096):
                f.write(chunk)

def card_id(setcode, cardnumber, cardface_number = ""):
    cid = f"cid_{setcode}_{cardnumber}"
    if cardface_number != "": cid += "_cf" + str(cardface_number)
    return cid

def image_filename(card_id, image_folder: str, image_extension: str):
    return os.path.join(image_folder, "img_" + card_id + image_extension)

# this function will make:
# * big card_index, mapping cardids to cardinfo
# * cardname_to_id, mapping cardnames to id's
# * setcodes, a set of all unique setcodes
def create_global_indices(carddata: [dict], redirect_key: str):

    # function to prevent code duplication in loop below
    def add_info_to_index(card_index, cardname_to_id, card_info, c_id):
        if c_id in card_index: raise Exception(f"Cardid {c_id} not unique!")
        card_index[c_id] = card_info
        cardname_to_id.setdefault((setcode, card_info['name']), list()).append(c_id)

    card_index = dict()
    cardname_to_id = dict() # needed to validate entries in collection files
    setcodes = set() # needed to validate entries in collection files

    for card in carddata:
        if redirect_key in card: raise Exception("Reserved key present in card info!")
        setcode = card['set']
        cardnumber = card['collector_number']
        # to deal with cardfaces:
        if card['layout'] in ["split", "flip", "transform", "double_faced_token", "art_series", "modal_dfc", "adventure"]:
            if 'card_faces' not in card:
                raise Exception("Card has layout type that requires 'card_faces' property, but not present in card")
            face_ids = list()
            i = 0
            for card_face in sorted(card['card_faces'], key = lambda x : x['name']): # the faces are sorted by their name
                i += 1
                # make a duplicate of the card info
                card_info = deepcopy(card)
                card_info.pop('card_faces')
                # then add or replace entries in general card info with those specific to the cardface
                for key in card_face:
                    card_info[key] = card_face[key]
                c_id = card_id(setcode, cardnumber, i)
                # then add card info under setcode_cardnumber_cf# to card_index
                add_info_to_index(card_index, cardname_to_id, card_info, c_id)
                face_ids.append(c_id)
            # add info to be able to redirect in case:
            # * cardnumber is entered (which doubles for both cardfaces)
            # * faced name is entered e.g. for set MB1, Jushi Apprentice // Tomoya the Revealer
            c_id = card_id(setcode, cardnumber)
            cardname_to_id.setdefault((setcode, card['name']), list()).append(c_id)
            card_index[c_id] = {redirect_key: face_ids}
        # otherwise, we have a 'simple' card
        else:
            if 'card_faces'in card: 
                raise Exception("Card has 'card_faces' property but not one of known layout types with faces")
            c_id = card_id(setcode, cardnumber)
            add_info_to_index(card_index, cardname_to_id, card, c_id)
        # add setcode to set
        setcodes.add(setcode)
    return card_index, cardname_to_id, setcodes

def read_collection(collectionfiles_dir: str, card_index: dict, setcodes: set, cardname_to_id: dict, redirect_key: str):
    file_list = glob.glob(os.path.join(collectionfiles_dir, "*"))
    try:
        file_list.remove(os.path.join(collectionfiles_dir, "empty.csv"))
    except:
        pass
    collection = dict()
    for file_name in file_list:
        setcode = re.search(r"(?=set_)?([a-z0-9]+)\.csv", file_name).groups()[0] # we allow 'set_' because 'con'is a reserverd name on windows (which is an issue for the Conflux set)
        # check set_name
        if setcode not in setcodes:
            raise Exception("file has unknown setcode")
        # else 
        df = pandas.read_csv(file_name, dtype = str)
        # new
        # goal: map all entries in collection to (set, cardnumber), which is unique identifier for card
        # will check if one and just one of cardnumber and cardname is filled per card
        # if cardname, will map to cardnumber, will check if there are multiple options, and if so raise error to indicate map cannot be made uniquely
        # (example: set 'all' card 'Casting of Bones', has cardnumbers '44a' and '44b')
        df = df.fillna('')
        df['foil'] = df['foil'] != ''
        df['set'] = setcode
        cards = df.to_dict("records")
        for card in cards:
            # card has to have either cardname or cardnumber
            # card cannot have both cardnumber and cardname
            # then depending on cardname or cardnumber, card is added to selection.
            cardnumber = card.get("cardnumber", "")
            cardname = card.get("cardname", "")
            if cardnumber == '' and cardname == '':
                raise Exception("no cardnumber or cardname given")
            if cardnumber != '' and cardname != '':
                raise Exception(f"both cardnumber and cardname given for card {cardname} in set {setcode}")
            # then depending on cardname or cardnumber, card is added to selection.
            if cardname != '':
                if (setcode, cardname) not in cardname_to_id:
                    raise Exception(f"Card with name {cardname} does not exist in set {setcode}")
                suggested_cardids = cardname_to_id[(setcode,  cardname)]
                if len(suggested_cardids) > 1:
                    raise Exception(
                        f"more than 1 cardid suggestion for this name, in this set ({setcode}, {cardname}): add unique cardnumber for this card to collection file instead",
                        setcode,
                        cardname)
                c_id = suggested_cardids[0]
            else: # card has cardnumber, which is perfect, so do nothing
                if card_id(setcode, cardnumber) not in card_index:
                    raise Exception(f"Card with number {cardnumber} not in set {setcode}")
                c_id = card_id(setcode, cardnumber)
                # and do nothing
            # add card to collection
            # which is just card_id and bool for foil
            # TODO: add deck info
            # if card_index is a redirect to other card_ids (e.g. because it's a double faced card)
            # add entry to collection for each id
            if redirect_key in card_index[c_id]:
                c_ids_to_add = card_index[c_id][redirect_key]
            else:
                c_ids_to_add = [c_id]
            for c_id in c_ids_to_add:
                if c_id not in collection:
                    collection[c_id] = {'count' : 0, 'foil' : 0}
                collection[c_id]['count'] += 1
                if card['foil']:
                    collection[c_id]['foil'] += 1
    return collection


def make_prices_overview(collection: dict, card_index: dict):

    def card_price(cardinfo, foil: bool):
        if foil:
            price = cardinfo['prices']['usd_foil']
        else:
            price = cardinfo['prices']['usd']
        if price == None:
            return 0
        else:
            return float(price)

    cards = list()
    for card_id in collection:
            cardinfo = card_index[card_id]
            setcode = cardinfo['set']
            cardnumber = cardinfo['collector_number']
            cardname = cardinfo['name']

            card_entry = {
                    'set': setcode,
                    'name': cardname,
                    'cardnumber': cardnumber,
                    'color': '/'.join(cardinfo.get('color_identity', [])),
                    'rarity': cardinfo.get('rarity', 'UNKNOWN'),
                    'type': cardinfo.get('type_line', 'UNKNOWN')
                    # 'decks' : ' / '.join(list(set(collection[(setcode, cardnumber, foil)]['used in decks'])))
                }
            
            if (collection[card_id]['count'] - collection[card_id]['foil']) > 0:
                card_entry['foil'] = False
                card_entry['price'] = card_price(cardinfo, False)
                card_entry['count'] = collection[card_id]['count'] - collection[card_id]['foil']
                cards.append(card_entry)
            if collection[card_id]['foil'] > 0:
                card_entry['foil'] = True
                card_entry['price'] = card_price(cardinfo, True)
                card_entry['count'] = collection[card_id]['foil']
                cards.append(card_entry)
    cards.sort(key = lambda x : x['price'], reverse = True)
    # make df and export to excel
    df = pandas.DataFrame(cards)
    df.to_excel("prices_overview.xlsx", index = False)


