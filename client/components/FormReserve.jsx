import React from 'react';
import {useState} from "react";

const FormReserve = ({ data, onClose }) => {
  const date = new Date();
  const actualDate = date.toISOString().substring(0,10); 
  const [selectedDate, setSelectedDate] = useState('');
  const [horaInicial, setHoraInicial] = useState('');
  const [horaFinal, setHoraFinal] = useState('');
  const [horasHabilitadas, setHorasHabilitadas] = useState(false);

  const handleDateChange = (event) => {
    const selectedDay = new Date(event.target.value).getDay();
    setHorasHabilitadas(true);
    // 6 = domingo, 0 = lunes, 1 = martes, ..., 5 = sábado
    setSelectedDate(selectedDay);
  };

  return (
    <form>
      <label>
        Unidad:
        <input type="number" value={data.unidNumber} readOnly />
      </label>
      <label>
        Nombre:
        <input type="text" value={data.name} readOnly />
      </label>
      {data.type === 'auditorium' ? (
        <label>
            Aforo:
            <input type="number" value={data.aforo} readOnly />
        </label>
      ): data.type === 'classroom' ? (
        <>
            <label>
                Material de Silla:
                <input type="text" value={data.chairMaterial} readOnly />
            </label>
            <label>
                Cantidad de Sillas:
                <input type="number" value={data.chairAmount} readOnly />
            </label>
        </>
      ):(
        <label>
            Estilo:
            <input type="text" value={data.yardType} readOnly />
        </label>
      )}
      <label>
        Descripción:
        <textarea value={data.description} readOnly />
      </label>
      <label>
        Día:
        <input type="date" min={actualDate} onChange={handleDateChange} />
      </label>
      {horasHabilitadas && (
        <div>
          <label>
            Hora Inicial:
            <input type="time" value={horaInicial}  />
          </label>
          <label>
            Hora Final:
            <input type="time" value={horaInicial}  />
          </label>
        </div>
      )}
      <div>
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
        <button type="button">
          Reservar
        </button>
      </div>
    </form>
  );
};

export default FormReserve;
