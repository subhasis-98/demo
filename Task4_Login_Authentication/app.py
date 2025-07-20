from flask import Flask, render_template, request, redirect, url_for, flash, session
import os

app = Flask(__name__)
app.secret_key = "secret123"

USER_FILE = "user.txt"

def read_users():
    if not os.path.exists(USER_FILE):
        return []
    with open(USER_FILE, "r") as file:
        lines = file.readlines()
        return [line.strip().split(",") for line in lines]

def save_user(username, email, password):
    with open(USER_FILE, "a") as file:
        file.write(f"{username},{email},{password}\n")

@app.route("/")
def home():
    return redirect(url_for("login"))

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]

        users = read_users()

        for user in users:
            if user[1] == email:
                flash("Email already registered!", "danger")
                return redirect(url_for("register"))

        save_user(username, email, password)
        flash("Registration successful!", "success")
        return redirect(url_for("login"))

    return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        users = read_users()

        for user in users:
            if user[1] == email and user[2] == password:
                session["user"] = user[0]
                return f"Welcome, {user[0]}!"
        flash("Invalid email or password!", "danger")

    return render_template("login.html")

if __name__ == "__main__":
    app.run(debug=True)
