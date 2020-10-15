import string
import time
import requests
import os
import sqlite3
from bs4 import BeautifulSoup
from datetime import datetime


def amazon_wishlist(user_id):
    parent_directory = os.path.dirname(os.path.abspath(__file__))
    rel_path_db = 'amazon_db'
    abs_path_db = os.path.join(parent_directory, rel_path_db)

    db_object = sqlite3.connect(abs_path_db)
    db = db_object.cursor()
    sql = f"SELECT DISTINCT producturl,price,title,createdAt FROM product_wishlist WHERE userid = \"{str(user_id)}\" ORDER BY createdAt"
    # print(sql)
    db.execute(sql)
    results = db.fetchall()
    # print(results)

    ##for r in range(len(results)):
        ##results[r] = list(results[r])

    db_object.close()
    return results



##print(amazon_wishlist(2))