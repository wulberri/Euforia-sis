import { pool } from "../database/db.js";

export async function allResources(req, res) {
  let [resources] = await pool.query(
    `SELECT
    recurso.*, auditorio.aforo, aula.cantidad_puestos, aula.material_puestos, patio.tipo_patio,
    horario_recurso.dia, horario_recurso.hora_inicio, horario_recurso.hora_cierre
    from recurso 
    LEFT JOIN auditorio ON recurso.pk_id_recurso = auditorio.pk_fk_id_recurso 
      AND recurso.pk_fk_num_unidad = auditorio.pk_fk_num_unidad 
    LEFT JOIN aula ON recurso.pk_id_recurso = aula.pk_fk_id_recurso 
      AND recurso.pk_fk_num_unidad = aula.pk_fk_num_unidad 
    LEFT JOIN patio ON recurso.pk_id_recurso = patio.pk_fk_id_recurso 
      AND recurso.pk_fk_num_unidad = patio.pk_fk_num_unidad
    INNER JOIN horario_recurso ON horario_recurso.fk_num_unidad = recurso.pk_fk_num_unidad
    AND horario_recurso.fk_id_recurso = recurso.pk_id_recurso;`
  );

  const weekDays = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  let simplifiedResources = [];
  resources = resources.map((resource) => {
    let lastResource = simplifiedResources[simplifiedResources.length - 1];
    let scheduleKey = weekDays[resource.dia - 1];
    if (
      simplifiedResources.length == 0 ||
      lastResource.id != resource.pk_id_recurso
    ) {
      let simplified = {
        id: resource.pk_id_recurso,
        unidNumber: resource.pk_fk_num_unidad,
        name: resource.nombre,
        description: resource.descripcion,
      };
      if (resource.aforo) {
        simplified.type = "auditorium";
        simplified.aforo = resource.aforo;
      } else if (resource.material_puestos) {
        simplified.type = "classroom";
        simplified.chairMaterial = resource.material_puestos;
        simplified.chairAmount = resource.cantidad_puestos;
      } else {
        simplified.type = "yard";
        simplified.yardType = resource.tipo_patio;
      }
      simplified.schedule = {};
      lastResource = simplified;
      simplifiedResources.push(simplified);
    }
    lastResource.schedule[scheduleKey] = {
      start: resource.hora_inicio,
      end: resource.hora_cierre,
    };
  });
  return res.status(200).json(simplifiedResources);
}

