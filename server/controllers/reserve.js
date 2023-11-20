import { pool } from "../database/db.js";
import { compareHours, formatDate } from "./date.utils.js";

export const prueba = (req, res) => {
  return res.status(200).json("hola");
};

export const reserveResource = async (req, res) => {
  try {
    let { resourceId, unitNum, horaInicio, horaFin } = req.body;
    if (resourceId && unitNum && horaInicio && horaFin) {
      horaInicio = new Date(horaInicio);
      horaFin = new Date(horaFin);
      resourceId = parseInt(resourceId);
      unitNum = parseInt(unitNum);
      let fields = [resourceId, unitNum, horaInicio, horaFin];
      let invalidFields = ['resourceId', 'unitNum', 'horaInicio', 'horaFin'].filter((e, i) => isNaN(fields[i]))
      if (invalidFields.length != 0) {
        return res.status(400).json({ error: invalidFields.join(', ') + ' invalido' + (invalidFields.length != 1 ? 's' : '') })
      }

      let reserveDay = new Date(horaInicio.toDateString());
      if (reserveDay.getTime() != new Date(horaFin.toDateString()).getTime()) {
        return res.status(400).json({ error: 'El inicio y fin de la reserva deben ser en el mismo día' })
      }

      let weekday = horaInicio.getDay() == 0 ? 7 : horaInicio.getDay()

      let [schedules] = await pool.query(
        `SELECT * FROM horario_recurso WHERE fk_id_recurso = ? AND fk_num_unidad = ? AND dia = ?`,
        [resourceId, unitNum, weekday,]
      )

      // conjunto de errores {inicio, fin} vs disponibilidad
      if (schedules.length == 0) {
        return res.status(403).json({ error: 'El recurso no tiene servicio en el horario seleccionado' })
      }

      let validInterval = false;
      for (let schedule of schedules) {
        let inicio = compareHours(schedule.hora_inicio, horaInicio.getHours() + ':' + horaInicio.getMinutes());
        let fin = compareHours(schedule.hora_cierre, horaFin.getHours() + ':' + horaFin.getMinutes());
        if (inicio <= 0 && fin >= 0) {
          validInterval = true;
        }
      }

      if (!validInterval) {
        return res.status(403).json({ error: 'El recurso no tiene servicio en el horario seleccionado' })
      }

      const connection = await pool.getConnection();
      try {
        // await connection.beginTransaction(); // Inicia la transacción
        await connection.query('LOCK TABLES reserva WRITE')
        let formatInicio = formatDate(horaInicio),
          formatFin = formatDate(horaFin);
        let [conflictReserves] = await connection.query(
          `SELECT * FROM reserva WHERE
          (reserva.fk_num_unidad = ? AND reserva.fk_id_recurso = ?) AND
          NOT ((fecha_inicio_reserva <= ? AND fecha_fin_reserva <= ?) OR (fecha_inicio_reserva >= ? AND fecha_fin_reserva >= ?))`,
          [unitNum, resourceId, formatInicio, formatInicio, formatFin, formatFin]
        )

        if (conflictReserves.length > 0) {
          await connection.query('UNLOCK TABLES')
          return res.status(403).json({ error: 'El recurso no tiene disponibilidad en el horario seleccionado' })
        }
        let result = await connection.query(
          `INSERT INTO reserva (fecha_de_reserva, fecha_inicio_reserva, fecha_fin_reserva, 
          fk_num_unidad, fk_id_recurso, fk_id_usuario) VALUES (?, ?, ?, ?, ?, ?)`,
          [formatDate(reserveDay, true), formatDate(horaInicio), formatDate(horaFin), unitNum, resourceId, req.user.id_usuario]
        )

        await connection.query('UNLOCK TABLES')
        // await connection.commit(); // Confirma la transacción
      } catch (error) {
        await connection.rollback(); // Revierte la transacción en caso de error
        await connection.query('UNLOCK TABLES')
        throw error; // Relanza el error para manejarlo en el contexto superior
      } finally {
        connection.release(); // Devuelve la conexión al pool
      }

      return res.status(200).json({ message: 'Reserva realizada con exito' });
    }
    else {
      return res.status(400).json({ error: 'Faltan campos en la consulta' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const activeReserves = async (req, res) => {
  let { reserveOwnerMail } = req.body;
  try {
    let [reserves] = await pool.query(
      `SELECT reserva.id_reserva, reserva.fecha_inicio_reserva, reserva.fecha_fin_reserva, recurso.*, usuario.correo FROM reserva
      INNER JOIN usuario ON reserva.fk_id_usuario = usuario.id_usuario
      INNER JOIN recurso ON recurso.pk_id_recurso = reserva.fk_id_recurso
      LEFT JOIN prestamo ON prestamo.fk_id_reserva = reserva.id_reserva
      WHERE usuario.correo = ? AND prestamo.fk_id_reserva is NULL;`,
      [reserveOwnerMail]
    )
    if (reserves.length > 0) {
      return res.status(200).json(reserves.map(e => {
        return {
          reserveID: e.id_reserva,
          leanStartDate: e.f_fecha_inicio,
          reserveEndDate: e.fecha_fin_reserva,
          resourceName: e.nombre,
          resourceDescp: e.descripcion,
        }
      }));
    }
    else {
      return res.status(200).json({ message: 'No hay reservas activas para ese usuario' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export const historyReserves = async (req, res) => {
  let { id_usuario } = req.user;
  try {
    let [reserves] = await pool.query(
      `SELECT reserva.id_reserva, reserva.fecha_inicio_reserva, reserva.fecha_fin_reserva, recurso.*,
      CASE 
        WHEN prestamo.fk_id_reserva IS NULL THEN 'En espera'
        WHEN prestamo.fk_id_admin_devolucion IS NULL THEN 'Activa'
        ELSE 'Terminada'
      END AS activa
      FROM reserva
      INNER JOIN usuario ON reserva.fk_id_usuario = usuario.id_usuario
      INNER JOIN recurso ON recurso.pk_id_recurso = reserva.fk_id_recurso
      LEFT JOIN prestamo ON prestamo.fk_id_reserva = reserva.id_reserva
      WHERE usuario.id_usuario = ?;`,
      [id_usuario]
    )
    if (reserves.length > 0) {
      return res.status(200).json(reserves.map(e => {
        return {
          reserveID: e.id_reserva,
          reserveStartDate: e.fecha_inicio_reserva,
          reserveEndDate: e.fecha_fin_reserva,
          resourceName: e.nombre,
          resourceDescp: e.descripcion,
          state: e.activa
        }
      }));
    }
    else {
      return res.status(200).json({ message: 'No hay reservas activas para ese usuario' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}