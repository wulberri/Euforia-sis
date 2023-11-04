CREATE TABLE Unidad (
    id_unidad INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de la unidad',
    nombre VARCHAR(50) NOT NULL COMMENT 'Nombre de la unidad'
) COMMENT = 'Unidades en las que se prestan recursos físicos';

CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador del usuario',
    correo_electronico VARCHAR(100) NOT NULL UNIQUE COMMENT 'Correo electrónico único del usuario',
    nombre VARCHAR(50) NOT NULL COMMENT 'Nombre del usuario',
    contrasena_hash VARCHAR(128) NOT NULL COMMENT 'Hash seguro de la contraseña del usuario (almacenada de forma segura)',
    rol ENUM('usuario', 'administrador') NOT NULL COMMENT 'Rol del usuario (usuario o administrador)'
) COMMENT = 'Información de los usuarios de la aplicación y administradores';

CREATE TABLE Recurso (
    id_recurso INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador del recurso físico',
    nombre VARCHAR(50) NOT NULL COMMENT 'Nombre del recurso físico',
    descripcion VARCHAR(50) NOT NULL COMMENT 'Información que describe el recurso físico',
    tipo_recurso VARCHAR(25) NOT NULL COMMENT 'Tipo del recurso físico',
    fk_numero_unidad INT NOT NULL COMMENT 'Número de la unidad a la que pertenece el recurso',
    CONSTRAINT FK_Recurso_Unidad FOREIGN KEY (fk_numero_unidad) REFERENCES Unidad(id_unidad) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT = 'Recurso físico perteneciente a una unidad';

CREATE TABLE Auditorio (
    id_auditorio INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador del auditorio',
    fk_num_unidad INT NOT NULL COMMENT 'Número de la unidad a la que pertenece el recurso',
    fk_id_recurso INT NOT NULL COMMENT 'Identificación del recurso',
    aforo SMALLINT NOT NULL COMMENT 'Cantidad de personas que pueden ocupar el auditorio',
    CONSTRAINT FK_Auditorio_Unidad FOREIGN KEY (fk_num_unidad) REFERENCES Unidad(id_unidad) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_Auditorio_Recurso FOREIGN KEY (fk_id_recurso) REFERENCES Recurso(id_recurso) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT = 'Tipo de recurso auditorio';

CREATE TABLE Aula (
    id_aula INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador del aula',
    fk_num_unidad INT NOT NULL COMMENT 'Número de la unidad a la que pertenece el recurso',
    fk_id_recurso INT NOT NULL COMMENT 'Identificación del recurso',
    cantidad_puestos SMALLINT NOT NULL COMMENT 'Cantidad de puestos/aforo del aula',
    material_puestos VARCHAR(25) NOT NULL COMMENT 'Nombre del material de los puestos: madera, plástico, etc.',
    CONSTRAINT FK_Aula_Unidad FOREIGN KEY (fk_num_unidad) REFERENCES Unidad(id_unidad) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_Aula_Recurso FOREIGN KEY (fk_id_recurso) REFERENCES Recurso(id_recurso) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT = 'Tipo de recurso aula, lugar en el que se da a clase';

CREATE TABLE Patio (
    id_patio INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador del patio',
    fk_num_unidad INT NOT NULL COMMENT 'Número de la unidad a la que pertenece el recurso',
    fk_id_recurso INT NOT NULL COMMENT 'Identificación del recurso',
    tipo_patio VARCHAR(25) NOT NULL COMMENT 'Define la especialización del patio, por ejemplo, el deporte para el cual se utiliza',
    CONSTRAINT FK_Patio_Unidad FOREIGN KEY (fk_num_unidad) REFERENCES Unidad(id_unidad) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_Patio_Recurso FOREIGN KEY (fk_id_recurso) REFERENCES Recurso(id_recurso) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT = 'Tipo de recurso patio, en el que se hace deporte';

CREATE TABLE Reserva (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de la reserva',
    fecha_reserva DATE NOT NULL COMMENT 'Fecha en la que se realizó la reserva',
    fecha_inicio_reserva DATETIME NOT NULL COMMENT 'Fecha y hora en la que inicia la reserva del recurso físico',
    fecha_fin_reserva DATETIME NOT NULL COMMENT 'Fecha y hora en la que termina la reserva del recurso físico',
    fk_id_usuario INT NULL COMMENT 'Identificador del usuario que realiza la reserva',
    fk_id_recurso INT NULL COMMENT 'Identificador del recurso físico reservado',
    CONSTRAINT FK_Reserva_Usuario FOREIGN KEY (fk_id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_Reserva_Recurso FOREIGN KEY (fk_id_recurso) REFERENCES Recurso(id_recurso) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT = 'Datos del proceso en el que se anticipa el uso de un recurso físico';

CREATE TABLE Prestamo (
    id_prestamo INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador del préstamo',
    fecha_inicio DATETIME NOT NULL COMMENT 'Fecha de inicio del préstamo',
    fecha_entrega DATETIME NOT NULL COMMENT 'Fecha de entrega del préstamo',
    fk_id_reserva INT NOT NULL COMMENT 'Identificador de la reserva asociada',
    fk_id_admin_entrega INT NOT NULL COMMENT 'Identificador del administrador que entregó',
    fk_id_admin_devolucion INT NULL COMMENT 'Identificador del administrador de devolución',
    CONSTRAINT FK_Prestamo_Reserva FOREIGN KEY (fk_id_reserva) REFERENCES Reserva(id_reserva) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_Prestamo_Usuario_Entrega FOREIGN KEY (fk_id_admin_entrega) REFERENCES Usuario(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_Prestamo_Usuario_Devolucion FOREIGN KEY (fk_id_admin_devolucion) REFERENCES Usuario(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT = 'Registro del préstamo de un recurso físico. En el que se entrega el recurso físico a un usuario';