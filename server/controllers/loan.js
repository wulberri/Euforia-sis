import { pool } from "../database/db.js";
import { compareHours, formatDate } from "./date.utils.js";

export const startLoan = async (req, res) =>  {

    // Verificar:
    /*
    * [x]La reserva exista
    * La hora debe variar 5 minutos de la hora reservada
    * Veriricar que la reserva coincida con el usuario que reservó
    */ 
    try {
        let {reserveID, reserveOwnerMail} = req.body;

        let [reserva] = await pool.query("SELECT * from reserva WHERE id_reserva = ?", [reserveID]);
        if(reserva.length != 1){
            throw({message: 'La reserva no existe'})
        }
        else {
            reserva = reserva[0]
        }
        let [user] = await pool.query("SELECT * from usuario WHERE correo = ?", [reserveOwnerMail]);
        if(user.length != 1){
            throw({message: 'El usuario prestatario no existe'})
        }
        else {
            user = user[0]
        }
        if(reserva.fk_id_usuario != user.id_usuario ){
            throw({message: 'El correo ingresado no coincide con el dueño de la reserva'})
        }


        await pool.query("INSERT INTO prestamo (fk_id_reserva, f_fecha_inicio, fk_id_admin_entrega) VALUES (?, ?, ?)",
            [reserveID, formatDate(new Date()), req.user.id_usuario]);
        return res.status(200).json({ message: 'Prestamo iniciado con exito' });
        
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const endLoan = async (req, res) =>  {

    // Verificar:
    /*
    * El presmo existe (ha sido iniciado)
    * La hora debe variar 5 minutos de la hora reservada, sino un fallo
    * Veriricar que el prestamo coincida con el usuario que lo recibió
    */ 
    try {
        let {reserveID} = req.body;
        await pool.query(
            `UPDATE prestamo SET f_fecha_entrega = ?, fk_id_admin_devolucion = ? 
            WHERE prestamo.fk_id_reserva = ?`,
            [formatDate(new Date()), req.user.id_usuario, reserveID]);
        return res.status(200).json({ message: 'Prestamo finalizado con exito' });
        
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}