import json
import os
import pickle
import random
import sqlite3

import nltk
import numpy
import requests
from nltk.stem.lancaster import LancasterStemmer
from tensorflow import keras

from .AmazonPriceTracker import amazon_script
from .StockTracker import stock_script

categories = {
    "income": 0,
    "housing": 1,
    "food": 2,
    "healthcare": 3,
    "transportation": 4,
    "recreation": 5,
    "miscellaneous": 6,
    "other": 7
}
stemmer = LancasterStemmer()
words = []
labels = []
docs_x = []  # pattern
docs_y = []  # associated tag of the pattern

parent_dir = os.path.dirname(os.path.abspath(__file__))

# importing the chat intents into data
rel_path_intent = 'intents.json'
abs_path_intent = os.path.join(parent_dir, rel_path_intent)

rel_path_pickle = 'data.pickle'
abs_path_pickle = os.path.join(parent_dir, rel_path_pickle)
print(abs_path_pickle)

with open(abs_path_intent) as file:
    data = json.load(file)
try:
    with open(abs_path_pickle, "rb") as f:
        print("\n\n\nNo Need to Retrain Model\n\n\n")
        words, labels, training, output = pickle.load(f)
except:
    for intent in data['intents']:
        for pattern in intent['patterns']:
            wrds = nltk.word_tokenize(pattern)
            words.extend(wrds)
            docs_x.append(wrds)
            docs_y.append(intent["tag"])

        if intent['tag'] not in labels:
            labels.append(intent['tag'])

    # Stemming the words eg thats -> that
    words = [stemmer.stem(w.lower()) for w in words if w != "?"]
    # Sorting and unique

    words = sorted(list(set(words)))

    labels = sorted(labels)

    # One Hot Encoding 
    training = []  # bag of words one hot encoded
    output = []  # the length of the amount of labels/tags we have in our dataset

    out_empty = [0 for _ in range(len(labels))]

    for x, doc in enumerate(docs_x):
        bag = []

        wrds = [stemmer.stem(w.lower()) for w in doc]  # saving the all the words stemmed in wrds

        for w in words:
            if w in wrds:
                bag.append(1)  # updating the one hot encoding
            else:
                bag.append(0)

        output_row = out_empty[:]
        output_row[labels.index(docs_y[x])] = 1

        training.append(bag)
        output.append(output_row)

    # converting the data to numpy arrays

    training = numpy.array(training)
    output = numpy.array(output)
    with open("data.pickle", "wb") as f:
        pickle.dump((words, labels, training, output), f)

# Defining the tensorflow network
model = keras.Sequential([
    keras.layers.Input(shape=(len(training[0], ))),
    # keras.layers.Flatten(input_shape=(len(training[0]))),
    keras.layers.Dense(8, activation='relu'),
    keras.layers.Dense(8, activation='relu'),
    keras.layers.Dense(len(output[0]), activation='softmax')
])

rel_path_model = 'model.chatbot'
abs_path_model = os.path.join(parent_dir, rel_path_model)
print(abs_path_model)

model.summary()
model.compile(optimizer='sgd',
              loss='categorical_crossentropy',
              metrics=['accuracy'])
try:
    model.load(abs_path_model)
except:
    model.fit(training, output, epochs=700, batch_size=8)
    model.save(abs_path_model)


def bag_of_words(s, words):
    bag = [0 for _ in range(len(words))]

    s_words = nltk.word_tokenize(s)
    s_words = [stemmer.stem(word.lower()) for word in s_words]

    for se in s_words:
        for i, w in enumerate(words):
            if w == se:
                bag[i] = 1

    return numpy.array(bag)


def chat():
    print("Please delete models and cache after editing intents.json!")
    print("Start talking with the bot (type quit to stop)!")
    while True:
        inp = input("You: ")
        if inp.lower() == "quit":
            break
        temp = bag_of_words(inp, words)

        print(temp.shape)
        results = model.predict(temp.reshape(1, -1))
        results_index = numpy.argmax(results)
        tag = labels[results_index]

        for tg in data["intents"]:
            if tg['tag'] == tag:
                responses = tg['responses']

        answer = random.choice(responses)

        print(answer)
        print(tag)

        if tag == "payments_debit":
            print("Calling function to add debit to database")

        elif tag == "payments_credit":
            print("Calling function to add credit to database")

        elif tag == "amazon_add":
            print("Calling function to add item to amazon wishlist")

        elif tag == "amazon_buy":
            print("Calling function to add check status of amazon wishlist")

        else:
            print("No function to call")


def fun(string):
    print("\n\nFunction called in chat bot")
    return "Hello" + string


def chat_store(chatmessage, user_id, sender):
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    rel_path_db = 'chat_db'
    abs_path_db = os.path.join(parent_dir, rel_path_db)

    db_object = sqlite3.connect(abs_path_db)
    db = db_object.cursor()
    db.execute(
        "CREATE TABLE IF NOT EXISTS chat_store (id INTEGER PRIMARY KEY AUTOINCREMENT,chat_message LONGVARCHAR,"
        "userid LONGVARCHAR,sender LONGVARCHAR,createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)")
    sql = f"INSERT INTO chat_store (chat_message,userid,sender) VALUES (\"{str(chatmessage)}\",\"{str(user_id)}\",\"{str(sender)}\")"
    # print(sql)
    db.execute(sql)
    db_object.commit()
    db_object.close()


