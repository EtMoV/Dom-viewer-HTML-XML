# -*-coding:Latin-1 -*

from flask import Flask, request
from flask_pymongo import PyMongo
from flask_cors import CORS

from User import User
from Document import Document


app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/myFirsyMB'
database = PyMongo(app)
CORS(app)

#Les fonctions
@app.route('/users', methods=['GET'])
def get_all_users():
    u = User()
    return u.allUsers()

@app.route('/register', methods=['POST'])
def add_user():
    name = request.json['name']
    mdp = request.json['psw']
    return User.addUser(User(name,mdp))

@app.route('/documents', methods=['GET'])
def get_all_documents_id():
    d = Document()
    return d.allDocumentsID()

@app.route('/document/register', methods=['POST'])
def add_document():
    html = request.json['html']
    return Document.addDocument(Document(html))

if __name__ == '__main__':
    app.debug = True
    app.run()