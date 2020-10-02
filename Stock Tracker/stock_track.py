import string
import time
import os
import sqlite3
import yfinance as yf

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

def StockInfo(stck):
    stck_obj = yf.Ticker(stck)
    information = stck_obj.info
    return information["shortName"] + " Sector: " + information["sector"] + " Country: " + information["country"]

def StockHistory(stck,days):
    stck_obj = yf.Ticker(stck)
    time_period = f"{str(days)}d"
    info = stck_obj.history(period=time_period)
    print(info)

def StockHistoryPredict(stck):
    stck_obj = yf.Ticker(stck)
    time_period = f"{str(90)}d"
    info = stck_obj.history(period=time_period)
    # Only keep close columns
    info = info[['Close']]
    info = info.dropna()
    print(info.head())
    past_price = info.to_numpy()
    y = np.array(past_price)[:,0].reshape(-1,1)
    ##y = np.array(past_price)[:,1].reshape(-1,1)
    days = list(range(1,91))
    X = np.array(days).reshape(-1,1)
    print("X=")
    print(X)
    print("y=")
    print(y)
    to_predict_x= [91,92,93]
    to_predict_x= np.array(to_predict_x).reshape(-1,1)
    regsr=LinearRegression()
    regsr.fit(X,y)
    predicted_y= regsr.predict(to_predict_x)
    m= regsr.coef_
    c= regsr.intercept_
    print("Predicted y:\n",predicted_y)
    print("slope (m): ",m)
    print("y-intercept (c): ",c)

def GetCurrentPrice(stck):
    stck_obj = yf.Ticker(stck)
    information = stck_obj.info
    return information["open"]

def StockBuy(amount,stck):
    ## Storing and buying the stock
    current_price = GetCurrentPrice(stck)
    db_object = sqlite3.connect('stock_db')
    db = db_object.cursor()
    db.execute("CREATE TABLE IF NOT EXISTS owned_stock (id INTEGER PRIMARY KEY AUTOINCREMENT,owned_shares DECIMAL (5, 2) NOT NULL DEFAULT 0,current_price DECIMAL (5, 2) NOT NULL DEFAULT 0,stck LONGVARCHAR,createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)")
    sql = f"INSERT INTO owned_stock (owned_shares,stck,current_price) VALUES (\"{str(amount)}\",\"{str(stck)}\",\"{str(current_price)}\")"
    print(sql)
    db.execute(sql)
    db_object.commit()
    db_object.close()
    ## Return signal and amount spent
    return ("Stock Bought Successfully",current_price*amount)

def SellStock(amount,stck):
    current_price = GetCurrentPrice(stck)
    db_object = sqlite3.connect('stock_db')
    db = db_object.cursor()
    sql = f"SELECT owned_shares,stck,current_price FROM owned_stock WHERE stck = \"{str(stck)}\""
    db.execute(sql)
    results = db.fetchall()
    print(results)
    ## Possible or not
    if(amount>results[0]):
        return ("Not Enough Stock Owned",0)
    
    transaction_amount = amount*(current_price - results[2])

    ## Committing to sql
    amount_left = results[0] - amount
    sql = f"UPDATE owned_stock SET owned_shares = \"{str(amount_left)}\"  WHERE stck = \"{str(stck)}\""
    db.execute(sql)

    return ("Stock Sold Successfully",transaction_amount)


stck = "tsla"
##print(stock_info(stck))
##stock_history(stck,10)
##stock_history_predict(stck)
SellStock(100,stck)



