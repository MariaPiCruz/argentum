
#--------------------------------------------------------------------
# Instalar con pip install Flask
from flask import Flask, request, jsonify

# Instalar con pip install flask-cors
from flask_cors import CORS

# Instalar con pip install mysql-connector-python
import mysql.connector

import random

import string




#--------------------------------------------------------------------

app = Flask(__name__)
CORS(app)  # Esto habilitará CORS para todas las rutas

class Conexion:

    def __init__(self, host, user, password, database):

        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )

        self.cursor = self.conn.cursor()

        # Intentamos seleccionar la base de datos
        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
# Si la base de datos no existe, la creamos

            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err
# Una vez que la base de datos está establecida, creamos la tabla si no existe

        self.cursor.execute('''CREATE TABLE IF NOT EXISTS clientes (
            id int NOT NULL AUTO_INCREMENT,
            nombre varchar(45) NOT NULL,
            apellido varchar(45) NOT NULL,
            dni varchar(10) NOT NULL,
            cuil varchar(45) NOT NULL,
            cbu varchar(45) NOT NULL,
            alias varchar(45) NOT NULL,
            saldo decimal(10,2) NOT NULL,
            idTarjeta int NOT NULL,
            idTipoCuenta int NOT NULL,
            PRIMARY KEY (`id`),
            KEY `cliente_tarjeta_idx` (`idTarjeta`),
            KEY `cliente_cuenta_idx` (`idTipoCuenta`),
            CONSTRAINT `cliente_cuenta` FOREIGN KEY (`idTipoCuenta`) REFERENCES `tipocuentas` (`id`),
            CONSTRAINT `cliente_tarjeta` FOREIGN KEY (`idTarjeta`) REFERENCES `tarjetas` (`id`)
            ) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;''')
        self.conn.commit()

        self.cursor.execute('''CREATE TABLE IF NOT EXISTS cuentas (
            id int NOT NULL AUTO_INCREMENT,
            username varchar(45) NOT NULL,
            password varchar(45) NOT NULL,
            idCliente int NOT NULL,
            email varchar(45) NOT NULL,
            PRIMARY KEY (`id`),
            KEY `cliente_cuentas_idx` (`idCliente`),
            CONSTRAINT `cliente_cuentas` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`id`)
            ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8''')
        
        self.conn.commit()

        self.cursor.execute('''CREATE TABLE IF NOT EXISTS `tarjetas` (
            `id` int NOT NULL AUTO_INCREMENT,
            `nroTarjeta` varchar(45) NOT NULL,
            `vencimiento` varchar(45) NOT NULL,
            `codigo` varchar(3) NOT NULL,
            `tipo` varchar(50) NOT NULL,
            `fechaInicio` varchar(45) NOT NULL,
            PRIMARY KEY (`id`)
            ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;''')
        
        self.conn.commit()
        
        # self.cursor.execute('''INSERT INTO `tarjetas` (nroTarjeta, vencimiento, codigo, tipo, fechaInicio) VALUES ('4000123456789101','2026-08-01','123','VISA Debito','2020-07-01'),('4000987654321011','2026-08-01','987','VISA Credito','2020-07-01'),('377798765444332','2026-08-01','997','AMERICAN EXPRESS','2020-07-01');''')
        # self.conn.commit()
        
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS `tipocuentas` (
        `id` int NOT NULL AUTO_INCREMENT,
        `tipoCuenta` varchar(45) NOT NULL,
        `nroCuenta` varchar(45) NOT NULL,
        PRIMARY KEY (`id`)
        ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;''')
        self.conn.commit()

        # self.cursor.execute('''INSERT INTO `tipocuentas` (tipoCuenta, nroCuenta) VALUES ('Caja de Ahorro en Pesos','0650030602000080904070'),('Caja de Ahorro en USD','084-123456 / 3');''')
        # self.conn.commit()

        # ------------------------------------------------
        #           CREACION TABLA DESTINATARIO
        # ------------------------------------------------
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS `destinatarios`(
        `idDestinatario` int NOT NULL AUTO_INCREMENT,
        `destinatario` varchar(45) NOT NULL,
	    `cbu` varchar(45) NOT NULL,
        `alias` varchar(45) NOT NULL,
	    `idCliente` int,
	    PRIMARY KEY (`idDestinatario`),
        KEY `cliente_destinatarios_idx` (`idCliente`),
        CONSTRAINT `cliente_destinatarios` FOREIGN KEY (`idCliente`) REFERENCES clientes (`id`)
        ) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;''')
        self.conn.commit()
        # ------------------------------------------------

        self.cursor.close() #el cursor lo cerramos recien aca una vez que se ejecutaron las dos acciones.
        
        self.cursor = self.conn.cursor() #y ahora si volvemos a abrir el cursor, pero sin el dictionary en true.
    
    def agregar_cuenta(self, username, password, idCliente, email):
        sql = "INSERT INTO cuentas (username, password, idCliente, email) VALUES (%s, %s, %s, %s)"
        valores = (username, password, idCliente, email)
        self.cursor.execute(sql,valores)
        self.conn.commit()
        nueva_cuenta_id = self.cursor.lastrowid
        return nueva_cuenta_id
    
    def agregar_cliente(self, nombre, apellido, dni, cuil, cbu, alias, saldo, idTarjeta, idTipoCuenta):
        sql = "INSERT INTO  clientes (nombre, apellido, dni, cuil, cbu, alias, saldo, idTarjeta, idTipoCuenta) values (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        valores = (nombre, apellido, dni, cuil, cbu, alias, saldo, idTarjeta, idTipoCuenta)
        self.cursor.execute(sql,valores)
        self.conn.commit()
        nuevo_cliente_id = self.cursor.lastrowid
        return nuevo_cliente_id

    def consultar_cuenta(self, username, password):
        self.cursor.execute(f"SELECT * FROM cuentas WHERE username = '{username}' and password = '{password}'")
        return self.cursor.fetchone()
        
    def consultar_cliente_por_id(self, cliente_id):
        sql = "SELECT * FROM clientes WHERE id = %s"
        valores = (cliente_id,)
        self.cursor.execute(sql, valores)
        cliente = self.cursor.fetchone()
        return cliente

    def modificar_cuenta(self, id, nuevo_username, nuevo_email, nueva_password):
        sql = "UPDATE cuentas SET username = %s, email = %s, password = %s WHERE id = %s"
        valores = (nuevo_username, nuevo_email, nueva_password, id)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0
        
    def eliminar_cuenta(self, id):
        self.cursor.execute(f"DELETE FROM cuentas WHERE id = {id}")
        self.conn.commit()
        return self.cursor.rowcount > 0
    
    def consultar_datos_cuenta_bancaria(self, idCliente):
        sql = "select tipoCuenta, nroCuenta from clientes, tipoCuentas where tipoCuentas.id = clientes.idTipoCuenta and clientes.id = %s;"
        valores = (idCliente,)
        self.cursor.execute(sql, valores)
        tipoCuenta = self.cursor.fetchone()
        return tipoCuenta
    
    def consultar_datos_tarjeta(self, idCliente):
        sql = ("select nroTarjeta, vencimiento, codigo, tipo, fechaInicio from clientes, tarjetas where tarjetas.id = clientes.idTarjeta and clientes.id = %s;")
        valores = (idCliente,)
        self.cursor.execute(sql, valores)
        tarjeta = self.cursor.fetchone()
        return tarjeta
    
    # ------------------------------------------------
    #           METODO AGREGAR DESTINATARIO
    # ------------------------------------------------  
    def agregar_destinatario(self, descripcion,   cbu, alias, idCliente):
        sql = "INSERT INTO destinatarios (descripcion, cbu, alias, idCliente) VALUES (%s, %s, %s, %s)"
        valores = (descripcion, cbu, alias, idCliente)
        self.cursor.execute(sql,valores)
        self.conn.commit()
        nuevo_destinatario_id = self.cursor.lastrowid
        return nuevo_destinatario_id
    # ------------------------------------------------   
    #           METODO MOSTRAR DESTINATARIO
    # ------------------------------------------------  
    def consultar_destinatarios(self, idCliente):
        sql = "SELECT d.idDestinatario, d.descripcion, d.cbu, d.alias FROM destinatarios d RIGHT JOIN clientes c ON d.idCliente = c.id WHERE idCliente = %s;"
        valores = (idCliente,)
        self.cursor.execute(sql, valores)
        destinatarios = self.cursor.fetchall()
        return destinatarios
    # ------------------------------------------------  
    #           METODO ELIMINAR DESTINATARIO
    # ------------------------------------------------ 
    def eliminar_destinatario(self, idDestinatario):
        self.cursor.execute(f"DELETE FROM destinatarios WHERE idDestinatario = {idDestinatario}")
        self.conn.commit()
        return self.cursor.rowcount > 0
    # ------------------------------------------------  
    #           METODO MODIFICAR DESTINATARIO
    # ------------------------------------------------ 
    def modificar_destinatario(self, idDestinatario, nueva_descripcion, nuevo_cbu, nuevo_alias):
        sql = "UPDATE destinatarios SET descripcion = %s, cbu = %s, alias = %s WHERE idDestinatario = %s"
        valores = (nueva_descripcion, nuevo_cbu, nuevo_alias, idDestinatario)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0 
    # ------------------------------------------------  
    #           METODO CONSULTAR DESTINATARIO
    # ------------------------------------------------ 
    def consultar_un_destinatario(self, idDestinatario):
        sql = "SELECT descripcion, cbu, alias FROM destinatarios WHERE idDestinatario = %s;"
        valores = (idDestinatario,)
        self.cursor.execute(sql, valores)
        destinatarios = self.cursor.fetchall()
        return destinatarios


