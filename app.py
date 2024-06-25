
#--------------------------------------------------------------------
# Instalar con pip install Flask
from flask import Flask, request, jsonify

# Instalar con pip install flask-cors
from flask_cors import CORS

# Instalar con pip install mysql-connector-python
import mysql.connector




#--------------------------------------------------------------------

app = Flask(__name__)
CORS(app)  # Esto habilitará CORS para todas las rutas

class Cuentas:

    def __init__(self, host, user, password, database):

        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )

        self.cursor = self.conn.cursor(dictionary=True)
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS accounts (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL); ''')
        self.conn.commit()
    
    def agregar_cuenta(self, username, email, password):
        sql = "INSERT INTO accounts (username, email, password) VALUES (%s, %s, %s)"
        valores = (username, email, password)

        self.cursor.execute(sql,valores)
        self.conn.commit()
        return self.cursor.lastrowid

    def consultar_cuenta(self, username, password):
        self.cursor.execute(f"SELECT * FROM accounts WHERE username = '{username}' and password = '{password}'")
        return self.cursor.fetchone()

    def modificar_cuenta(self, id, nuevo_username, nuevo_email, nueva_password):
        sql = "UPDATE accounts SET username = %s, email = %s, password = %s WHERE id = %s"
        valores = (nuevo_username, nuevo_email, nueva_password, id)

        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0
    


    def eliminar_cuenta(self, id):
        self.cursor.execute(f"DELETE FROM accounts WHERE id = {id}")
        self.conn.commit()
        return self.cursor.rowcount > 0

# Programa principal
cuentas = Cuentas(host='localhost', user='root', password='1234', database='loginapp')





@app.route("/accounts", methods=["POST"])
def accounts():
    if 'email' in request.form:  # Esto indica que es una solicitud de registro
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        nuevo_id = cuentas.agregar_cuenta(username, email, password)
        if nuevo_id:    
            return jsonify({"mensaje": "Cuenta creada correctamente."}), 201
        else:
            return jsonify({"mensaje": "Error al crear la cuenta."}), 500
    else:  # Esto indica que es una solicitud de inicio de sesión
        username = request.form['username']
        password = request.form['password']
        cuenta = cuentas.consultar_cuenta(username, password)
        if cuenta:
            return jsonify(cuenta)
        else:
            return jsonify({"mensaje": "Datos incorrectos."}), 500



if __name__ == "__main__":
    app.run(debug=True)

