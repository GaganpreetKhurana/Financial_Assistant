import os
import sqlite3

def chat_get(user_id, no_of_results):
    #  Fetching the chat from the database
    parent_directory = os.path.dirname(os.path.abspath(__file__))
    rel_path_db = 'chat_db'
    abs_path_db = os.path.join(parent_directory, rel_path_db)

    db_object = sqlite3.connect(abs_path_db)
    db = db_object.cursor()

    chat_bot = "donna"
    #sql = f"SELECT chat_message,sender FROM chat_store WHERE (userid = \"{str(user_id)}\" OR userid = \"{str(chat_bot)}\") ORDER BY createdAt DESC LIMIT \"{str(no_of_results)}\""
    sql = f"SELECT chat_message,sender FROM (SELECT chat_message,sender,createdAt FROM chat_store WHERE (userid = \"{str(user_id)}\" OR userid = \"{str(chat_bot)}\") ORDER BY createdAt DESC LIMIT \"{str(no_of_results)}\") ORDER BY createdAt"
    # print(sql)
    db.execute(sql)
    results = db.fetchall()
    # print(results)
    # print(sql)
    db_object.close()
    # for
    return results

print(chat_get(2,10))