export const getUnitSchedule = async (req, res) => {
  const { unitNumber } = req.params;

  const weekDays = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  try {
    let [queryResult] = await pool.query(
      `SELECT * FROM horario_unidad LEFt JOIN unidad on horario_unidad.fk_num_unidad = unidad.num_unidad
      WHERE fk_num_unidad = ?`,
      [unitNumber]
    );
    if (queryResult.length == 0) {
      return res
        .status(500)
        .json({ error: "No hay un horario para la unidad" });
    }
    let schedules = {};
    for (let schedule of queryResult) {
      let day = weekDays[schedule.dia - 1];
      let horary = {
        start: schedule.hora_inicio,
        end: schedule.hora_cierre,
      };
      schedules[day] = horary;
    }
    return res.status(200).json({
      unidNumber: unitNumber,
      name: queryResult[0].nombre,
      schedule: schedules,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export async function getResourceExpanded(req, res) {
  const id = req.params.id;
  let [resource] = await pool.query(
    `SELECT
    recurso.*, auditorio.aforo, aula.cantidad_puestos, aula.material_puestos, patio.tipo_patio,
    horario_recurso.dia, horario_recurso.hora_inicio, horario_recurso.hora_cierre
    from recurso 
    LEFT JOIN auditorio ON recurso.pk_id_recurso = auditorio.pk_fk_id_recurso 
      AND recurso.pk_fk_num_unidad = auditorio.pk_fk_num_unidad 
    LEFT JOIN aula ON recurso.pk_id_recurso = aula.pk_fk_id_recurso 
      AND recurso.pk_fk_num_unidad = aula.pk_fk_num_unidad 
    LEFT JOIN patio ON recurso.pk_id_recurso = patio.pk_fk_id_recurso 
      AND recurso.pk_fk_num_unidad = patio.pk_fk_num_unidad
    INNER JOIN horario_recurso ON horario_recurso.fk_num_unidad = recurso.pk_fk_num_unidad
    AND horario_recurso.fk_id_recurso = recurso.pk_id_recurso 
    WHERE recurso.pk_id_recurso = (?);`,
    [id]
  );
  const weekDays = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo",
  ];
  let simplifiedResources = [];
  resource = resource.map((resource) => {
    let lastResource = simplifiedResources[simplifiedResources.length - 1];
    let horarioKey = weekDays[resource.dia - 1];
    if (
      simplifiedResources.length == 0 ||
      lastResource.id != resource.pk_id_recurso
    ) {
      let simplified = {
        id: resource.pk_id_recurso,
        unidad: resource.pk_fk_num_unidad,
        nombre: resource.nombre,
        descripcion: resource.descripcion,
      };
      if (resource.aforo) {
        simplified.tipo = "auditorio";
        simplified.aforo = resource.aforo;
      } else if (resource.material_puestos) {
        simplified.tipo = "aula";
        simplified.material_puestos = resource.material_puestos;
        simplified.cantidad_puestos = resource.cantidad_puestos;
      } else {
        simplified.tipo = "patio";
        simplified.tipo_patio = resource.tipo_patio;
      }
      simplified.horario = {};
      lastResource = simplified;
      simplifiedResources.push(simplified);
    }
    lastResource.horario[horarioKey] = {
      hora_inicio: resource.hora_inicio,
      hora_cierre: resource.hora_cierre,
    };
  });
  return res.status(200).json(simplifiedResources);
}

export const getResource = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM recurso WHERE pk_id_recurso = ?",
      req.params.id
    );
    //Se comprueba que la lista realmente traiga una recurso
    if (result.length === 0)
      return res.status(404).json({ mensaje: "Recurso no encontrado" });
    res.json(result[0]); //Solo retorna la posicion 0, ya que es 'result' es una lista
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};

export const getResources = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM recurso");
    res.json(result);
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM recurso WHERE pk_id_recurso = ?",
      [req.params.id]
    );
    //Se comprueba si no afecto a ninguna de las filas de la base de datos
    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: "Recurso no encontrado" });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};

const diaAnum = (diaSemana) => {
  const diasSemana = {
    Lunes: 1,
    Martes: 2,
    Miercoles: 3,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
    Sabado: 6,
    Domingo: 7,
  };

  return diasSemana[diaSemana];
};

