/* ---------------------------------------------------- */
/*  Generated by Enterprise Architect Version 16.1 		*/
/*  Created On : 25-oct.-2023 8:51:15 a. m. 				*/
/*  DBMS       : MySql 						*/
/* ---------------------------------------------------- */

SET FOREIGN_KEY_CHECKS=0
; 
/* Drop Tables */

DROP TABLE IF EXISTS `Auditorio` CASCADE
;

DROP TABLE IF EXISTS `Aula` CASCADE
;

DROP TABLE IF EXISTS `Horario_Recurso` CASCADE
;

DROP TABLE IF EXISTS `Horario_Unidad` CASCADE
;

DROP TABLE IF EXISTS `Patio` CASCADE
;

DROP TABLE IF EXISTS `Prestamo` CASCADE
;

DROP TABLE IF EXISTS `Recurso` CASCADE
;

DROP TABLE IF EXISTS `Reserva` CASCADE
;

DROP TABLE IF EXISTS `Tokens` CASCADE
;

DROP TABLE IF EXISTS `unidad` CASCADE
;

DROP TABLE IF EXISTS `Usuario` CASCADE
;

/* Create Tables */

CREATE TABLE `Auditorio`
(
	`pk_fk_num_unidad` INT NOT NULL COMMENT 'Numero de la unidad a la que pertenece el recurso',
	`pk_fk_id_recurso` INT NOT NULL COMMENT 'Identificacion del recurso',
	`aforo` SMALLINT NOT NULL COMMENT 'Cantidad de personas que pueden ocupar el auditorio',
	CONSTRAINT `PK_Auditorio` PRIMARY KEY (`pk_fk_id_recurso` ASC, `pk_fk_num_unidad` ASC)
)
COMMENT = 'TIpo de recurso auditorio'

;

CREATE TABLE `Aula`
(
	`pk_fk_num_unidad` INT NOT NULL COMMENT 'Numero de la unidad a la que pertenece el recurso',
	`pk_fk_id_recurso` INT NOT NULL COMMENT 'Identificacion del recurso ',
	`cantidad_puestos` SMALLINT NOT NULL COMMENT 'Cantidad de puestos/aforo del aula',
	`material_puestos` ENUM ('madera','plastico','acrílico') NOT NULL COMMENT 'Nombre del material de cual están hechos los puestos: madera, plastico, etc',
	CONSTRAINT `PK_Aula` PRIMARY KEY (`pk_fk_id_recurso` ASC, `pk_fk_num_unidad` ASC)
)
COMMENT = 'Tipo de recurso aula, lugar en el que se da a clase'

;

CREATE TABLE `Horario_Recurso`
(
	`id` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador del horario',
	`dia` DECIMAL(1,0) NOT NULL COMMENT 'Número del día para el cual se define el horario.
	Comienza en 1 Representando el lunes, 2 martes, ... 7 domingo',
	`hora_inicio` TIME NOT NULL COMMENT 'Hora de inicio de servicio para el un día',
	`hora_cierre` TIME NOT NULL COMMENT 'Hora de fin de servicio para un día',
	`fk_id_recurso` INT NULL COMMENT 'Id del recurso al cual pertenece el horario',
	`fk_num_unidad` INT NULL COMMENT 'Numero de la unidad correspondiente al recurso al cual pertenece el horario',
	CONSTRAINT `PK_Horario` PRIMARY KEY (`id` ASC)
)
COMMENT = 'Representacion del horario de disponibilidad en un día para una unidad o recurso'

;

CREATE TABLE `Horario_Unidad`
(
	`id` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador del horario',
	`dia` DECIMAL(1,0) NOT NULL COMMENT 'Número del día para el cual se define el horario.
	Comienza en 1 Representando el lunes, 2 martes, ... 7 domingo',
	`hora_inicio` TIME NOT NULL COMMENT 'Hora de inicio de servicio para el un día',
	`hora_cierre` TIME NOT NULL COMMENT 'Hora de fin de servicio para un día',
	`fk_num_unidad` INT NULL COMMENT 'Numero de la uniadad al cual pertenece el horario',
	CONSTRAINT `PK_Horario` PRIMARY KEY (`id` ASC)
)
COMMENT = 'Representacion del horario de disponibilidad en un día para una unidad o recurso'

;

CREATE TABLE `Patio`
(
	`pk_fk_num_unidad` INT NOT NULL COMMENT 'Numero de la unidad a la que pertenece el recurso',
	`pk_fk_id_recurso` INT NOT NULL COMMENT 'Identificacion del recurso',
	`tipo_patio` ENUM ('abierto','cerrado') NOT NULL COMMENT 'Define la especializacion del patio, por ejemplo el deporte para el cual ',
	CONSTRAINT `PK_Patio` PRIMARY KEY (`pk_fk_id_recurso` ASC, `pk_fk_num_unidad` ASC)
)
COMMENT = 'Tipo de recurso patio, en el que se hace deporte'

;