def chat_get(user_id, no_of_results):
    #  Fetching the chat from the database
    parent_directory = os.path.dirname(os.path.abspath(__file__))
    rel_path_db = 'chat_db'
    abs_path_db = os.path.join(parent_directory, rel_path_db)

    db_object = sqlite3.connect(abs_path_db)
    db = db_object.cursor()

    chat_bot = "donna"
    sql = f"SELECT chat_message,sender FROM chat_store WHERE (userid = \"{str(user_id)}\" OR userid = \"{str(chat_bot)}\") ORDER BY createdAt LIMIT \"{str(no_of_results)}\""
    # print(sql)
    db.execute(sql)
    results = db.fetchall()
    # print(results)
    # print(sql)
    db_object.close()
    # for
    return results


def chat_web(question, user_id, request):
    chat_store(question, user_id, 'True')
    #  Checking if the question is actually a Transaction reply
    if question.startswith("Transaction"):
        list_parse = question.split()
        credit = True
        if list_parse[1] == "Debit":
            credit = False
        data_bot = {
            "amount": list_parse[3],
            "category": categories[list_parse[2]],
            "description": ' '.join(list_parse[4:]),
            "credit": credit
        }
        header = {
            "Authorization": "Bearer " + request.auth,
        }
        print("Calling function to add transaction to database")
        response = requests.post(url="http://127.0.0.1:8000/create_transaction", data=data_bot,
                                 headers=header)

        chat_response = ""

        if response.status_code == 201:
            chat_response += "Transaction Operation Successful!"
        else:
            chat_response += "Transaction Operation Unsuccessful!"

        chat_store(chat_response, 'donna', 'False')
        return chat_response

    #  Checking if the question is actually a Amazon reply
    if question.startswith("Amazon"):
        list_parse = question.split()
        chat_response = "Amazon Operation Successful! "

        if list_parse[1] == "Add":
            url = list_parse[2]
            chat_response += amazon_script.amazon_add_fun(url, user_id)

        if list_parse[1] == "Buy":
            url = list_parse[2]
            chat_response += amazon_script.amazon_buy_fun(url, user_id)

        chat_store(chat_response, 'donna', 'False')

        return chat_response

    #  Checking if the question is actually a Stock reply

    if question.startswith("Stock"):
        list_parse = question.split()
        chat_response = "Stock Operation Successful! "

        if list_parse[1] == "info":
            stck = list_parse[2]
            chat_response += stock_script.StockInfo(stck)

        if list_parse[1] == "history":
            stck = list_parse[2]
            chat_response += stock_script.StockHistory(stck)

        if list_parse[1] == "buy":
            stck = list_parse[2]
            amount = list_parse[3]
            chat_response += stock_script.StockBuy(amount, stck, user_id)

        if list_parse[1] == "sell":
            stck = list_parse[2]
            amount = list_parse[3]
            chat_response += stock_script.SellStock(amount, stck, user_id)

        if list_parse[1] == "predict":
            stck = list_parse[2]
            chat_response += stock_script.StockHistoryPredict(stck)

        if list_parse[1] == "portfolio":

            if list_parse[2] == "info":
                chat_response += stock_script.PortfolioSituation(user_id)

            if list_parse[2] == "predict":
                chat_response += stock_script.PortfolioPrediction(user_id)

        chat_store(chat_response, 'donna', 'False')

        return chat_response

    print("Please delete models and cache after editing intents.json!")
    print("Start talking with the bot (type quit to stop)!")
    inp = question

    temp = bag_of_words(inp, words)

    print(temp.shape)
    results = model.predict(temp.reshape(1, -1))
    results_index = numpy.argmax(results)
    tag = labels[results_index]

    for tg in data["intents"]:
        if tg['tag'] == tag:
            responses = tg['responses']

    answer = random.choice(responses)

    # print(answer)
    print(tag)

    #  Replying user the instructions with matching tags

    #  Transaction Functions

    if tag == "payments_debit":
        answer += "\nPlease Reply the Category,Amount in the format 'Transaction Debit *Category* *Amount* " \
                  "*Description*' "
        print("Calling function to add debit to database")

    elif tag == "payments_credit":
        answer += "\nPlease Reply the Category,Amount in the format 'Transaction Credit *Category* *Amount* " \
                  "*Description*' "
        print("Calling function to add credit to database")

    #  Amazon Functions

    elif tag == "amazon_add":
        answer += "\nPlease Reply the url of wishlist in the format 'Amazon Add *url*'"
        print("Calling function to add item to amazon wishlist")

    elif tag == "amazon_buy":
        answer += "\nPlease Reply the url of wishlist in the format 'Amazon Buy *url*'"
        print("Calling function to add check status of amazon wishlist")

    #  Stock Functions

    elif tag == "stock_info":
        answer += "\nPlease Reply the stock name in the format 'Stock info *stock_name*'"
        print("Calling function to check info of stock")

    elif tag == "stock_history":
        answer += "\nPlease Reply the stock name in the format 'Stock history *stock_name*'"
        print("Calling function to check history of stock")

    elif tag == "stock_buy":
        answer += "\nPlease Reply the stock name and amount in the format 'Stock buy *stock_name* *amount*'"
        print("Calling function to buy stock")

    elif tag == "stock_sell":
        answer += "\nPlease Reply the stock name and amount in the format 'Stock sell *stock_name* *amount*'"
        print("Calling function to sell stock")

    elif tag == "stock_predict":
        answer += "\nPlease Reply the stock name in the format 'Stock predict *stock_name*'"
        print("Calling function to predict stock price")

    elif tag == "stock_portfolio_info":
        answer += "\nPlease Reply  in the format 'Stock portfolio info'"
        print("Calling function to fetch Portfolio")

    elif tag == "stock_portfolio_prediction":
        answer += "\nPlease Reply  in the format 'Stock portfolio predict'"
        print("Calling function to predict Portfolio")

    #  No functions found 

    else:
        print("No function to call")

    chat_store(answer, 'donna', 'False')

    return answer

# print(stock_script.StockTest())
