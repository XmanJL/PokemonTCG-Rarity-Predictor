# Pokémon TCG Rarity Predictor

## Overview

A web app that predicts the **rarity** of a Pokémon card using deep learning. Input card features, and the model returns one of: `Common`, `Uncommon`, `Rare`, etc.
This app is practical for Pokémon market design as it lets the model predict card rarity — a key factor in determining market value.

## Software Architecture

![image](https://github.com/user-attachments/assets/17bf85b4-3b56-479e-82ee-0ee0be4161ee)

## Works Cited

1. Kaggle Dataset found at: [Pokemon TCG All Cards 1999 - 2023](https://www.kaggle.com/datasets/adampq/pokemon-tcg-all-cards-1999-2023/data)
2. App Background image found at: [Pinterest](https://www.pinterest.com/pin/712483603521287382/)

## Developer Configure

### Install backend dependencies

```bash
pip install -r requirements.txt
```

### Train ML Model

```bash
cd backend
python3 train.py
```

After this, you should get two data files: `model.pt` and `scalar.json`

### Run both servers in separate terminals

1. Open Frontend Server:

```bash
cd frontend
npm run dev
```

2. Open Backend Server:

```bash
cd backend
python3 api.py
```

3. Check your result by opening browser at `localhost:5173` (default for vite)
