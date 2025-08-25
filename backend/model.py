import torch
import torch.nn as nn
import torch.nn.functional as F

class RarityPredictor(nn.Module):
    def __init__(self):
        super().__init__()

        ### input layer
        self.input = nn.Linear(31,64)
        
        ### hidden layers
        self.bnorm1 = nn.BatchNorm1d(64) # the number of units into fc1
        self.fc1    = nn.Linear(64,32)
        self.bnorm2 = nn.BatchNorm1d(32)
        self.fc2    = nn.Linear(32,16)
        self.bnorm3 = nn.BatchNorm1d(16)
        self.fc3    = nn.Linear(16,8)
        
        ### output layer
        self.output = nn.Linear(8,4)

        ### Activation Function
        self.actFun = nn.LeakyReLU()  

    # forward pass
    def forward(self, x):

        # input
        x = self.actFun( self.input(x) )
        x = F.dropout(x,p=0.2,training=self.training)
        
        # hidden layers: BatchNorm → Linear → ReLU → Dropout
        x = self.actFun(self.fc1(self.bnorm1(x)))
        x = F.dropout(x,p=0.2,training=self.training)
        x = self.actFun(self.fc2(self.bnorm2(x)))
        x = F.dropout(x,p=0.2,training=self.training)
        x = self.actFun(self.fc3(self.bnorm3(x)))

        # output layer
        return self.output(x)