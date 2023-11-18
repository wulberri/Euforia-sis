import { pool } from "../database/db.js";
import { compareHours, formatDate } from "./date.utils.js";

export const startLoan = async (req, res) =>  {

    try {
        let {reserveID, reserveOwnerMail} = req.body;

        let [reserva] = await pool.query("SELECT * from reserva WHERE id_reserva = ?", [reserveID]);
        if(reserva.length != 1){
            return res.status(400).json({message: 'La reserva no existe'})
        }
        else {
            reserva = reserva[0]
        }
        let [user] = await pool.query("SELECT * from usuario WHERE correo = ?", [reserveOwnerMail]);
        if(user.length != 1){
            return res.status(400).json({message: 'El usuario prestatario no existe'})
        }
        else {
            user = user[0]
        }
        if(reserva.fk_id_usuario != user.id_usuario ){
            return res.status(400).json({message: 'El correo ingresado no coincide con el dueño de la reserva'})
        }
        
        let now = new Date();
        let timeDifference = (now-reserva.fecha_inicio_reserva)/1000/60; //minutes
        
        if(timeDifference < -5){
            return res.status(400).json({message: 'Es muy pronto para inciar el prestamo'})
        }
        else if(timeDifference > 5){
            return res.status(400).json({message: 'Es muy tarde para inciar el prestamo'})
        }

        try{
            await pool.query("INSERT INTO prestamo (fk_id_reserva, f_fecha_inicio, fk_id_admin_entrega) VALUES (?, ?, ?)",
                [reserveID, formatDate(new Date()), req.user.id_usuario]);
        }
        catch(e) {
            if(e.code == 'ER_DUP_ENTRY'){
                return res.status(400).json({message: 'El prestamo ya ha sido iniciado'});
            }
            else {
                throw e;
            }
        }
        return res.status(200).json({ message: 'Prestamo iniciado con exito' });
        
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const endLoan = async (req, res) =>  {

    // Verificar:
    /*
    * [x] El prestamo existe (ha sido iniciado)
    * La hora debe variar 5 minutos de la hora reservada, sino un fallo
    * Veriricar que el prestamo coincida con el usuario que lo recibió
    */ 
    try {
        let {reserveID, reserveOwnerMail} = req.body;

        let [prestamo] = await pool.query("SELECT * from prestamo WHERE fk_id_reserva = ?", [reserveID]);
        if(prestamo.length != 1){
            return res.status(400).json({message: 'El prestamo no existe'})
        }
        else {
            prestamo = prestamo[0]
        }
        if(prestamo.fk_id_admin_devolucion != null){
            return res.status(400).json({message: 'El prestamo ya terminó'})
        }
        let [user] = await pool.query("SELECT * from usuario WHERE correo = ?", [reserveOwnerMail]);
        if(user.length != 1){
            return res.status(400).json({message: 'El usuario prestatario no existe'})
        }
        else {
            user = user[0]
        }
        let [[reserva]] = await pool.query("SELECT * from reserva WHERE id_reserva = ?", [reserveID]);
        if(reserva.fk_id_usuario != user.id_usuario ){
            return res.status(400).json({message: 'El correo ingresado no coincide con el dueño de la reserva'})
        }

        let now = new Date();
        let timeDifference = (now-reserva.fecha_fin_reserva)/1000/60; //minutes
        let [resultQuery] = await pool.query(
            `UPDATE prestamo SET f_fecha_entrega = ?, fk_id_admin_devolucion = ? 
            WHERE prestamo.fk_id_reserva = ?`,
            [formatDate(now), req.user.id_usuario, reserveID]);
        if(resultQuery.affectedRows == 1){
            if(timeDifference > 5){
                return res.status(400).json({message: 'Prestamo terminado con retraso'})
            }
            else{
                return res.status(200).json({ message: 'Prestamo finalizado con exito' });
            }
        }
        else {
            return res.status(200).json({ message: 'Llamen a Dios, esto no deberia pasar' });
        }
        
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}