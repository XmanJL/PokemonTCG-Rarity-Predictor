from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from model import RarityPredictor
import torch
import pandas as pd
import json

# Set up backend server
app = FastAPI(
    title="Pokemon TCG Card Rarity Predictor API",
    description="API for predicting Pokemon TCG Card rarity",
    version="0.1.0"
)

origins = [
    "http://localhost:5173",
    "http://localhost:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

class ModelInput(BaseModel):
    '''
    model input columns:
    ['hp', 'retreat_cost', 'max_damage', 'num_attacks', 'type_Colorless', 
    'type_Darkness', 'type_Dragon', 'type_Fairy', 'type_Fighting', 'type_Fire', 
    'type_Grass', 'type_Lightning', 'type_Metal', 'type_Psychic', 'type_Water', 
    'series_Base', 'series_Black & White', 'series_Diamond & Pearl', 'series_E-Card', 
    'series_EX', 'series_Gym', 'series_HeartGold & SoulSilver', 'series_NP', 'series_Neo', 
    'series_Other', 'series_POP', 'series_Platinum', 'series_Scarlet & Violet', 'series_Sun & Moon', 
    'series_Sword & Shield', 'series_XY']
    '''
    hp: float
    retreat_cost: float
    max_damage: float
    num_attacks: float
    type: str
    series: str


# load models
pokemonModel = RarityPredictor()
pokemonModel.load_state_dict(torch.load("model.pt"))
pokemonModel.eval()

@app.get("/")
def root():
    return {"message": "Welcome to the Pokemon TCG Card Rarity Predictor API"}

@app.post("/predict-rarity")
async def predict_rarity(columns_json: ModelInput):

    # Fixed categories
    type_columns = [
        'type_Colorless', 'type_Darkness', 'type_Dragon', 'type_Fairy',
        'type_Fighting', 'type_Fire', 'type_Grass', 'type_Lightning',
        'type_Metal', 'type_Psychic', 'type_Water'
    ]
    series_columns = [
         'series_Base', 'series_Black & White', 'series_Diamond & Pearl', 'series_E-Card', 
         'series_EX', 'series_Gym', 'series_HeartGold & SoulSilver', 'series_NP', 'series_Neo', 
         'series_Other', 'series_POP', 'series_Platinum', 'series_Scarlet & Violet', 'series_Sun & Moon', 
         'series_Sword & Shield', 'series_XY'
    ]

    # Input processing
    data = {
        "hp": [columns_json.hp],
        "retreat_cost": [columns_json.retreat_cost],
        "max_damage": [columns_json.max_damage],
        "num_attacks": [columns_json.num_attacks],
        "type": [columns_json.type],
        "series": [columns_json.series]
    }
    df = pd.DataFrame(data)
    df_encoded = pd.get_dummies(df, columns=["type", "series"], prefix=["type", "series"]).astype("float64")
    df_encoded = df_encoded.reindex(columns=type_columns + series_columns, fill_value=0)
    finalDF = pd.concat([df, df_encoded], axis=1)
    finalDF = finalDF.drop(columns=["type", "series"])

    # Normalize necessary columns 
    with open("scaler.json", "r") as f:
        SCALER = json.load(f)
    for col in ["hp", "max_damage"]:
        mean = SCALER[col]["mean"]
        std  = SCALER[col]["std"]
        finalDF[col] = (finalDF[col] - mean) / (std if std != 0 else 1.0)
   
    # Guessing
    X = torch.tensor(finalDF.values)
    yhat = pokemonModel.double()(X)
    prediction = int(torch.softmax(yhat,dim=1).argmax())
    return {"rarity": prediction}


if __name__ == "__main__":
    uvicorn.run("api:app", port=8000, reload=True)