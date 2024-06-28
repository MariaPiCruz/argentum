CREATE DATABASE  IF NOT EXISTS `argentum` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `argentum`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: argentum
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `dni` varchar(10) NOT NULL,
  `cuil` varchar(45) NOT NULL,
  `cbu` varchar(45) NOT NULL,
  `alias` varchar(45) NOT NULL,
  `saldo` decimal(10,2) NOT NULL,
  `idTarjeta` int NOT NULL,
  `idTipoCuenta` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cliente_tarjeta_idx` (`idTarjeta`),
  KEY `cliente_cuenta_idx` (`idTipoCuenta`),
  CONSTRAINT `cliente_cuenta` FOREIGN KEY (`idTipoCuenta`) REFERENCES `tipocuentas` (`id`),
  CONSTRAINT `cliente_tarjeta` FOREIGN KEY (`idTarjeta`) REFERENCES `tarjetas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (16,'prubea','apellido de prueba','12345678','20123456782','1356965717932813381750','h91w1-zhopb',0.00,3,1);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuentas`
--

DROP TABLE IF EXISTS `cuentas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuentas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `idCliente` int NOT NULL,
  `email` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cliente_cuentas_idx` (`idCliente`),
  CONSTRAINT `cliente_cuentas` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuentas`
--

LOCK TABLES `cuentas` WRITE;
/*!40000 ALTER TABLE `cuentas` DISABLE KEYS */;
INSERT INTO `cuentas` VALUES (6,'usuario_prueba','1234',16,'prueba@gmail.com');
/*!40000 ALTER TABLE `cuentas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarjetas`
--

DROP TABLE IF EXISTS `tarjetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarjetas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nroTarjeta` varchar(45) NOT NULL,
  `vencimiento` varchar(45) NOT NULL,
  `codigo` varchar(3) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `fechaInicio` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarjetas`
--

LOCK TABLES `tarjetas` WRITE;
/*!40000 ALTER TABLE `tarjetas` DISABLE KEYS */;
INSERT INTO `tarjetas` VALUES (1,'4000123456789101','2026-08-01','123','VISA Debito','2020-07-01'),(2,'4000987654321011','2026-08-01','987','VISA Credito','2020-07-01'),(3,'377798765444332','2026-08-01','997','AMERICAN EXPRESS','2020-07-01');
/*!40000 ALTER TABLE `tarjetas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipocuentas`
--

DROP TABLE IF EXISTS `tipocuentas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipocuentas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipoCuenta` varchar(45) NOT NULL,
  `nroCuenta` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipocuentas`
--

LOCK TABLES `tipocuentas` WRITE;
/*!40000 ALTER TABLE `tipocuentas` DISABLE KEYS */;
INSERT INTO `tipocuentas` VALUES (1,'Caja de Ahorro en Pesos','0650030602000080904070'),(2,'Caja de Ahorro en USD','084-123456 / 3');
/*!40000 ALTER TABLE `tipocuentas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

CREATE TABLE IF NOT EXISTS destinatarios (
    idDestinatario int NOT NULL AUTO_INCREMENT,
    descripcion varchar(45) NOT NULL,
    cbu varchar(45) NOT NULL,
    alias varchar(45) NOT NULL,
	idCliente int,
	PRIMARY KEY (`idDestinatario`),
    KEY `cliente_destinatarios_idx` (`idCliente`),
    CONSTRAINT `cliente_destinatarios` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- Dump completed on 2024-06-25 20:55:24
