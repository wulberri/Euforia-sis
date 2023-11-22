


# Creación unidad

insert into Unidad values (1, 'facultad ingeniería');

# horario unidad
INSERT INTO `horario_unidad`
(`dia`,
`hora_inicio`,
`hora_cierre`,
`fk_num_unidad`)
VALUES
(1,'6:0:0','20:0:0',1),
(2,'6:0:0','20:0:0',1),
(3,'6:0:0','20:0:0',1),
(4,'6:0:0','20:0:0',1),
(5,'6:0:0','20:0:0',1),
(6,'6:0:0','18:0:0',1),
(7,'11:0:0','16:0:0',1);
select * from horario_unidad;

#recursos
INSERT INTO `recurso`
(`pk_id_recurso`,
`pk_fk_num_unidad`,
`nombre`,
`descripcion`)
VALUES
(1, 1, 'Auditorio Sabio caldas', 'Auditorio de la sede de ingeniería'),
(2, 1, 'Salon 201', 'Salón de clases'),
(3, 1, 'Salon 202', 'Salón de clases'),
(4, 1, 'Salon 203', 'Salón de clases'),
(5, 1, 'Salon 204', 'Salón de clases'),
(6, 1, 'Salon 205', 'Salón de clases'),
(7, 1, 'Patio 1', 'Patio para actividades deportivas'),
(8, 1, 'Patio 2', 'Patio para actividades deportivas');

# horarios recursos
INSERT INTO `horario_recurso`
(`dia`,
`hora_inicio`,
`hora_cierre`,
`fk_id_recurso`,
`fk_num_unidad`)
VALUES
(1,'8:0:0','16:0:0',1,1), # auditorio
(2,'8:0:0','16:0:0',1,1),
(3,'8:0:0','16:0:0',1,1),
(4,'8:0:0','16:0:0',1,1),
(5,'8:0:0','16:0:0',1,1),
(6,'8:0:0','14:0:0',1,1),
(1,'6:0:0','20:0:0',2,1), # salones
(2,'6:0:0','20:0:0',2,1),
(3,'6:0:0','20:0:0',2,1),
(4,'6:0:0','20:0:0',2,1),
(5,'6:0:0','20:0:0',2,1),
(6,'6:0:0','18:0:0',2,1),
(1,'6:0:0','20:0:0',3,1),
(2,'6:0:0','20:0:0',3,1),
(3,'6:0:0','20:0:0',3,1),
(4,'6:0:0','20:0:0',3,1),
(5,'6:0:0','20:0:0',3,1),
(6,'6:0:0','18:0:0',3,1),
(1,'6:0:0','20:0:0',4,1),
(2,'6:0:0','20:0:0',4,1),
(3,'6:0:0','20:0:0',4,1),
(4,'6:0:0','20:0:0',4,1),
(5,'6:0:0','20:0:0',4,1),
(6,'6:0:0','18:0:0',4,1),
(1,'6:0:0','20:0:0',5,1),
(2,'6:0:0','20:0:0',5,1),
(3,'6:0:0','20:0:0',5,1),
(4,'6:0:0','20:0:0',5,1),
(5,'6:0:0','20:0:0',5,1),
(6,'6:0:0','18:0:0',5,1),
(1,'6:0:0','20:0:0',6,1),
(2,'6:0:0','20:0:0',6,1),
(3,'6:0:0','20:0:0',6,1),
(4,'6:0:0','20:0:0',6,1),
(5,'6:0:0','20:0:0',6,1),
(6,'6:0:0','18:0:0',6,1),
(1,'6:30:0','18:0:0',7,1), # Patios
(2,'6:30:0','18:0:0',7,1),
(3,'6:30:0','18:0:0',7,1),
(4,'6:30:0','18:0:0',7,1),
(5,'6:30:0','18:0:0',7,1),
(6,'6:30:0','18:0:0',7,1),
(1,'6:30:0','18:0:0',8,1),
(2,'6:30:0','18:0:0',8,1),
(3,'6:30:0','18:0:0',8,1),
(4,'6:30:0','18:0:0',8,1),
(5,'6:30:0','18:0:0',8,1),
(6,'6:30:0','18:0:0',8,1);

# Especiualizaciones recursos

INSERT INTO `auditorio`
(`pk_fk_num_unidad`,
`pk_fk_id_recurso`,
`aforo`)
VALUES (1,1,200);
 
 INSERT INTO `aula`
(`pk_fk_num_unidad`,
`pk_fk_id_recurso`,
`cantidad_puestos`,
`material_puestos`)
VALUES
(1, 2, 28, 'acrílico'),
(1, 3, 32, 'plastico'),
(1, 4, 28, 'acrílico'),
(1, 5, 31, 'plastico'),
(1, 6, 26, 'madera');

INSERT INTO `patio`
(`pk_fk_num_unidad`,
`pk_fk_id_recurso`,
`tipo_patio`)
VALUES
(1,7,'abierto'),
(1,8,'cerrado');

-- select * from recurso, patio where recurso.pk_id_recurso = patio.pk_fk_id_recurso;

# Usuario administrador
INSERT INTO `usuario` (`nombre`, `correo`, `contrasena`, `rol`) VALUES ('Euforia', 'euforia@gmail.com', '$2b$10$I4lhkUSxkpeChTx1npZmgey36.ui8ie/6y3p6xk.twDI5WKkTUIUC', 'Administrador')