const validarFechas = async (horario) => {
  //Iterador para el manejo del horario
  for (let diaSemana in horario) {
    if (horario.hasOwnProperty(diaSemana)) {
      const horaInicioStr = horario[diaSemana].hora_inicio;
      const horaCierreStr = horario[diaSemana].hora_cierre;

      // Creamos objetos Date con la misma fecha base para comparar solo las horas
      const baseDate = new Date("2023-11-22");
      const horaInicioDate = new Date(
        `${baseDate.toDateString()} ${horaInicioStr}`
      );
      const horaCierreDate = new Date(
        `${baseDate.toDateString()} ${horaCierreStr}`
      );

      const numberDay = diaAnum(diaSemana);
      const [fecha] = await pool.query(
        "SELECT hora_inicio, hora_cierre FROM horario_unidad WHERE fk_num_unidad = 1 AND dia = (?)",
        [numberDay]
      );

      if (fecha[0]) {
        // Creamos objetos Date con la misma fecha base para comparar solo las horas
        const baseDate = new Date("2023-11-22");
        const horaInicioDateUnid = new Date(
          `${baseDate.toDateString()} ${fecha[0].hora_inicio}`
        );
        const horaCierreDateUnid = new Date(
          `${baseDate.toDateString()} ${fecha[0].hora_cierre}`
        );

        if (
          horaInicioDate <= horaInicioDateUnid ||
          horaCierreDate >= horaCierreDateUnid
        ) {
          return "Horas establecidas fuera de rango en base a la unidad";
        }
      } else {
        return "Unidad o día invalidos";
      }

      // Función para validar una cadena de hora
      const validarHora = (horaStr) => {
        const [horas, minutos, segundos] = horaStr.split(":").map(Number);
        return (
          horas >= 0 &&
          horas < 24 &&
          minutos >= 0 &&
          minutos < 60 &&
          segundos >= 0 &&
          segundos < 60
        );
      };

      // Verificamos si las horas son válidas
      if (!validarHora(horaInicioStr) || !validarHora(horaCierreStr)) {
        return "Hora no válida";
      }

      //Valida que la hora de inicio no sea mayor que la de cierre
      if (horaInicioDate >= horaCierreDate) {
        return "Horas invalidas";
      }

      //Calculamos la diferencia en milisegundos
      const diferenciaMilisegundos = horaCierreDate - horaInicioDate;
      const diferenciaHoras = diferenciaMilisegundos / (1000 * 60 * 60); //Convertimos la diferencia a horas

      //Verificamos si la diferencia es menor a 1 hora
      if (diferenciaHoras < 1) {
        return "La diferencia entre horas debe ser de al menos 1 hora";
      }
    }
  }
};