# ------------------------------------------------  
#       PROGRAMA PRINCIPAL
# ------------------------------------------------ 
conexion = Conexion(host='localhost', user='root', password='', database='argentum')

@app.route("/cuentas", methods=["POST"])
def loguin():
    username = request.form['username']
    password = request.form['password']
    cuenta = conexion.consultar_cuenta(username, password)
    if cuenta:
        cliente_id = cuenta[3] 
        cliente_info = conexion.consultar_cliente_por_id(cliente_id)
        return jsonify({"cuenta": cuenta, "cliente_info": cliente_info})
    else:
        return jsonify({"mensaje": "Datos incorrectos."}), 500

def calcular_digito_verificador(base, factores):
    suma = sum(int(d) * f for d, f in zip(base, factores))
    resto = suma % 10
    return 10 - resto if resto != 0 else 0

def generar_cbu():
    # Generar los primeros 7 dígitos del CBU (código de entidad y sucursal)
    entidad = str(random.randint(1, 999)).zfill(3)
    sucursal = str(random.randint(1, 9999)).zfill(4)

    base1 = f'{entidad}{sucursal}'

    # Calcular el dígito verificador del código de entidad y sucursal
    factores1 = [7, 1, 3, 9, 7, 1, 3]
    verificador1 = calcular_digito_verificador(base1, factores1)

    # Generar los primeros 13 dígitos del número de cuenta
    numero_cuenta = str(random.randint(1, 9999999999999)).zfill(13)

    # Calcular el dígito verificador del número de cuenta
    factores2 = [3, 9, 7, 1, 3, 9, 7, 1, 3, 9, 7, 1, 3]
    verificador2 = calcular_digito_verificador(numero_cuenta, factores2)

    # Formar el CBU completo
    cbu = f'{base1}{verificador1}{numero_cuenta}{verificador2}'
    return cbu

