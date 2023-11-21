import "./formreserve.css"
import React from 'react';
import {useState} from "react";
import { doReserve } from "../api/reservas.api.js";
import { useContextUser } from "../context/UserContext.jsx";

const FormReserve = ({ data, onClose }) => {
  const date = new Date();
  const actualDate = date.toISOString().substring(0,10); 
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartHour, setSelectedStartHour] = useState('');
  const [selectedEndHour, setSelectedEndtHour] = useState('');
  const [horaInicial, setHoraInicial] = useState('');
  const [horaFinal, setHoraFinal] = useState('');
  const [horasHabilitadas, setHorasHabilitadas] = useState(false);
  const [repsHabilitada, setRepsHabilitada] = useState(false);
  const [repsNumber, setRepsNumber] = useState(1);
  const [responses, setResponses] = useState([])

  const {getAccessToken} = useContextUser();

  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value.replaceAll('-', '/'));
    const selectedDay = selectedDate.getDay();
    let schedule = null;
    setHorasHabilitadas(true);
    // 6 = domingo, 0 = lunes, 1 = martes, ..., 5 = sábado
    setSelectedDate(selectedDate);
    
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

  const handleStartDateChange = (event) => {
    setSelectedStartHour(event.target.value)
  }

  const handleEndDateChange = (event) => {
    setSelectedEndtHour(event.target.value)
  }

  const handleSubmit = async (event) =>{
    event.preventDefault();
    let promises = [];

    let reserveDate = new Date(selectedDate);
    let startHour = selectedStartHour.split(':');
    let endHour = selectedEndHour.split(':');
    let reps = repsNumber;
    if(!repsHabilitada) {
      reps = 1;
    }
    for(let i=1; i<= reps; i++){
      let selectedStartDate = new Date(reserveDate);
      let selectedEndDate = new Date(reserveDate);
      selectedStartDate.setHours(...startHour);
      selectedEndDate.setHours(...endHour);
      promises.push([new Date(reserveDate), doReserve({
        "unitNum": data.unidNumber,
        "resourceId": data.id,
        "horaInicio": selectedStartDate,
        "horaFin": selectedEndDate
      }, getAccessToken())])
      reserveDate.setDate(reserveDate.getDate()+7)
    }
    let response = []
    for(let [_, promise] of promises){
      try{
        response.push([_, await promise, false]);
      }
      catch(e) {
        response.push([_, e.response.data, true])
      }
    }
    setResponses(response)
    console.log(response)
  }

  return (
    <div className="fat_form">
      <form className="formRe" onSubmit={handleSubmit}>
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
            <input className="normal" type="number" min="1" onChange={(event)=>setRepsNumber(parseInt(event.target.value))} required/>
          </label>
        )}
        {horasHabilitadas && (
          <div>
            <label>
              Hora Inicial:
              <input className="normal" type="time" min={horaInicial} max={horaFinal} onChange={handleStartDateChange} required/>
            </label>
            <label>
              Hora Final:
              <input className="normal" type="time" min={horaInicial} max={horaFinal} onChange={handleEndDateChange} required/>
            </label>
          </div>
        )}
        <div className="fat_btn">
          <button className="button" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="button" type="submit">
            Reservar
          </button>
        </div>
      <div>
          <ul>
            {responses.map(([date, response, error], index) => (
              <li className={error ? 'response-error' : ''} key={index}>{date.toDateString()} {response.message || response.error}</li>
            ))}
        </ul>
      </div>
      </form>
    </div>
  );
};

export default FormReserve;