CREATE TABLE `Prestamo`
(
	`fk_id_reserva` INT NOT NULL,
	`f_fecha_inicio` DATETIME NOT NULL,
	`f_fecha_entrega` DATETIME NOT NULL,
	`fk_id_admin_entrega` INT NOT NULL,
	`fk_id_admin_devolucion` INT NULL,
	CONSTRAINT `PK_Prestamo` PRIMARY KEY (`fk_id_reserva` ASC)
)
COMMENT = 'Registro del prestamo de un recurso fisico. En el que se entrega el recurso fisico a un usuario'

;

CREATE TABLE `Recurso`
(
	`pk_id_recurso` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador del recurso fisico',
	`pk_fk_num_unidad` INT NOT NULL,
	`nombre` VARCHAR(50) NOT NULL COMMENT 'Nombre del recurso fisico',
	`descripcion` VARCHAR(50) NOT NULL COMMENT 'Informacion que da informacion del recurso fisico',
	CONSTRAINT `PK_Table_Two` PRIMARY KEY (`pk_id_recurso` ASC, `pk_fk_num_unidad` ASC)
)
COMMENT = 'Recurso fisico perteneciente a una unidad'

;

CREATE TABLE `Reserva`
(
	`id_reserva` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificación de la reserva',
	`fecha_de_reserva` DATE NOT NULL COMMENT 'Fecha en la que se realizó la reserva',
	`fecha_inicio_reserva` DATETIME NOT NULL COMMENT 'Fecha y hora en la que inicia la reserva del recurso fisico',
	`fecha_fin_reserva` DATETIME NOT NULL COMMENT 'Fecha y hora en la que termina la reserva del recurso fisico',
	`fk_num_unidad` INT NOT NULL,
	`fk_id_recurso` INT NOT NULL,
	`fk_id_usuario` INT NOT NULL,
	CONSTRAINT `PK_Reserva` PRIMARY KEY (`id_reserva` ASC)
)
COMMENT = 'Datos del proceso en el que se anticipa el uso de un recurso fisico'

;

CREATE TABLE `Tokens`
(
	`id` INT NOT NULL AUTO_INCREMENT,
	`token` VARCHAR(250) NULL,
	CONSTRAINT `PK_Tokens` PRIMARY KEY (`id` ASC)
)

;

CREATE TABLE `unidad`
(
	`num_unidad` INT NOT NULL AUTO_INCREMENT COMMENT 'Número que identifica una unidad',
	`nombre` VARCHAR(25) NOT NULL COMMENT 'Nombre de la unidad',
	CONSTRAINT `PK_Table_One` PRIMARY KEY (`num_unidad` ASC)
)
COMMENT = 'Centro en el que se prestan recusos fisicos'

;

CREATE TABLE `Usuario`
(
	`id_usuario` INT NOT NULL AUTO_INCREMENT COMMENT 'identificador del usuario',
	`nombre` VARCHAR(50) NOT NULL COMMENT 'Nombre del usuario',
	`correo` VARCHAR(50) NOT NULL COMMENT 'Correo electronico (email) del usuario',
	`contrasena` VARCHAR(250) NOT NULL COMMENT 'Contraseña que servirá como clave de acceso al usuario mediante el logueo',
	`rol` ENUM ('usuario', 'administrador') default 'usuario' NOT NULL COMMENT 'Rol del usuario en el sistema (Usuario: ve y reserva espacio, Administrador: Ayuda en la gestión y préstamo de los espacios)',
	CONSTRAINT `PK_Usuario` PRIMARY KEY (`id_usuario` ASC)
)
COMMENT = 'Datos del usuario que interactua con el sistema, puede ser usuario de la aplicación o (exclusivo) administrador'

;

/* Create Primary Keys, Indexes, Uniques, Checks */

ALTER TABLE `Auditorio` 
 ADD CONSTRAINT `check_aforo` CHECK (aforo >= 1)
;

ALTER TABLE `Auditorio` 
 ADD INDEX `IXFK_Auditorio_Recurso` (`pk_fk_id_recurso` ASC, `pk_fk_num_unidad` ASC)
;

ALTER TABLE `Aula` 
 ADD CONSTRAINT `check_cant_puestos` CHECK (cantidad_puestos >= 1)
;

ALTER TABLE `Aula` 
 ADD INDEX `IXFK_Aula_Recurso` (`pk_fk_id_recurso` ASC, `pk_fk_num_unidad` ASC)
;

ALTER TABLE `Horario_Recurso` 
 ADD CONSTRAINT `check_dia_recurso` CHECK (dia >= 1 AND dia <= 7)
;

ALTER TABLE `Horario_Recurso` 
 ADD INDEX `IXFK_Horario - Copy_Recurso` (`fk_id_recurso` ASC, `fk_num_unidad` ASC)
;

ALTER TABLE `Horario_Unidad` 
 ADD CONSTRAINT `check_dia` CHECK (dia >= 1 AND dia <= 7)
;

ALTER TABLE `Horario_Unidad` 
 ADD INDEX `IXFK_Horario_unidad` (`fk_num_unidad` ASC)
;

ALTER TABLE `Patio` 
 ADD INDEX `IXFK_Patio_Recurso` (`pk_fk_id_recurso` ASC, `pk_fk_num_unidad` ASC)
