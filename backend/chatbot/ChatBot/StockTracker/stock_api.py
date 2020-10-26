import os
import sqlite3
import yfinance as yf


def GetCurrentPrice(stck):
    stck_obj = yf.Ticker(stck)
    information = stck_obj.info
    return float(information["open"])


def stock_list(user_id):
    # Returns stock as a list

    parent_directory = os.path.dirname(os.path.abspath(__file__))
    rel_path_db = 'stock_db'
    abs_path_db = os.path.join(parent_directory, rel_path_db)

    db_object = sqlite3.connect(abs_path_db)

    db = db_object.cursor()
    sql = f"SELECT owned_shares,stck,current_price,createdAt FROM owned_stock WHERE userid = \"{str(user_id)}\""
    db.execute(sql)
    results = db.fetchall()
    # print(results)

    for r in range(len(results)):
        results[r] = list(results[r])

    db_object.close()
    return results


# def SellStock(amount, stck, user_id):
#
#     parent_dir = os.path.dirname(os.path.abspath(__file__))
#     rel_path_db = 'stock_db'
#     abs_path_db = os.path.join(parent_dir, rel_path_db)
#
#     db_object = sqlite3.connect(abs_path_db)
#
#     db = db_object.cursor()
#
#     sql = f"SELECT EXISTS(SELECT 1 FROM owned_stock WHERE (stck = \"{str(stck)}\" AND userid = \"{str(user_id)}\") LIMIT 1)"
#     db.execute(sql)
#     flag_exists = db.fetchall()
#     flag_exists = flag_exists[0][0]
#     # print(flag_exists)
#     # print(type(flag_exists))
#
#     if (flag_exists == 0):
#         return "Stock Not Owned"
#
#     sql = f"SELECT owned_shares,stck,current_price FROM owned_stock WHERE (stck = \"{str(stck)}\" AND userid = \"{str(user_id)}\")"
#     db.execute(sql)
#     results = db.fetchall()
#     ## Possible or not
#     amount = float(amount)
#     if amount > results[0][0]:
#         return "Not Enough Stock Owned"
#
#     ## Committing to sql
#     amount_left = results[0][0] - amount
#     sql = f"UPDATE owned_stock SET owned_shares = \"{str(amount_left)}\"  WHERE (stck = \"{str(stck)}\" AND userid = \"{str(user_id)}\")"
#     db.execute(sql)
#     db_object.commit()
#     db_object.close()
#     return "Stock Sold Successfully"
