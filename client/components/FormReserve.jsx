import "./formreserve.css"
import React from 'react';
import {useState} from "react";

const FormReserve = ({ data, onClose }) => {
  const date = new Date();
  const actualDate = date.toISOString().substring(0,10); 
  const [selectedDate, setSelectedDate] = useState('');
  const [horaInicial, setHoraInicial] = useState('');
  const [horaFinal, setHoraFinal] = useState('');
  const [horasHabilitadas, setHorasHabilitadas] = useState(false);
  const [repsHabilitada, setRepsHabilitada] = useState(false);

  const handleDateChange = (event) => {
    const selectedDay = new Date(event.target.value).getDay();
    let schedule = null;
    setHorasHabilitadas(true);
    // 6 = domingo, 0 = lunes, 1 = martes, ..., 5 = sábado
    setSelectedDate(selectedDay);
    
    if (selectedDay === 0 ){
        schedule = data.schedule.Lunes;
    }else if(selectedDay === 1){
        schedule = data.schedule.Martes;
    }else if(selectedDay === 2){
        schedule = data.schedule.Miércoles;
    } else if(selectedDay === 3){
        schedule = data.schedule.Jueves;
    }else if(selectedDay === 4){
        schedule = data.schedule.Viernes;
    }else if(selectedDay === 5){
        schedule = data.schedule.Sábado;
    }

    setHoraInicial(schedule.start)
    setHoraFinal(schedule.end)
  };

  return (
    <form>
      <label>
        Unidad:
        <input className="normal" type="number" value={data.unidNumber} readOnly />
      </label>
      <label>
        Nombre:
        <input className="normal" type="text" value={data.name} readOnly />
      </label>
      {data.type === 'auditorium' ? (
        <label>
            Aforo:
            <input className="normal" type="number" value={data.aforo} readOnly />
        </label>
      ): data.type === 'classroom' ? (
        <>
            <label>
                Material de Silla:
                <input className="normal" type="text" value={data.chairMaterial} readOnly />
            </label>
            <label>
                Cantidad de Sillas:
                <input className="normal" type="number" value={data.chairAmount} readOnly />
            </label>
        </>
      ):(
        <label>
            Estilo:
            <input className="normal" type="text" value={data.yardType} readOnly />
        </label>
      )}
      <label className="textarea">
        Descripción:
        <textarea value={data.description} readOnly />
      </label>
      <div className="box">
        <label>
          Día:
          <input className="normal" type="date" min={actualDate} onChange={handleDateChange} required/>
        </label>
        <label>
          Repetitivo:
          <input className="normal" type="checkbox" checked={repsHabilitada} onChange={()=>setRepsHabilitada(!repsHabilitada)} />
        </label>
      </div>
      {repsHabilitada && (
        <label>
          ¿Cuántos días desea reservar?:
          <input className="normal" type="number" min="1" required/>
        </label>
      )}
      {horasHabilitadas && (
        <div>
          <label>
            Hora Inicial:
            <input className="normal" type="time" min={horaInicial} max={horaFinal}  required/>
          </label>
          <label>
            Hora Final:
            <input className="normal" type="time" min={horaInicial} max={horaFinal}  required/>
          </label>
        </div>
      )}
      <div className="fat_btn">
        <button className="button" type="button" onClick={onClose}>
          Cancelar
        </button>
        {/*AGREGAR POST PARA RESERVAR*/}
        <button className="button" type="submit">
          Reservar
        </button>
      </div>
    </form>
  );
};

export default FormReserve;
