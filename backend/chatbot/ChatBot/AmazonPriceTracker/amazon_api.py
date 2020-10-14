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

    if(len(title)>=1):
        title = title[0].get_text().strip()
    else:
        title = "[Item Name]"

    price = soup.find(id="priceblock_ourprice")
    if(len(title)>1):
        price = price.get_text()[1:].strip().replace(',', '')
    else:
        price = 0

    Fprice = float(price)
    return title, Fprice


def amazon_wishlist(user_id):
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    rel_path_db = 'amazon_db'
    abs_path_db = os.path.join(parent_dir, rel_path_db)

    db_object = sqlite3.connect(abs_path_db)
    db = db_object.cursor()
    sql = f"SELECT price,createdAt,producturl FROM product_prices WHERE userid = \"{str(user_id)}\" ORDER BY createdAt"
    ##print(sql)
    db.execute(sql)
    results = db.fetchall()
    ##print(results)
    
    for r in range(len(results)):
        results[r] = list(results[r])
        
    for r in range(len(results)):
        tmp = results[r][2]
        title,price = currentPrice(tmp)
        results[r][2] =  title

    db_object.close()
    return results
