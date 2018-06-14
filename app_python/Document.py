# -*-coding:Latin-1 -*

from flask import Flask, jsonify, request
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/myFirsyMB'
database = PyMongo(app)

# la classe mère user
class Document:
    with app.app_context():
        documentBD=database.db.document

    def __init__(self,html=None):
        self.html = html

    def addDocument (self):
        doc_id = self.documentBD.insert({'html': self.html})
        new_doc= self.documentBD.find_one({'_id': doc_id})
        #output = {'html': new_doc['html'],'_id': str(doc_id)}
        output = {'id': str(doc_id)}
        return jsonify({'result': output})

    def allDocumentsID (self):
        output = []
        for doc in self.documentBD.find():
            output.append({'id': str(doc['_id'])})
        return jsonify({'result' : output})
