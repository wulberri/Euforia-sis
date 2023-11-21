import "./formreserve.css"
import React from 'react';
import {useState} from "react";
import { useContextUser } from "../context/UserContext.jsx";

const FormReserve = ({onClose, unitSchedule}) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedStartHour, setSelectedStartHour] = useState('');
  const [selectedEndHour, setSelectedEndtHour] = useState('');
  const [horaInicial, setHoraInicial] = useState('');
  const [horaFinal, setHoraFinal] = useState('');

  const {getAccessToken} = useContextUser();

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async (event) =>{
   /*LOGICA SUBMIT*/ 
  }

  return (
    <div className="fat_form">
      <form className="formRe" onSubmit={handleSubmit}>
        <label>
          ¿Qué tipo de recurso desea crear?:
          <select className="normal" value={selectedOption} onChange={handleSelectChange}>
            <option value="">Selecciona...</option>
            <option value="auditorium">Auditorio</option>
            <option value="classroom">Salón</option>
            <option value="yard">Patio</option>
          </select>
        </label> 
        {selectedOption !== '' && (
        <>
        <label>
          Unidad:
          <input className="normal" type="number" defaultValue="1" readOnly />
        </label>
        <label>
          Nombre:
          <input className="normal" type="text" />
        </label>
        {selectedOption === 'auditorium' ? (
          <label>
              Aforo:
              <input className="normal" type="number" />
          </label>
        ): selectedOption === 'classroom' ? (
          <>
              <label>
                  Material de Silla:
                  <input className="normal" type="text" />
              </label>
              <label>
                  Cantidad de Sillas:
                  <input className="normal" type="number" min="1" />
              </label>
          </>
        ): selectedOption === 'yard' ? (
          <label>
              Estilo:
              <input className="normal" type="text" />
          </label>
        ):""}
        <label className="textarea">
          Descripción:
          <textarea />
        </label>

        <div className="schedule">
          <p className="schTitle">Horarios:</p>
          <div className="par">
            <label>
              Lunes:
              <input className="normal" type="time" min={unitSchedule['Lunes'].start} max={unitSchedule['Lunes'].end} onChange="" />
              <input className="normal" type="time" min={unitSchedule['Lunes'].start} max={unitSchedule['Lunes'].end} onChange="" />
            </label>
            <label>
              Martes:
              <input className="normal" type="time" min={unitSchedule['Martes'].start} max={unitSchedule['Martes'].end} onChange="" />
              <input className="normal" type="time" min={unitSchedule['Martes'].start} max={unitSchedule['Martes'].end} onChange="" />
            </label>
          </div>
          <div className="par">
            <label>
              Miércoles:
              <input className="normal" type="time" min={unitSchedule['Miércoles'].start} max={unitSchedule['Miércoles'].end} onChange="" />
              <input className="normal" type="time" min={unitSchedule['Miércoles'].start} max={unitSchedule['Miércoles'].end} onChange="" />
            </label>
            <label>
              Jueves:
              <input className="normal" type="time" min={unitSchedule['Jueves'].start} max={unitSchedule['Jueves'].end} onChange="" />
              <input className="normal" type="time" min={unitSchedule['Jueves'].start} max={unitSchedule['Jueves'].end} onChange="" />
            </label>
          </div>
          <div className="par">
            <label>
              Viernes:
              <input className="normal" type="time" min={unitSchedule['Viernes'].start} max={unitSchedule['Viernes'].end} onChange="" />
              <input className="normal" type="time" min={unitSchedule['Viernes'].start} max={unitSchedule['Viernes'].end} onChange="" />
            </label>
            <label>
              Sábado:
              <input className="normal" type="time" min={unitSchedule['Sábado'].start} max={unitSchedule['Sábado'].end} onChange="" />
              <input className="normal" type="time" min={unitSchedule['Sábado'].start} max={unitSchedule['Sábado'].end} onChange="" />
            </label>
          </div>
        </div>
        </>
        )}

        <div className="fat_btn">
          <button className="button" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="button" type="submit">
            Crear
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormReserve;
