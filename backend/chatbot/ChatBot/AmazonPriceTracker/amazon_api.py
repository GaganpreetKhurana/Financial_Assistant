import string
import time
import requests
import os
import sqlite3
from bs4 import BeautifulSoup
from datetime import datetime

def currentPrice(url):
    headers = {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, features="lxml")
    title = soup.select("#productTitle")
    if len(title) >= 1 and title is not None:
        title = title[0].get_text().strip()
    else:
        title = "[Item Name]"
    price = soup.find(id="priceblock_ourprice")
    if len(title) > 1 and price is not None:
        price = price.get_text()[1:].strip().replace(',', '')
    else:
        price = 0
    price = price
    Fprice = float(price)

    try:
        image_url = soup.find(id="landingImage")
        image_url = image_url.get('data-old-hires')
    except:
        image_url = "https://i.imgur.com/7ZOgkok.png"
    
    return title, Fprice, image_url



def storePrice(url, price, user_id, title,image_url):
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    rel_path_db = 'amazon_db'
    abs_path_db = os.path.join(parent_dir, rel_path_db)

    db_object = sqlite3.connect(abs_path_db)
    db = db_object.cursor()
    db.execute(
        "CREATE TABLE IF NOT EXISTS product_prices (id INTEGER PRIMARY KEY AUTOINCREMENT,price DECIMAL (5, 2) NOT NULL DEFAULT 0,producturl LONGVARCHAR,userid LONGVARCHAR,createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)")
    sql = f"INSERT INTO product_prices (price,producturl,userid) VALUES (\"{str(price)}\",\"{url}\",\"{str(user_id)}\")"
    db.execute(sql)

    db.execute(
        "CREATE TABLE IF NOT EXISTS product_wishlist (producturl LONGVARCHAR PRIMARY KEY UNIQUE,price DECIMAL (5, 2) NOT NULL DEFAULT 0,userid LONGVARCHAR,imageurl LONGVARCHAR,title LONGVARCHAR,createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)")

    sql = f"UPDATE product_wishlist SET price = \"{str(price)}\" WHERE (producturl = \"{str(url)}\")"

    db.execute(sql)

    db_object.commit()
    db_object.close()


def amazon_add_fun(url, user_id):
    title, price,image_url = currentPrice(url)
    storePrice(url, price, user_id, title,image_url)


def amazon_wishlist(user_id):
    parent_directory = os.path.dirname(os.path.abspath(__file__))
    rel_path_db = 'amazon_db'
    abs_path_db = os.path.join(parent_directory, rel_path_db)

    db_object = sqlite3.connect(abs_path_db)
    db = db_object.cursor()
    sql = f"SELECT DISTINCT producturl,price,title,imageurl,createdAt FROM product_wishlist WHERE userid = \"{str(user_id)}\" ORDER BY createdAt"
    # print(sql)
    db.execute(sql)

    results = db.fetchall()

    for r in results:
        amazon_add_fun(r[0],user_id)

    db.execute(sql)
    results = db.fetchall()

    db_object.close()

    return results