def generar_alias(longitud_min=6, longitud_max=20):
    caracteres = string.ascii_lowercase + string.digits + '.-'
    longitud = random.randint(longitud_min, longitud_max)
    alias = ''.join(random.choice(caracteres) for _ in range(longitud))
    return alias

@app.route("/clientes", methods=["POST"])
def agregar_cliente():
    nombre = request.form['nombre']
    apellido = request.form['apellido']
    dni = request.form['dni']
    cuil = request.form['cuil']
    cbu = generar_cbu()
    alias = generar_alias()
    saldo = 0
    idTarjeta = 1
    idTipoCuenta = 1

    # Agregar el cliente a la base de datos
    nuevo_cliente_id = conexion.agregar_cliente(nombre, apellido, dni, cuil, cbu, alias, saldo, idTarjeta, idTipoCuenta)

    if nuevo_cliente_id:
        # Generar datos para la cuenta
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        # Agregar la cuenta asociada al cliente
        nueva_cuenta_id = conexion.agregar_cuenta(username, password, nuevo_cliente_id, email)
        
        if nueva_cuenta_id:
            return jsonify({"mensaje": "Cliente y cuenta creados correctamente."}), 201
        else:
            return jsonify({"mensaje": "Error al crear la cuenta."}), 500
    else:
        return jsonify({"mensaje": "Error al crear el cliente."}), 500
    

