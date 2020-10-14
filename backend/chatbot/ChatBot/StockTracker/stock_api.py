import string
import time
import os
import sqlite3

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
