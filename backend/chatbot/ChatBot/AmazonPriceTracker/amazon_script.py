import os
import sqlite3
from datetime import datetime

import numpy as np
import requests
from bs4 import BeautifulSoup
from sklearn.linear_model import LinearRegression


def currentPrice(url):
    headers = {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0'}
    response = requests.get(url, headers=headers)
    # print(response.text)
    soup = BeautifulSoup(response.content, features="lxml")
    # title = soup.select("#productTitle")[0].get_text().strip()
    title = soup.select("#productTitle")
    # print(len(title))
    if len(title) >= 1 and title is not None:
        title = title[0].get_text().strip()
    else:
        title = "[Item Name]"
    # print(title)
    # title = soup.find(id="productTitle").get_text()[1:].strip().replace(',','')
    # price = soup.find(id="priceblock_ourprice").get_text()[1:].strip().replace(',', '')
    price = soup.find(id="priceblock_ourprice")
    if len(title) > 1 and price is not None:
        price = price.get_text()[1:].strip().replace(',', '')
    else:
        price = 0

    Fprice = float(price)
    return title, Fprice


def storePrice(url, price, user_id, title):
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    rel_path_db = 'amazon_db'
    abs_path_db = os.path.join(parent_dir, rel_path_db)

    db_object = sqlite3.connect(abs_path_db)
    db = db_object.cursor()
    db.execute(
        "CREATE TABLE IF NOT EXISTS product_prices (id INTEGER PRIMARY KEY AUTOINCREMENT,price DECIMAL (5, 2) NOT NULL DEFAULT 0,producturl LONGVARCHAR,userid LONGVARCHAR,createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)")
    sql = f"INSERT INTO product_prices (price,producturl,userid) VALUES (\"{str(price)}\",\"{url}\",\"{str(user_id)}\")"
    # print(sql)
    db.execute(sql)

    db.execute(
        "CREATE TABLE IF NOT EXISTS product_wishlist (producturl LONGVARCHAR PRIMARY KEY UNIQUE,price DECIMAL (5, 2) NOT NULL DEFAULT 0,userid LONGVARCHAR,title LONGVARCHAR,createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)")

    sql = f"INSERT OR REPLACE INTO product_wishlist (producturl,price,userid,title) VALUES (\"{url}\",\"{str(price)}\",\"{str(user_id)}\",\"{str(title)}\")"

    db.execute(sql)

    db_object.commit()
    db_object.close()


def priceDropStatic(price, preset_target):
    if price <= preset_target:
        print("Good time to buy the item , Go for it")
    else:
        print("Not a good time to buy the item")


def getPastPrice(url, user_id):
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    rel_path_db = 'amazon_db'
    abs_path_db = os.path.join(parent_dir, rel_path_db)

    db_object = sqlite3.connect(abs_path_db)
    db = db_object.cursor()
    sql = f"SELECT price,createdAt FROM product_prices WHERE (producturl = \"{str(url)}\" AND userid = \"{str(user_id)}\") ORDER BY createdAt"
    print(sql)
    db.execute(sql)
    results = db.fetchall()
    print(results)

    for r in range(len(results)):
        results[r] = list(results[r])
    for r in range(len(results)):
        tmp = results[r][1]
        datetime_object = datetime.strptime(tmp, '%Y-%m-%d %H:%M:%S')
        timestamp = datetime.timestamp(datetime_object)
        results[r][1] = results[r][0]
        results[r][0] = int(timestamp)
    db_object.close()
    return results


def FileTest(url):
    script_dir = os.path.abspath(__file__)
    print(script_dir)
    rel_path_intent = 'intents.json'
    abs_path_intent = os.path.join(script_dir, rel_path_intent)
    print(abs_path_intent)
    getPastPrice(url)


def priceDropPrediction(url, target):
    past_price = getPastPrice(url)
    for r in past_price:
        print(r)
    X = np.array(past_price)[:, 0].reshape(-1, 1)
    y = np.array(past_price)[:, 1].reshape(-1, 1)
    print("X=")
    print(X)
    print("y=")
    print(y)
    now = datetime.now()
    timestamp = datetime.timestamp(now)
    timestamp = int(timestamp)
    to_predict_x = [timestamp + 1000, timestamp + 2000, timestamp + 3000]
    to_predict_x = np.array(to_predict_x).reshape(-1, 1)
    regsr = LinearRegression()
    regsr.fit(X, y)
    predicted_y = regsr.predict(to_predict_x)
    m = regsr.coef_
    c = regsr.intercept_
    print("Predicted y:\n", predicted_y)
    print("slope (m): ", m)
    print("y-intercept (c): ", c)

    if predicted_y[0] < target:
        print("\n\nBad time to buy the product, It is expected to drop soon")
    else:
        print("\n\nGood time to buy the product, It is expected to Increase soon")


def amazon_add_fun(url, user_id):
    title, price = currentPrice(url)
    storePrice(url, price, user_id, title)
    return "Added Amazon Tracking for item " + title + " With current price " + str(price)


def amazon_buy_fun(url, user_id):
    past_price = getPastPrice(url, user_id)
    for r in past_price:
        print(r)
    X = np.array(past_price)[:, 0].reshape(-1, 1)
    y = np.array(past_price)[:, 1].reshape(-1, 1)
    now = datetime.now()

    timestamp = datetime.timestamp(now)
    timestamp = int(timestamp)
    to_predict_x = [timestamp + 1000, timestamp + 2000, timestamp + 3000]
    to_predict_x = np.array(to_predict_x).reshape(-1, 1)

    regsr = LinearRegression()
    regsr.fit(X, y)

    predicted_y = regsr.predict(to_predict_x)
    m = regsr.coef_
    c = regsr.intercept_
    # print("Predicted y:\n", predicted_y)

    title, price = currentPrice(url)

    chat_response = "The item " + title + " has a future predicted price of: "
    chat_response += str(predicted_y)

    if predicted_y[0] < price:
        chat_response += "  Bad time to buy the product, It is expected to drop soon"
    else:
        chat_response += "  Good time to buy the product, It is expected to Increase soon"

    return chat_response


def amazon_wishlist(user_id):
    parent_directory = os.path.dirname(os.path.abspath(__file__))
    rel_path_db = 'amazon_db'
    abs_path_db = os.path.join(parent_directory, rel_path_db)

    db_object = sqlite3.connect(abs_path_db)
    db = db_object.cursor()
    sql = f"SELECT price,createdAt,producturl FROM product_prices WHERE userid = \"{str(user_id)}\" ORDER BY createdAt"
    print(sql)
    db.execute(sql)
    results = db.fetchall()
    print(results)

    for r in range(len(results)):
        results[r] = list(results[r])

    for r in range(len(results)):
        tmp = results[r][2]
        title, price = currentPrice(tmp)
        results[r][2] = title

    db_object.close()
    return results


# Testing fetching of url

url = "https://www.amazon.in/INNO3D-NVIDIA-GEFORCE-Gaming-Graphic/dp/B07V6V68YF"
title, price = currentPrice(url)
# print(title,price)

#  Testing storing of url

storePrice("https://www.amazon.in/INNO3D-NVIDIA-GEFORCE-Gaming-Graphic/dp/B07V6V68YF", price, 2, title)

# Testing price drop predictions of url

# target_price = 34000
# priceDropPrediction(url, target_price)


# print(amazon_buy_fun(url))


# FileTest(url)
