# -*-coding:Latin-1 -*

from flask import Flask, jsonify, request
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/myFirsyMB'
database = PyMongo(app)

# la classe mère user
class User:
    with app.app_context():
        users=database.db.users

    def __init__(self,name=None,psw=None):
        self.log = name
        self.mdp = psw

    def addUser (self):
        user = self.users.find_one({'name': self.log, 'psw': self.mdp})
        if user:
            output = "Le compte ne peut être créé"
        else:
            user_id = self.users.insert({'name': self.log, 'psw': self.mdp})
            new_user = self.users.find_one({'_id': user_id})
            output = {'name': new_user['name'], 'psw': new_user['psw']}
        return jsonify({'result': output})

    def allUsers (self):
        output = []
        for user in self.users.find():
            output.append({'name': user['name'], 'psw': user['psw']})
        return jsonify({'result' : output})

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

@app.route('/user', methods=['POST'])
def find_user():
    name = request.json['name']
    return User.addUser(User(name))
