 
import string
import time
import os
import sqlite3
import yfinance as yf

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

def StockTest():
    response = "Stock Ping!!"
    return response

def StockInfo(stck):
    stck_obj = yf.Ticker(stck)
    information = stck_obj.info
    return information["shortName"] + " Sector: " + information["sector"] + " Country: " + information["country"]


def StockHistory(stck,days):
    stck_obj = yf.Ticker(stck)
    time_period = f"{str(days)}d"
    info = stck_obj.history(period=time_period)
    return str(info)


def StockHistoryPredict(stck):
    stck_obj = yf.Ticker(stck)
    time_period = f"{str(90)}d"
    info = stck_obj.history(period=time_period)
    # Only keep close columns
    info = info[['Close']]
    info = info.dropna()
    ##print(info.head())
    past_price = info.to_numpy()
    y = np.array(past_price)[:,0].reshape(-1,1)
    ##y = np.array(past_price)[:,1].reshape(-1,1)
    days = list(range(1,91))
    X = np.array(days).reshape(-1,1)
    ##print("X=")
    ##print(X)
    ##print("y=")
    ##print(y)
    to_predict_x= [91,92,93]
    to_predict_x= np.array(to_predict_x).reshape(-1,1)
    regsr=LinearRegression()
    regsr.fit(X,y)
    predicted_y= regsr.predict(to_predict_x)
    m= regsr.coef_
    c= regsr.intercept_
    ##print("Predicted y:\n",predicted_y)
    ##print("slope (m): ",m)
    ##print("y-intercept (c): ",c)

    return "Predicted y: " + str(predicted_y)


def GetCurrentPrice(stck):
    stck_obj = yf.Ticker(stck)
    information = stck_obj.info
    return float(information["open"])


def StockBuy(amount,stck,user_id):
    ## Storing and buying the stock
    current_price = GetCurrentPrice(stck)

    parent_dir = os.path.dirname(os.path.abspath(__file__))
    rel_path_db = 'stock_db'
    abs_path_db = os.path.join(parent_dir, rel_path_db)


    db_object = sqlite3.connect(abs_path_db)

    db = db_object.cursor()
    db.execute("CREATE TABLE IF NOT EXISTS owned_stock (id INTEGER PRIMARY KEY AUTOINCREMENT,owned_shares DECIMAL (5, 2) NOT NULL DEFAULT 0,current_price DECIMAL (5, 2) NOT NULL DEFAULT 0,stck LONGVARCHAR,userid LONGVARCHAR,createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)")
    
    current_owned = 0
    try:
        sql = f"SELECT owned_shares FROM owned_stock WHERE (stck = \"{str(stck)}\" AND userid = \"{str(user_id)}\")"
        db.execute(sql)
        results = db.fetchall()
        current_owned = results[0][0]
    except:
        print("No previous stock exists")

    buying_stock = int(amount)
    #print(buying_stock)
    #print(current_owned)
    current_owned += buying_stock
    #print(current_owned)

    sql = f"SELECT EXISTS(SELECT 1 FROM owned_stock WHERE (stck = \"{str(stck)}\" AND userid = \"{str(user_id)}\") LIMIT 1)"
    db.execute(sql)
    flag_exists = db.fetchall()
    flag_exists = flag_exists[0][0]
    #print(flag_exists)
    #print(type(flag_exists))
    
    if(flag_exists):
        sql = f"UPDATE owned_stock SET owned_shares = \"{str(current_owned)}\",current_price = \"{str(current_price)}\" WHERE (stck = \"{str(stck)}\" AND userid = \"{str(user_id)}\")"
        db.execute(sql)
        db_object.commit()
    else:
        sql = f"INSERT INTO owned_stock (owned_shares,stck,current_price,userid) VALUES (\"{str(current_owned)}\",\"{str(stck)}\",\"{str(current_price)}\",\"{str(user_id)}\")"
        db.execute(sql)
        db_object.commit()

    db_object.close()
    ## Return signal and amount spent
    return "Stock Bought Successfully "


