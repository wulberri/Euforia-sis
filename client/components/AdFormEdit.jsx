import "./formreserve.css"
import React from 'react';
import {useState} from "react";
import { useContextUser } from "../context/UserContext.jsx";

const FormReserve = ({ data, onClose }) => {
  const [selectedStartHour, setSelectedStartHour] = useState('');
  const [selectedEndHour, setSelectedEndtHour] = useState('');
  const [horaInicial, setHoraInicial] = useState('');
  const [horaFinal, setHoraFinal] = useState('');

  const {getAccessToken} = useContextUser();


  const handleSubmit = async (event) =>{
   /*LOGICA SUBMIT*/ 
  }

  return (
    <div className="fat_form">
      <form className="formRe" onSubmit={handleSubmit}>
        <label>
          Unidad:
          <input className="normal" type="number" min="1" defaultValue="1" readOnly/>
        </label>
        <label>
          Nombre:
          <input className="normal" type="text" defaultValue={data.name} />
        </label>
        {data.type === 'auditorium' ? (
          <label>
              Aforo:
              <input className="normal" type="number" defaultValue={data.aforo} />
          </label>
        ): data.type === 'classroom' ? (
          <>
              <label>
                  Material de Silla:
                  <input className="normal" type="text" defaultValue={data.chairMaterial} />
              </label>
              <label>
                  Cantidad de Sillas:
                  <input className="normal" type="number" min="1" defaultValue={data.chairAmount} />
              </label>
          </>
        ):(
          <label>
              Estilo:
              <input className="normal" type="text" defaultValue={data.yardType} />
          </label>
        )}
        <label className="textarea">
          Descripción:
          <textarea defaultValue={data.description} />
        </label>

        <div className="schedule">
          <p className="schTitle">Horarios:</p>
          <div className="par">
            <label>
              Lunes:
              <input className="normal" type="time" min="8:00:00" max="20:00:00" defaultValue={data.schedule.Lunes.start} onChange="" />
              <input className="normal" type="time" min="8:00:00" max="20:00:00" defaultValue={data.schedule.Lunes.end} onChange="" />
            </label>
            <label>
              Martes:
              <input className="normal" type="time" min="8:00:00" max="20:00:00" defaultValue={data.schedule.Martes.start} onChange="" />
              <input className="normal" type="time" min="8:00:00" max="20:00:00" defaultValue={data.schedule.Martes.end} onChange="" />
            </label>
          </div>
          <div className="par">
            <label>
              Miércoles:
              <input className="normal" type="time" min="8:00:00" max="20:00:00" defaultValue={data.schedule.Miércoles.start} onChange="" />
              <input className="normal" type="time" min="8:00:00" max="20:00:00" defaultValue={data.schedule.Miércoles.end} onChange="" />
            </label>
            <label>
              Jueves:
              <input className="normal" type="time" min="8:00:00" max="20:00:00" defaultValue={data.schedule.Jueves.start} onChange="" />
              <input className="normal" type="time" min="8:00:00" max="20:00:00" defaultValue={data.schedule.Jueves.end} onChange="" />
            </label>
          </div>
          <div className="par">
            <label>
              Viernes:
              <input className="normal" type="time" min="8:00:00" max="20:00:00" defaultValue={data.schedule.Viernes.start} onChange="" />
              <input className="normal" type="time" min="8:00:00" max="20:00:00" defaultValue={data.schedule.Viernes.end} onChange="" />
            </label>
            <label>
              Sábado:
              <input className="normal" type="time" min="8:00:00" max="20:00:00" defaultValue={data.schedule.Sábado.start} onChange="" />
              <input className="normal" type="time" min="8:00:00" max="20:00:00" defaultValue={data.schedule.Sábado.end} onChange="" />
            </label>
          </div>
        </div>

        <div className="fat_btn">
          <button className="button" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="button" type="submit">
            Actualizar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormReserve;
