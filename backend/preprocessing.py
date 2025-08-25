import pandas as pd
import ast
import re
import scipy.stats as stats
import copy
import json

# Turned 'attacks' column into max_damage,numAttacks
def preprocess_attacks(data):
    max_damages = []
    num_attacks = []

    for val in data['attacks']:
        try:
            attack_list = ast.literal_eval(val)
            damages = [parse_damage(attack.get('damage', '')) for attack in attack_list]

            max_damages.append(max(damages) if damages else 0)
            num_attacks.append(len(attack_list))

        except:
            max_damages.append(0)
            num_attacks.append(0)

    data['max_damage'] = max_damages
    data['num_attacks'] = num_attacks
    data = data.drop(columns='attacks')
    return data

def parse_damage(dmg_str):
    dmg_str = dmg_str.strip()

    # Extract all numeric parts
    numbers = re.findall(r'\d+', dmg_str)
    numbers = list(map(float, numbers))

    if not numbers:
        return 0.0
    elif any(op in dmg_str for op in ['+', '×', 'x']):
        return sum(numbers)  # e.g., '30+20' → 50
    else:
        return numbers[0]  # e.g., '100' → 100

# One-Hot Encode data column
def preprocess_types(data):
    # filter-OUT 2-attribute observations
    data = data.loc[data['types'].apply(ast.literal_eval).apply(len) < 2]
    
    # Convert the string to list and extract the first element
    data.loc[:, "types"] = data['types'].apply(lambda x: ast.literal_eval(x)[0])

    # One-hot encode the 'types' column
    one_hot = pd.get_dummies(data['types'], prefix='type')
    data = pd.concat([data.drop(columns=['types']), one_hot], axis=1)

    return data

# One_Hot encode series column
def preprocess_series(data):
    one_hot = pd.get_dummies(data['series'], prefix='series')
    data = pd.concat([data.drop(columns=['series']), one_hot], axis=1)
    return data
    
# Turn rarity column into numbers
# Expected to get 1-4 indicating the rank of rarity
def preprocess_rarity(data):
    rarity_map = {
        **dict.fromkeys(['Common', 'Uncommon'], 0), #LEVEL 0: common
        **dict.fromkeys(['Rare', 'Rare Holo', 'Promo', 'Rare Holo V', 'Rare Holo EX', 'Rare Holo GX',
                         'Rare Holo VMAX', 'Rare Holo VSTAR', 'Double Rare', 'Trainer Gallery Rare Holo'], 1), #LEVEL 1: rare base
        **dict.fromkeys(['Rare Ultra', 'Rare Secret', 'Rare Shiny', 'Rare Shiny GX', 'Rare BREAK', 'Rare Prime', 'Rare ACE',
                         'Rare Holo LV.X', 'Radiant Rare', 'Rare Prism Star', 'Classic Collection', 'Rare Holo Star'], 2), #LEVEL 2: special rare
        **dict.fromkeys(['Rare Rainbow', 'Illustration Rare', 'Ultra Rare', 'Special Illustration Rare', 'LEGEND',
                         'Rare Shining', 'Amazing Rare', 'Hyper Rare'], 3) #LEVEL 3: Premium rare
    }
    data['rarity'] = data['rarity'].map(rarity_map)
    return data

# Fully preprocess data
def full_preprocess(data):

    # Remove unnecessary columns
    colToDrop = ['id','publisher', 'release_date', 'name', 'set_num', 'nationalPokedexNumbers',
                'flavorText', 'legalities', 'retreatCost', 'rules', 'evolvesFrom', 'evolvesTo', 'resistances', 'ancientTrait',
                'artist', 'abilities', 'weaknesses', 'set', 'level', 'subtypes', 'supertype', 'regulationMark', 'generation']
    data = data.drop(labels=colToDrop, axis=1)

    # Deal with NaN 
    data = data.dropna(subset=['attacks', 'rarity', 'hp'])
    data = data.rename(columns={'convertedRetreatCost': 'retreat_cost'})
    data['retreat_cost'] = data['retreat_cost'].fillna(0)

    dataT = copy.deepcopy(data)

    # Preprocess columns
    dataT = preprocess_attacks(dataT)
    dataT = preprocess_types(dataT)
    dataT = preprocess_series(dataT)
    dataT = preprocess_rarity(dataT)

    # convert all columns to floating point
    dataT = dataT.astype(float)

    # exclude outliers
    dataT = dataT[dataT['max_damage'] < 150] 
    dataT = dataT[dataT['hp']< 200] 
    dataT = dataT[dataT['retreat_cost']< 5] 

    # Normalize necessary columns 
    # save mean & std from THIS dataset
    cols2zscore = ['hp', 'max_damage']
    means = dataT[cols2zscore].mean()
    stds  = dataT[cols2zscore].std(ddof=0)
    scaler = {
        col: {"mean": float(means[col]), "std": float(stds[col])}
        for col in cols2zscore
    }
    with open("scaler.json", "w") as f:
        json.dump(scaler, f, indent=4)
    dataT[cols2zscore] = dataT[cols2zscore].apply(stats.zscore)
    
    return dataT