def SellStock(amount,stck,user_id):
    current_price = GetCurrentPrice(stck)

    parent_dir = os.path.dirname(os.path.abspath(__file__))
    rel_path_db = 'stock_db'
    abs_path_db = os.path.join(parent_dir, rel_path_db)


    db_object = sqlite3.connect(abs_path_db)

    db = db_object.cursor()

    sql = f"SELECT EXISTS(SELECT 1 FROM owned_stock WHERE (stck = \"{str(stck)}\" AND userid = \"{str(user_id)}\") LIMIT 1)"
    db.execute(sql)
    flag_exists = db.fetchall()
    flag_exists = flag_exists[0][0]
    #print(flag_exists)
    #print(type(flag_exists))
    
    if(flag_exists==0):
        return "Stock Not Owned"


    sql = f"SELECT owned_shares,stck,current_price FROM owned_stock WHERE (stck = \"{str(stck)}\" AND userid = \"{str(user_id)}\")"
    db.execute(sql)
    results = db.fetchall()
    ## Possible or not
    amount = float(amount)
    if amount>results[0][0]:
        return "Not Enough Stock Owned"
    
    ## Committing to sql
    amount_left = results[0][0] - amount
    sql = f"UPDATE owned_stock SET owned_shares = \"{str(amount_left)}\"  WHERE (stck = \"{str(stck)}\" AND userid = \"{str(user_id)}\")"
    db.execute(sql)
    db_object.commit()
    db_object.close()
    return "Stock Sold Successfully"


def PortfolioSituation(user_id):
    ## Returns status of each stock in portfolio as a list


    parent_dir = os.path.dirname(os.path.abspath(__file__))
    rel_path_db = 'stock_db'
    abs_path_db = os.path.join(parent_dir, rel_path_db)


    db_object = sqlite3.connect(abs_path_db)

    db = db_object.cursor()
    sql = f"SELECT owned_shares,stck,current_price,createdAt FROM owned_stock WHERE userid = \"{str(user_id)}\""
    db.execute(sql)
    results = db.fetchall()
    ##print(results)
    
    answer = []
    for r in results:
        current_price = GetCurrentPrice(r[1])
        status = str(r[0])
        status += " Shares of stock "
        status += str(r[1])
        status += " Bought on " + str(r[3])
        status += " Has a current price of " + str(current_price)
        status += " at a difference of " + str(r[0]*(current_price - r[2])) 
        ##print(status)
        answer.append(str(status))

    str1 = ''.join(str(e) for e in answer)
    ##print(answer)
    return str1

def PortfolioPrediction(user_id):
    ## Returns prediction of each stock in portfolio as a list


    parent_dir = os.path.dirname(os.path.abspath(__file__))
    rel_path_db = 'stock_db'
    abs_path_db = os.path.join(parent_dir, rel_path_db)


    db_object = sqlite3.connect(abs_path_db)

    db = db_object.cursor()
    sql = f"SELECT owned_shares,stck,current_price,createdAt FROM owned_stock WHERE userid = \"{str(user_id)}\""
    db.execute(sql)
    results = db.fetchall()
    ##print(results)
    
    answer = []
    for r in results:
        current_price = GetCurrentPrice(r[1])
        status = str(r[0])
        status += " Shares of stock "
        status += str(r[1])
        status += "Bought on " + str(r[3])
        status += "Has a current price of " + str(current_price)
        status += "at a difference of " + str(r[0]*(current_price - r[2])) 
        status += " Has a prediction of " + str(StockHistoryPredict(r[1]))
        answer.append(str(status))

    str1 = ''.join(str(e) for e in answer)
    ##print(answer)
    return str1



def stock_list(user_id):
    ## Returns stock as a list

    parent_dir = os.path.dirname(os.path.abspath(__file__))
    rel_path_db = 'stock_db'
    abs_path_db = os.path.join(parent_dir, rel_path_db)


    db_object = sqlite3.connect(abs_path_db)

    db = db_object.cursor()
    sql = f"SELECT owned_shares,stck,current_price,createdAt FROM owned_stock WHERE userid = \"{str(user_id)}\""
    db.execute(sql)
    results = db.fetchall()
    ##print(results)

    for r in range(len(results)):
        results[r] = list(results[r])

    db_object.close()
    return results




##user_id = 2
##print(SellStock(1000,"AAPL",2))