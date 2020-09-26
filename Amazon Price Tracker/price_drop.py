import string
import time
import requests
import os
import sqlite3
from bs4 import BeautifulSoup

def currentPrice(url):
    headers = {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0'}
    response = requests.get(url, headers=headers)
    ##print(response.text)
    soup = BeautifulSoup(response.content, features="lxml")
    title = soup.select("#productTitle")[0].get_text().strip()
    price = soup.find(id="priceblock_ourprice").get_text()[1:].strip().replace(',','')
    Fprice = float(price)
    return (title,Fprice)

def storePrice(url,price):
    db_object = sqlite3.connect('amazon_db')
    db = db_object.cursor()
    db.execute("CREATE TABLE IF NOT EXISTS product_prices (id INTEGER PRIMARY KEY AUTOINCREMENT,price DECIMAL (5, 2) NOT NULL DEFAULT 0,producturl LONGVARCHAR,createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)")
    sql = f"INSERT INTO product_prices (price,producturl) VALUES (\"{str(price)}\",\"{url}\")"
    print(sql)
    db.execute(sql)
    db_object.commit()
    db_object.close()

def priceDropStatic(price,preset_target):
    if(price <= preset_target):
        print("Good time to buy the item , Go for it")
    else:
        print("Not a good time to buy the item")
    
def getPastPrice(url):
    db_object = sqlite3.connect('amazon_db')
    db = db_object.cursor()
    sql = f"SELECT price,createdAt FROM product_prices WHERE producturl = \"{str(url)}\" ORDER BY createdAt"
    print(sql)
    db.execute(sql)
    results = db.fetchall()
    print(results)
    for r in range(len(results)):
        results[r] = list(results[r])
    db_object.close()
    return results


def priceDropPrediction(url):
    past_price = getPastPrice(url)
    for r in past_price:
        print(r)

## Testing fetching of url

url = "https://www.amazon.in/INNO3D-NVIDIA-GEFORCE-Gaming-Graphic/dp/B07V6V68YF"

title,price = currentPrice(url)
print(title,price)

## Testing storing of url

storePrice("https://www.amazon.in/INNO3D-NVIDIA-GEFORCE-Gaming-Graphic/dp/B07V6V68YF",price)

## Testing price drop predictions of url

priceDropPrediction(url)


