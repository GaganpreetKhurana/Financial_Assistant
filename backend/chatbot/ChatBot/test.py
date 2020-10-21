import os

rel_path_model = 'model.chatbot'
parent_dir = os.path.dirname(os.path.abspath(__file__))
abs_path_model = os.path.join(parent_dir, rel_path_model)
print(abs_path_model)


try:
    print("Yes")
except:
    print("No")
