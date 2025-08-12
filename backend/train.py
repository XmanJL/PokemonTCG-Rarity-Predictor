import pandas as pd
import torch
import torch.nn as nn
import numpy as np
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split
from model import RarityPredictor
from preprocessing import full_preprocess

def train():
    # Load and preprocess the dataset
    df = pd.read_csv("../data/pokemon-cards.csv")
    df = full_preprocess(df)
    print(df.describe())

    # Prepare features and labels
    labels = torch.tensor(df['rarity'].values).float()
    labels = labels[:, None]
    features = torch.tensor(df.drop(labels='rarity', axis=1).values).float()

    # split data into 95% training, 5% testing
    train_data,test_data, train_labels,test_labels = train_test_split(features, labels, test_size=0.05)

    # Convert them into TensorDataset
    train_dataset = TensorDataset(train_data, train_labels)
    test_dataset = TensorDataset(test_data, test_labels)

    # Put into Dataloaders for mini-batching
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True, drop_last=True)
    test_loader = DataLoader(test_dataset, batch_size=test_dataset.tensors[0].shape[0])

    # Train the model
    model = trainModel(train_loader, test_loader)

    # Save the model
    torch.save(model.state_dict(), "model.pt")
    print("Model trained and saved as model.pt")

def trainModel(train_loader, test_loader):

    # number of epochs
    numepochs = 100

    # initialize meta-parameters
    model = RarityPredictor()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=10)
    lossfun = nn.CrossEntropyLoss()

    # loop over epochs
    for epochi in range(numepochs):

        # switch on training mode
        model.train()

        for X, y in train_loader:

            y = y.squeeze().long()
            # forward pass and compute loss
            yHat = model(X)
            loss = lossfun(yHat, y)

            # backprop
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
                        
            # compute accuracy
            matches = torch.argmax(yHat, dim=1) == y
            matchesNumeric = matches.float()
            accuracyPct = 100 * torch.mean(matchesNumeric)

        # test accuracy
        model.eval()
        X, y = next(iter(test_loader))
        y = y.squeeze().long()
        with torch.no_grad():
            yHat = model(X)
            loss = lossfun(yHat, y).item() 
        
        acc = 100 * torch.mean((torch.argmax(yHat, dim=1) == y).float()).item()
        last_lr = optimizer.param_groups[0]['lr']

        # Learning rate decay
        scheduler.step(loss)

        # print status message
        if ((epochi+1) % 10 == 0): print(f"Epoch {epochi+1} | Accuracy: {acc:.2f}% | LR : {last_lr}")
            
    return model

if __name__ == "__main__":
    train()

