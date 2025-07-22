from flask import Flask, render_template, request, redirect, url_for
import os

app = Flask(__name__)
USER_FILE = "users.txt"

def load_users():
    users = {}
    if os.path.exists(USER_FILE):
        with open(USER_FILE, 'r') as f:
            for line in f:
                u, p = line.strip().split(',')
                users[u] = p
    return users

def save_user(username, password):
    with open(USER_FILE, 'a') as f:
        f.write(f"{username},{password}\n")

@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    users = load_users()
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users:
            return "Username already exists!"
        save_user(username, password)
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    users = load_users()
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users and users[username] == password:
            return redirect(url_for('dashboard', user=username))
        else:
            return "Invalid credentials"
    return render_template('login.html')

@app.route('/dashboard/<user>')
def dashboard(user):
    return render_template('dashboard.html', user=user)

if __name__ == '__main__':
    app.run(debug=True)