export const createResource = async (req, res) => {
  try {
    const { nombre, descripcion, tipo, horario } = req.body;

    if (tipo !== "auditorio" && tipo !== "patio" && tipo !== "aula") {
      return res.status(400).json({ message: "Tipo de recurso no encontrado" });
    }

    const resFecha = await validarFechas(horario);
    if (resFecha) {
      return res.status(400).json({ message: resFecha });
    }

    const [recurso] = await pool.query(
      "INSERT INTO recurso (nombre, pk_fk_num_unidad, descripcion) VALUES (?, 1, ?)",
      [nombre, descripcion]
    );

    //result.insertId obtenemos el id que se ingreso a la base de datos
    const pk_id_recurso = recurso.insertId;

    if (tipo == "auditorio") {
      const { aforo } = req.body;
      await pool.query(
        "INSERT INTO auditorio (pk_fk_num_unidad, pk_fk_id_recurso, aforo) VALUES (1, ?, ?)",
        [pk_id_recurso, aforo]
      );
    }
    if (tipo == "aula") {
      let { cantidad_puestos, material_puestos } = req.body;
      if (
        material_puestos != "plastico" &&
        material_puestos != "acrílico" &&
        material_puestos != "madera"
      ) {
        material_puestos = "madera";
      }
      await pool.query(
        "INSERT INTO aula (pk_fk_num_unidad, pk_fk_id_recurso, cantidad_puestos, material_puestos) VALUES (1, ?, ?, ?)",
        [pk_id_recurso, cantidad_puestos, material_puestos]
      );
    }
    if (tipo == "patio") {
      let { tipo_patio } = req.body;
      if (tipo_patio != "abierto" && tipo_patio != "cerrado") {
        tipo_patio = "cerrado";
      }
      await pool.query(
        "INSERT INTO patio (pk_fk_num_unidad, pk_fk_id_recurso, tipo_patio) VALUES (1, ?, ?)",
        [pk_id_recurso, tipo_patio]
      );
    }

    //Insertar el horario
    for (let diaSemana in horario) {
      if (horario.hasOwnProperty(diaSemana)) {
        const horaInicioStr = horario[diaSemana].hora_inicio;
        const horaCierreStr = horario[diaSemana].hora_cierre;

        // Creamos objetos Date con la misma fecha base para comparar solo las horas
        const baseDate = new Date("2023-11-22");
        const horaInicioDate = new Date(
          `${baseDate.toDateString()} ${horaInicioStr}`
        );
        const horaCierreDate = new Date(
          `${baseDate.toDateString()} ${horaCierreStr}`
        );

        await pool.query(
          "INSERT INTO horario_recurso (dia, hora_inicio, hora_cierre, fk_id_recurso, fk_num_unidad) VALUES (?, ?, ?, ?, 1)",
          [diaAnum(diaSemana), horaInicioDate, horaCierreDate, pk_id_recurso]
        );
      }
    }

    res.json({
      // pk_id_recurso,
      nombre,
      descripcion,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateResource = async (req, res) => {
  try {
    const { nombre, descripcion, tipo, horario } = req.body;
    const id = req.params.id;

    if (tipo !== "auditorio" && tipo !== "patio" && tipo !== "aula") {
      return res.status(400).json({ message: "Tipo de recurso no encontrado" });
    }

    //Validar fechas
    const resFecha = await validarFechas(horario);
    if (resFecha) {
      return res.status(400).json({ message: resFecha });
    }

    //Validar que el id que se envie sea concorde al tipo de recurso
    const [tipo_res] = await pool.query(
      `SELECT * FROM ${tipo} WHERE pk_fk_id_recurso = (?)`,
      [id]
    );
    if (!tipo_res[0]) {
      return res
        .status(400)
        .json({ message: "Id no corresponde al tipo de recurso" });
    }

    // Actualiza el recurso
    await pool.query(
      "UPDATE recurso SET nombre = (?), descripcion = (?) WHERE pk_id_recurso = ?",
      [nombre, descripcion, id]
    );

    //Actualiza segun el tipo de recurso
    if (tipo == "auditorio") {
      const { aforo } = req.body;
      await pool.query(
        "UPDATE auditorio SET aforo = (?) WHERE pk_fk_id_recurso = (?);",
        [aforo, id]
      );
    }
    if (tipo == "aula") {
      let { cantidad_puestos, material_puestos } = req.body;
      //Si se envia un tipo de dato raro se crea como cerrado por defecto
      //Sin embargo en la bd ya esta validado que sea alguno de los tres:
      if (
        material_puestos != "plastico" &&
        material_puestos != "acrílico" &&
        material_puestos != "madera"
      ) {
        material_puestos = "madera";
      }
      await pool.query(
        "UPDATE aula SET cantidad_puestos = (?), material_puestos = (?) WHERE pk_fk_id_recurso = (?);",
        [cantidad_puestos, material_puestos, id]
      );
    }
    if (tipo == "patio") {
      let { tipo_patio } = req.body;
      //Si se envia un tipo de dato raro se crea como cerrado por defecto
      //Sin embargo en la bd ya esta validado que sea alguno de los dos:
      if (tipo_patio != "abierto" && tipo_patio != "cerrado") {
        tipo_patio = "cerrado";
      }
      await pool.query(
        "UPDATE patio SET tipo_patio = (?) WHERE pk_fk_id_recurso = (?);",
        [tipo_patio, id]
      );
    }

    //Actualizar los horarios
    for (let diaSemana in horario) {
      if (horario.hasOwnProperty(diaSemana)) {
        const horaInicioStr = horario[diaSemana].hora_inicio;
        const horaCierreStr = horario[diaSemana].hora_cierre;

        // Creamos objetos Date con la misma fecha base para comparar solo las horas
        const baseDate = new Date("2023-11-22");
        const horaInicioDate = new Date(
          `${baseDate.toDateString()} ${horaInicioStr}`
        );
        const horaCierreDate = new Date(
          `${baseDate.toDateString()} ${horaCierreStr}`
        );

        await pool.query(
          "UPDATE horario_recurso SET hora_inicio = (?), hora_cierre = (?) WHERE fk_id_recurso = (?) AND fk_num_unidad = 1 AND dia = (?)",
          [horaInicioDate, horaCierreDate, id, diaAnum(diaSemana)]
        );
      }
    }

    res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};