;

ALTER TABLE `Prestamo` 
 ADD INDEX `IXFK_Prestamo_Reserva` (`fk_id_reserva` ASC)
;

ALTER TABLE `Prestamo` 
 ADD INDEX `IXFK_Prestamo_Usuario` (`fk_id_admin_entrega` ASC)
;

ALTER TABLE `Prestamo` 
 ADD INDEX `IXFK_Prestamo_Usuario_02` (`fk_id_admin_devolucion` ASC)
;

ALTER TABLE `Recurso` 
 ADD INDEX `IXFK_Recurso_Unidad` (`pk_fk_num_unidad` ASC)
;

ALTER TABLE `Reserva` 
 ADD CONSTRAINT `check_fechas` CHECK (fecha_inicio_reserva < fecha_fin_reserva)
;

ALTER TABLE `Reserva` 
 ADD INDEX `IXFK_Reserva_Recurso` (`fk_id_recurso` ASC, `fk_num_unidad` ASC)
;

ALTER TABLE `Reserva` 
 ADD INDEX `IXFK_Reserva_Usuario` (`fk_id_usuario` ASC)
;

ALTER TABLE `Usuario` 
 ADD CONSTRAINT `index_correo` UNIQUE (`correo` ASC)
;

ALTER TABLE `Usuario` 
 ADD CONSTRAINT `check_correo` CHECK (correo REGEXP '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$')
;

/* Create Foreign Key Constraints */

ALTER TABLE `Auditorio` 
 ADD CONSTRAINT `FK_Auditorio_Recurso`
	FOREIGN KEY (`pk_fk_id_recurso`, `pk_fk_num_unidad`) REFERENCES `Recurso` (`pk_id_recurso`,`pk_fk_num_unidad`) ON DELETE Restrict ON UPDATE Restrict
;

ALTER TABLE `Aula` 
 ADD CONSTRAINT `FK_Aula_Recurso`
	FOREIGN KEY (`pk_fk_id_recurso`, `pk_fk_num_unidad`) REFERENCES `Recurso` (`pk_id_recurso`,`pk_fk_num_unidad`) ON DELETE Restrict ON UPDATE Restrict
;

ALTER TABLE `Horario_Recurso` 
 ADD CONSTRAINT `FK_Horario - Copy_Recurso`
	FOREIGN KEY (`fk_id_recurso`, `fk_num_unidad`) REFERENCES `Recurso` (`pk_id_recurso`,`pk_fk_num_unidad`) ON DELETE Restrict ON UPDATE Restrict
;

ALTER TABLE `Horario_Unidad` 
 ADD CONSTRAINT `FK_Horario_unidad`
	FOREIGN KEY (`fk_num_unidad`) REFERENCES `unidad` (`num_unidad`) ON DELETE Restrict ON UPDATE Restrict
;

ALTER TABLE `Patio` 
 ADD CONSTRAINT `FK_Patio_Recurso`
	FOREIGN KEY (`pk_fk_id_recurso`, `pk_fk_num_unidad`) REFERENCES `Recurso` (`pk_id_recurso`,`pk_fk_num_unidad`) ON DELETE Restrict ON UPDATE Restrict
;

ALTER TABLE `Prestamo` 
 ADD CONSTRAINT `FK_Prestamo_Reserva`
	FOREIGN KEY (`fk_id_reserva`) REFERENCES `Reserva` (`id_reserva`) ON DELETE Restrict ON UPDATE Restrict
;

ALTER TABLE `Prestamo` 
 ADD CONSTRAINT `FK_Prestamo_Usuario`
	FOREIGN KEY (`fk_id_admin_entrega`) REFERENCES `Usuario` (`id_usuario`) ON DELETE Restrict ON UPDATE Restrict
;

ALTER TABLE `Prestamo` 
 ADD CONSTRAINT `FK_Prestamo_Usuario_02`
	FOREIGN KEY (`fk_id_admin_devolucion`) REFERENCES `Usuario` (`id_usuario`) ON DELETE Restrict ON UPDATE Restrict
;

ALTER TABLE `Recurso` 
 ADD CONSTRAINT `FK_Recurso_Unidad`
	FOREIGN KEY (`pk_fk_num_unidad`) REFERENCES `unidad` (`num_unidad`) ON DELETE Restrict ON UPDATE Restrict
;

ALTER TABLE `Reserva` 
 ADD CONSTRAINT `FK_Reserva_Recurso`
	FOREIGN KEY (`fk_id_recurso`, `fk_num_unidad`) REFERENCES `Recurso` (`pk_id_recurso`,`pk_fk_num_unidad`) ON DELETE Restrict ON UPDATE Restrict
;

ALTER TABLE `Reserva` 
 ADD CONSTRAINT `FK_Reserva_Usuario`
	FOREIGN KEY (`fk_id_usuario`) REFERENCES `Usuario` (`id_usuario`) ON DELETE Restrict ON UPDATE Restrict
;

SET FOREIGN_KEY_CHECKS=1
; 