@app.route("/tipoCuenta/<int:idCliente>", methods=["GET"])
def mostrar_datos_cuenta(idCliente):
    tipoCuenta = conexion.consultar_datos_cuenta_bancaria(idCliente)
    if tipoCuenta:
        return jsonify(tipoCuenta)
    else:
        return "Cuenta no encontrada", 404
    
@app.route("/tipoTarjeta/<int:idCliente>", methods=["GET"])
def mostrar_datos_tarjeta(idCliente):
    tarjeta = conexion.consultar_datos_tarjeta(idCliente)
    if tarjeta:
        return jsonify(tarjeta)
    else:
        return "Tarjeta no encontrada", 404
    
# ------------------------------------------------  
#           RUTEO AGREGAR DESTINATARIO
# ------------------------------------------------ 
@app.route("/destinatarios/<int:idCliente>", methods=["POST"])
def agregar_destinatario(idCliente):
    descripcion = request.form['descripcion']
    cbu = request.form['cbu']
    alias = request.form['alias']

    # Agregar el destinatario a la base de datos
    nuevo_destinatario_id = conexion.agregar_destinatario(descripcion,cbu,alias,idCliente)

    # Pregunto si fue exitosa la operacion
    if nuevo_destinatario_id:
        return jsonify({"mensaje": "Destinatario agregado a la Agenda."}), 201
    else:
        return jsonify({"mensaje": "Error al agregar el destinatario."}), 500

# ------------------------------------------------  
#           RUTEO MOSTRAR DESTINATARIO
# ------------------------------------------------ 
@app.route("/destinatarios/<int:idCliente>", methods=["GET"])
def mostrar_agenda(idCliente):
    agenda = conexion.consultar_destinatarios(idCliente)
    if agenda:
        return jsonify(agenda)
    else:
        return "Agenda vacía", 404

# ------------------------------------------------  
#           RUTEO ELIMINAR DESTINATARIO
# ------------------------------------------------

@app.route("/destinatarios/<int:idDestinatario>", methods=["DELETE"])
def eliminar_destinatario(idDestinatario):
    destinatario = conexion.eliminar_destinatario(idDestinatario)
    if destinatario:
        return jsonify({"mensaje": "Contacto eliminado"}), 200
    else:
        return jsonify({"mensaje": "Error al eliminar el contacto"}), 500

# ------------------------------------------------  
#           RUTEO MODIFICAR DESTINATARIO
# ------------------------------------------------ 
@app.route("/destinatarios/<int:idDestinatario>", methods=["PUT"])
def modificar_destinatario(idDestinatario):
    nueva_descripcion = request.form['descripcion']
    nuevo_cbu = request.form['cbu']
    nuevo_alias = request.form['alias']


# ------------------------------------------------  
#           RUTEO BUSCAR UN DESTINATARIO
# ------------------------------------------------ 

if __name__ == "__main__":
    app.run(debug=True)

