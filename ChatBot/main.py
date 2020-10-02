import nltk
# nltk.download('punkt')
from nltk.stem.lancaster import LancasterStemmer

stemmer = LancasterStemmer()

import numpy
import tensorflow
from tensorflow import keras
import random
import json
import pickle

words = []
labels = []
docs_x = []  # pattern
docs_y = []  # associated tag of the pattern

# importing the chat intents into data
with open('intents.json') as file:
    data = json.load(file)

try:
    with open("data.pickle", "rb") as f:
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

    ## Stemming the words eg thats -> that
    words = [stemmer.stem(w.lower()) for w in words if w != "?"]
    # Sorting and unique

    words = sorted(list(set(words)))

    labels = sorted(labels)

    # One Hot Encoding 
    training = []  ##bag of words one hot encoded
    output = []  # the length of the amount of labels/tags we have in our dataset

    out_empty = [0 for _ in range(len(labels))]

    for x, doc in enumerate(docs_x):
        bag = []

        wrds = [stemmer.stem(w.lower()) for w in doc]  # saving the all the words stemmed in wrds

        for w in words:
            if w in wrds:
                bag.append(1)  ##updating the one hot encoding
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
model.summary()
model.compile(optimizer='sgd',
              loss='categorical_crossentropy',
              metrics=['accuracy'])
try:
    model.load("model.chatbot")
except:
    model.fit(training, output, epochs=700, batch_size=8)
    model.save("model.chatbot")


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

        if (tag == "payments_debit"):
            print("Calling function to add debit to database")

        elif (tag == "payments_credit"):
            print("Calling function to add credit to database")

        elif (tag == "amazon_add"):
            print("Calling function to add item to amazon wishlist")

        elif (tag == "amazon_buy"):
            print("Calling function to add check status of amazon wishlist")

        else:
            print("No function to call")


chat()
