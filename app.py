
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
        # Una vez que la base de datos está establecida, creamos las tablas si no existen

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
        
        # --------------------------------------------------------------
        # Tabla y datos movimientos
        # --------------------------------------------------------------
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS `movimientos` (
        `id` int NOT NULL AUTO_INCREMENT,
        `cliente` varchar(11) COLLATE utf8mb4_general_ci NOT NULL,
        `nrocuenta` varchar(12) COLLATE utf8mb4_general_ci NOT NULL,
        `fecha` date NOT NULL,
        `nrotransaccion` int NOT NULL,
        `descripcion` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
        `importe` decimal(10,2) NOT NULL,
        `saldo` decimal(10,2) NOT NULL,
        PRIMARY KEY (`id`)
        ) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8;''')
        self.conn.commit()
        
        self.cursor.execute('''TRUNCATE TABLE `movimientos`''')
        self.conn.commit()

        self.cursor.execute('''INSERT INTO `movimientos` (`id`, `cliente`, `nrocuenta`, `fecha`, `nrotransaccion`, `descripcion`, `importe`, `saldo`) VALUES
        (1, '16', '0650030602000080904070', '2024-05-12', 16733114, 'Compra con tarjeta de debito 	 Farmacia curie - tarj nro. 1669', -9880.00, -1944.17),
        (2, '16', '0650030602000080904070', '2024-05-13', 42970469, 'Transferencia recibida 	 De severo/carlos          /              - var / 20146301062', 15000.00, 13055.83),
        (3, '16', '0650030602000080904070', '2024-05-17', 14301551, 'Transferencia recibida 	 De linares  carlos o      /              - fac / 20102285108', 30000.00, 43055.83),
        (4, '16', '0650030602000080904070', '2024-05-18', 14255271, 'Compra con tarjeta de debito 	 Merpago*beysan - tarj nro. 1669', -11100.00, 25355.83),
        (5, '16', '0650030602000080904070', '2024-05-18', 12869969, 'Compra con tarjeta de debito 	 Los mussini - tarj nro. 1669', -6600.00, 36455.83),
        (6, '16', '0650030602000080904070', '2024-05-20', 60647033, 'Pago de servicios 	 C rosales abl: 010000000047393', -5696.01, 8159.82),
        (7, '16', '0650030602000080904070', '2024-05-20', 10669533, 'Compra con tarjeta de debito 	 Merpago*lanueva - tarj nro. 1669', -6500.00, 13855.83),
        (8, '16', '0650030602000080904070', '2024-05-20', 31304595, 'Pago de servicios 	 Recarga sube: 6061268259397871', -5000.00, 20355.83),
        (9, '16', '0650030602000080904070', '2024-05-21', 56497412, 'Compra con tarjeta de debito 	 Cooperativa obrera - tarj nro. 1669', -12750.55, 15409.27),
        (10, '16', '0650030602000080904070', '2024-05-21', 95832232, 'Transferencia recibida 	 De patricia del pilar mol /              - var / 27208152985', 20000.00, 28159.82),
        (11, '16', '0650030602000080904070', '2024-05-23', 1104340, 'Seguro de accidentes personales 	 Por deb:23/05/2024 part 000000000001104340', -11849.64, 3559.63),
        (12, '16', '0650030602000080904070', '2024-05-24', 5511, 'Traspaso de saldo exento de c cte 	 De cuenta corriente a caja de ahorro', 0.00, -2406.57),
        (13, '16', '0650030602000080904070', '2024-05-24', 5510, 'Traspaso de saldo entre cuentas 	 De cuenta corriente a caja de ahorro', 2406.57, 0.00),
        (14, '16', '0650030602000080904070', '2024-05-24', 56850750, 'Compra con tarjeta de debito 	 Cooperativa obrera - tarj nro. 1669', -58966.20, -2406.57),
        (15, '16', '0650030602000080904070', '2024-05-24', 50684054, 'Transferencia recibida 	 De patricia del pilar mol /              - var / 27208152985', 10000.00, 56559.63),
        (16, '16', '0650030602000080904070', '2024-05-24', 56678281, 'Transferencia recibida 	 De patricia del pilar mol /              - var / 27208152985', 10000.00, 46559.63),
        (17, '16', '0650030602000080904070', '2024-05-24', 99104910, 'Transferencia inmediata 	 A diego german sanchez    / varios       - var / 20278277489', -7000.00, 36559.63),
        (18, '16', '0650030602000080904070', '2024-05-24', 98911533, 'Transferencia inmediata 	 A carmen del yessica carr / varios       - var / 27188236540', -10000.00, 43559.63),
        (19, '16', '0650030602000080904070', '2024-05-24', 95270195, 'Transf recibida cvu mismo titular 	 De nestor david rivarola    / mercado pago   /20183061888', 50000.00, 53559.63),
        (20, '16', '0650030602000080904070', '2024-05-28', 5514, 'Traspaso de saldo exento de c cte 	 De cuenta corriente a caja de ahorro', 0.00, -9406.57),
        (21, '16', '0650030602000080904070', '2024-05-28', 5513, 'Traspaso de saldo entre cuentas 	 De cuenta corriente a caja de ahorro', 7000.00, -2406.57),
        (22, '16', '0650030602000080904070', '2024-05-28', 56034660, 'Transferencia inmediata 	 A diego german sanchez    / varios       - var / 20278277489', -7000.00, -9406.57),
        (23, '16', '0650030602000080904070', '2024-05-29', 5517, 'Traspaso de saldo entre cuentas 	 De caja de ahorro a cuenta corriente', -9406.57, 70593.43),
        (24, '16', '0650030602000080904070', '2024-05-29', 5516, 'Traspaso de saldo exento a c cte 	 De caja de ahorro a cuenta corriente', 0.00, 80000.00),
        (25, '16', '0650030602000080904070', '2024-05-29', 60105924, 'Transferencia recibida 	 De rivarola/nestor dav    /              - var / 20183061888', 80000.00, 70593.43),
        (26, '16', '0650030602000080904070', '2024-05-30', 5522, 'Traspaso de saldo exento de c cte 	 De cuenta corriente a caja de ahorro', 0.00, -85244.07),
        (27, '16', '0650030602000080904070', '2024-05-30', 5521, 'Traspaso de saldo entre cuentas 	 De cuenta corriente a caja de ahorro', 85244.07, 0.00),
        (28, '16', '0650030602000080904070', '2024-05-30', 56790838, 'Compra con tarjeta de debito 	 Cooperativa obrera - tarj nro. 1669', -126803.50, -85244.07),
        (29, '16', '0650030602000080904070', '2024-05-30', 11107692, 'Compra con tarjeta de debito 	 Panaderia lujan - tarj nro. 1669', -20034.00, 41559.43),
        (30, '16', '0650030602000080904070', '2024-05-30', 8555147, 'Pago de servicios 	 Recarga sube: 6061268259397871', -9000.00, 61593.43),
        (31, '16', '0650030602000080904070', '2024-05-31', 5531, 'Traspaso de saldo entre cuentas 	 De caja de ahorro a cuenta corriente', -85244.07, 22287.43),
        (32, '16', '0650030602000080904070', '2024-05-31', 5530, 'Traspaso de saldo exento a c cte 	 De caja de ahorro a cuenta corriente', 0.00, 107531.50),
        (33, '16', '0650030602000080904070', '2024-05-31', 1346030, 'Compra con tarjeta de debito 	 Bar central - tarj nro. 1669', -33800.00, 22287.43),
        (34, '16', '0650030602000080904070', '2024-05-31', 4454, 'Retiro de efectivo en otros bancos 	 Tarj nro. 1669', -5000.00, 56087.43),
        (35, '16', '0650030602000080904070', '2024-05-31', 16105372, 'Compra con tarjeta de debito 	 Vantage fcia del puert - tarj nro. 1669', -18218.50, 61087.43),
        (36, '16', '0650030602000080904070', '2024-05-31', 296946, 'Transferencia recibida 	 De sociedad militar segur / 5033425      - hab / 30527516737', 100000.00, 79305.93),
        (37, '16', '0650030602000080904070', '2024-05-31', 1982143, 'Compra con tarjeta de debito 	 Forraje don sebastian - tarj nro. 1669', -115450.00, -20694.07),
        (38, '16', '0650030602000080904070', '2024-05-31', 27253, 'Transferencia recibida 	 De sociedad militar segur / 5031023      - hab / 30527516737', 100000.00, 94755.93),
        (39, '16', '0650030602000080904070', '2024-05-31', 52330438, 'Transferencia recibida 	 De rivarola/nestor dav    /              - var / 20183061888', 80000.00, -5244.07),
        (40, '16', '0650030602000080904070', '2024-06-02', 6480700, 'Transferencia recibida 	 De rivarola/nestor dav    /              - var / 20183061888', 150000.00, 172287.43),
        (41, '16', '0650030602000080904070', '2024-06-03', 1117296, 'Pago a proveedores recibido 	 Jaque jonathan                20393542080 03 1117296', 100000.00, 177497.44),
        (42, '16', '0650030602000080904070', '2024-06-03', 18880824, 'Compra con tarjeta de debito 	 Chop chop - tarj nro. 1669', -12000.00, 77497.44),
        (43, '16', '0650030602000080904070', '2024-06-03', 15425725, 'Compra con tarjeta de debito 	 Level games - tarj nro. 1669', -6000.00, 89497.44),
        (44, '16', '0650030602000080904070', '2024-06-03', 84153, 'Debito automatico 	 Personal flow da-1001931994010002', -76789.99, 95497.44),
        (45, '16', '0650030602000080904070', '2024-06-04', 16140270, 'Compra con tarjeta de debito 	 Merpago*wirooscloudho - tarj nro. 1669', -16222.80, 118922.24),
        (46, '16', '0650030602000080904070', '2024-06-04', 67025767, 'Transferencia realizada 	 A asoc coop esc tecnica n / varios       - var / 33688086049', -15000.00, 135145.04),
        (47, '16', '0650030602000080904070', '2024-06-04', 56628017, 'Compra con tarjeta de debito 	 Cooperativa obrera - tarj nro. 1669', -16817.50, 150145.04),
        (48, '16', '0650030602000080904070', '2024-06-04', 56627490, 'Compra con tarjeta de debito 	 Cooperativa obrera - tarj nro. 1669', -83534.90, 166962.54),
        (49, '16', '0650030602000080904070', '2024-06-04', 60748865, 'Transferencia inmediata 	 A diego german sanchez    / varios       - var / 20278277489', -7000.00, 250497.44),
        (50, '16', '0650030602000080904070', '2024-06-04', 8257937, 'Transferencia recibida 	 De rivarola/nestor dav    /              - var / 20183061888', 80000.00, 257497.44),
        (51, '16', '0650030602000080904070', '2024-06-05', 9304, 'Pago de haberes 	 Transferencia s.n.p.', 691476.00, 796398.24),
        (52, '16', '0650030602000080904070', '2024-06-05', 21338803, 'Compra con tarjeta de debito 	 Matias jr - tarj nro. 1669', -23700.00, 104922.24),
        (53, '16', '0650030602000080904070', '2024-06-05', 807662, 'Transferencia recibida 	 De c a s tecnologia y seg /              - fac / 30709810770', 65000.00, 128622.24),
        (54, '16', '0650030602000080904070', '2024-06-05', 61423713, 'Transferencia inmediata 	 A patricia del pilar moli / varios       - var / 27208152985', -20000.00, 63622.24),
        (55, '16', '0650030602000080904070', '2024-06-05', 34289072, 'Transferencia realizada 	 A patricia del pilar moli / varios       - var / 27208152985', -30000.00, 83622.24),
        (56, '16', '0650030602000080904070', '2024-06-05', 10747264, 'Compra con tarjeta de debito 	 Panaderia lujan - tarj nro. 1669', -5300.00, 113622.24),
        (57, '16', '0650030602000080904070', '2024-06-06', 15108532, 'Compra con tarjeta de debito 	 Pibro sud srl - tarj nro. 1669', -48627.00, 469563.01),
        (58, '16', '0650030602000080904070', '2024-06-06', 2783900, 'Transferencia realizada 	 A rivarola emiliano javie / varios       - var / 20410728940', -30000.00, 518190.01),
        (59, '16', '0650030602000080904070', '2024-06-06', 9658135, 'Pago de servicios 	 Gas pampeana: 81090220100613841', -8760.69, 548190.01),
        (60, '16', '0650030602000080904070', '2024-06-06', 2074856, 'Compra con tarjeta de debito 	 Www.camuzzi gas pampeana - tarj nro. 1669', -8760.69, 556950.70),
        (61, '16', '0650030602000080904070', '2024-06-06', 87943446, 'Pago de servicios 	 Absa: 0001607487', -858.89, 565711.39),
        (62, '16', '0650030602000080904070', '2024-06-06', 39237113, 'Pago de servicios 	 Absa: 0001607487', -858.89, 566570.28),
        (63, '16', '0650030602000080904070', '2024-06-06', 76766748, 'Pago de servicios 	 Tarj naranja: 5895629993490781', -228969.07, 567429.17),
        (64, '16', '0650030602000080904070', '2024-06-07', 5566, 'Impuesto ley 25.413 debito 0,6% 	 ', 0.00, 477595.41),
        (65, '16', '0650030602000080904070', '2024-06-07', 5565, 'Traspaso de saldo entre cuentas 	 De caja de ahorro a cuenta corriente', -368.59, 477597.61),
        (66, '16', '0650030602000080904070', '2024-06-07', 5564, 'Traspaso de saldo exento a c cte 	 De caja de ahorro a cuenta corriente', 0.00, 477966.20),
        (67, '16', '0650030602000080904070', '2024-06-07', 62214534, 'Transferencia realizada 	 A lamique sebastian mario / varios       - var / 20402247615', -3600.00, 477597.61),
        (68, '16', '0650030602000080904070', '2024-06-07', 17307896, 'Compra con tarjeta de debito 	 Merpago*micolmartin - tarj nro. 1669', -18000.00, 481197.61),
        (69, '16', '0650030602000080904070', '2024-06-07', 52772327, 'Transferencia recibida 	 De rivarola/nestor dav    / varios       - var / 20183061888', 80000.00, 499197.61),
        (70, '16', '0650030602000080904070', '2024-06-07', 63564656, 'Transferencia inmediata 	 A patricia del pilar moli / varios       - var / 27208152985', -50000.00, 419197.61),
        (71, '16', '0650030602000080904070', '2024-06-07', 5559, 'Impuesto de sellos 	 ', 0.00, 469197.61),
        (72, '16', '0650030602000080904070', '2024-06-07', 5558, 'Iva 21% 	 ', 0.00, 469201.04),
        (73, '16', '0650030602000080904070', '2024-06-07', 5557, 'Cobro de interes por descubierto 	 Del 01/05/24 al 31/05/24', 0.00, 469264.03),
        (74, '16', '0650030602000080904070', '2024-06-07', 5556, 'Pago interes por saldo en cuenta 	 Del 01/05/24 al 31/05/24', 0.99, 469564.00),
        (75, '16', '0650030602000080904070', '2024-06-08', 17351719, 'Compra con tarjeta de debito 	 Cocina casera - tarj nro. 1669', -18600.00, 458995.41),
        (76, '16', '0650030602000080904070', '2024-06-09', 89945065, 'Compra con tarjeta de debito 	 Personal flow - tarj nro. 1669', -26570.04, 411729.36),
        (77, '16', '0650030602000080904070', '2024-06-09', 65336543, 'Transferencia inmediata 	 A leonardo alberto quirog / varios       - var / 20378963649', -15000.00, 438299.40),
        (78, '16', '0650030602000080904070', '2024-06-09', 7941407, 'Pago de servicios 	 C rosales abl: 010000000047393', -5696.01, 453299.40),
        (79, '16', '0650030602000080904070', '2024-06-10', 11729499, 'Compra con tarjeta de debito 	 Merpago*mercadopagopag - tarj nro. 1669', -19597.21, 392132.15);''')
        self.conn.commit()

        # self.cursor.execute('''INSERT INTO `tipocuentas` (tipoCuenta, nroCuenta) VALUES ('Caja de Ahorro en Pesos','0650030602000080904070'),('Caja de Ahorro en USD','084-123456 / 3');''')
        # self.conn.commit()
        
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

    # -------------------------------------------------
    # Alias y movimientos
    # -------------------------------------------------
    def actualiza_alias(self, idCliente, alias):
        sql = "update clientes set alias=%s where id=%s;"
        valores = (alias, idCliente,)
        self.cursor.execute(sql, valores)
        self.conn.commit()    
        return self.cursor.rowcount > 0
    
    def getMovimientos(self, client, cuenta):
        sql = "SELECT id, cliente, nrocuenta, fecha, nrotransaccion, descripcion, importe, saldo FROM movimientos WHERE cliente=%s AND nrocuenta=%s ORDER BY fecha DESC;"
        self.cursor.execute(sql, (client,cuenta,))

        movimientos = self.cursor.fetchall()

        if movimientos:
            return movimientos
        else:
            return ("No se encontraron movimientos en esta cuenta")

# Programa principal
conexion = Conexion(host='localhost', user='root', password='1234', database='argentum')


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

@app.route("/alias", methods=["PUT"])
def cambiar_alias():
    cliente = request.form['id']
    alias = request.form['alias']
    alias = conexion.actualiza_alias(cliente, alias)
    if alias:
        return jsonify(alias)
    else:
        return "Se produjo un error al actualizar el alias", 500
    
@app.route('/movimientos/<string:client>/<string:cuenta>', methods=['GET'])
def obtener_movimientos(client,cuenta):
    movimientos = conexion.getMovimientos(client,cuenta)
    return jsonify(movimientos)


if __name__ == "__main__":
    app.run(debug=True)

