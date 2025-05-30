from flask import Flask, render_template, redirect, request, session
from flask_socketio import SocketIO
import sqlite3

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/escolher-carta', methods=['GET', 'POST'])
def escolher_carta():
    return render_template('escolher-carta.html')

@app.route('/jogar', methods=['GET', 'POST'])
def jogar():
    return render_template('jogar.html')

@app.route('/tutorial', methods=['GET', 'POST'])
def tutorial():
    return render_template('tutorial.html')

if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=80, debug=True)