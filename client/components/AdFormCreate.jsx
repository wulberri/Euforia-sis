import "./formreserve.css";
import { useState } from "react";
import { createResourceRequest } from "../api/recursos.api.js";

const FormReserve = ({onClose, unitSchedule }) => {
  unitSchedule = {
    "Lunes": {
      "start": "06:00:00",
      "end": "20:00:00"
    },
    "Martes": {
      "start": "06:00:00",
      "end": "20:00:00"
    },
    "Miércoles": {
      "start": "06:00:00",
      "end": "20:00:00"
    },
    "Jueves": {
      "start": "06:00:00",
      "end": "20:00:00"
    },
    "Viernes": {
      "start": "06:00:00",
      "end": "20:00:00"
    },
    "Sábado": {
      "start": "06:00:00",
      "end": "18:00:00"
    },
    "Domingo": {
      "start": "11:00:00",
      "end": "16:00:00"
    }
  }

  const [selectedOption, setSelectedOption] = useState('');

  const [formData, setFormData] = useState({
    unidad: 1,
    nombre: "",
    descripcion: "",
    tipo: "",
    aforo: "",
    cantidad_puestos: "",
    material_puestos: "madera",
    tipo_patio: "",
    horario: {
      Lunes: { hora_inicio: "", hora_cierre: "" },
      Martes: { hora_inicio: "", hora_cierre: "" },
      Miercoles: { hora_inicio: "", hora_cierre: "" },
      Jueves: { hora_inicio: "", hora_cierre: "" },
      Viernes: { hora_inicio: "", hora_cierre: "" },
      Sabado: { hora_inicio: "", hora_cierre: "" },
    },
  });

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    setFormData({ ...formData, ["tipo"]: event.target.value });
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      await createResourceRequest(formData);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = ({ target: { name, value } }) => {
    if (name.includes("hora")) {
      const [day, field] = name.split("-");
      setFormData({
        ...formData,
        horario: {
          ...formData.horario,
          [day]: {
            ...formData.horario[day],
            [field]: value + ":00",
          },
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="fat_form">
      <form className="formRe" onSubmit={handleSubmit}>
        <label>
          ¿Qué tipo de recurso desea crear?:
          <select
            className="normal"
            value={selectedOption}
            onChange={handleSelectChange}
          >
            <option value="">Selecciona...</option>
            <option value="auditorio">Auditorio</option>
            <option value="aula">Salón</option>
            <option value="patio">Patio</option>
          </select>
        </label>
        {selectedOption !== "" && (
          <>
            <label>
              Unidad:
              <input
                name="unidad"
                value={formData.unidad}
                className="normal"
                type="number"
                defaultValue="1"
                onChange={handleChange}
                readOnly
              />
            </label>
            <label>
              Nombre:
              <input
                name="nombre"
                value={formData.nombre}
                className="normal"
                type="text"
                onChange={handleChange}
              />
            </label>
            {selectedOption === "auditorio" ? (
              <label>
                Aforo:
                <input
                  name="aforo"
                  value={formData.aforo}
                  className="normal"
                  type="number"
                  onChange={handleChange}
                />
              </label>
            ) : selectedOption === "aula" ? (
              <>
                <label>
                  Material de Silla:
                  <input
                    name="material_puestos"
                    value={formData.material_puestos}
                    className="normal"
                    type="text"
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Cantidad de Sillas:
                  <input
                    name="cantidad_puestos"
                    value={formData.cantidad_puestos}
                    className="normal"
                    type="number"
                    min="1"
                    onChange={handleChange}
                  />
                </label>
              </>
            ) : selectedOption === "patio" ? (
              <label>
                Estilo:
                <input
                  name="tipo_patio"
                  value={formData.tipo_patio}
                  className="normal"
                  type="text"
                  onChange={handleChange}
                />
              </label>
            ) : (
              ""
            )}
            <label className="textarea">
              Descripción:
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </label>

            <div className="schedule">
              <p className="schTitle">Horarios:</p>
              <div className="par">
                <label>
                  Lunes:
                  <input
                    name="Lunes-hora_inicio"
                    value={formData.horario.Lunes.hora_inicio}
                    className="normal"
                    type="time"
                    min={unitSchedule['Lunes'].start}
                    max={unitSchedule['Lunes'].end}
                    onChange={handleChange}
                  />
                  <input
                    name="Lunes-hora_cierre"
                    value={formData.horario.Lunes.hora_cierre}
                    className="normal"
                    type="time"
                    min={unitSchedule['Lunes'].start}
                    max={unitSchedule['Lunes'].end}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Martes:
                  <input
                    name="Martes-hora_inicio"
                    value={formData.horario.Martes.hora_inicio}
                    className="normal"
                    type="time"
                    min={unitSchedule['Martes'].start}
                    max={unitSchedule['Martes'].end}
                    onChange={handleChange}
                  />
                  <input
                    name="Martes-hora_cierre"
                    value={formData.horario.Martes.hora_cierre}
                    className="normal"
                    type="time"
                    min={unitSchedule['Martes'].start}
                    max={unitSchedule['Martes'].end}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="par">
                <label>
                  Miércoles:
                  <input
                    name="Miercoles-hora_inicio"
                    value={formData.horario.Miercoles.hora_inicio}
                    className="normal"
                    type="time"
                    min={unitSchedule['Miércoles'].start}
                    max={unitSchedule['Miércoles'].end}
                    onChange={handleChange}
                  />
                  <input
                    name="Miercoles-hora_cierre"
                    value={formData.horario.Miercoles.hora_cierre}
                    className="normal"
                    type="time"
                    min={unitSchedule['Miércoles'].start}
                    max={unitSchedule['Miércoles'].end}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Jueves:
                  <input
                    name="Jueves-hora_inicio"
                    value={formData.horario.Jueves.hora_inicio}
                    className="normal"
                    type="time"
                    min={unitSchedule['Jueves'].start}
                    max={unitSchedule['Jueves'].end}
                    onChange={handleChange}
                  />
                  <input
                    name="Jueves-hora_cierre"
                    value={formData.horario.Jueves.hora_cierre}
                    className="normal"
                    type="time"
                    min={unitSchedule['Jueves'].start}
                    max={unitSchedule['Jueves'].end}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="par">
                <label>
                  Viernes:
                  <input
                    name="Viernes-hora_inicio"
                    value={formData.horario.Viernes.hora_inicio}
                    className="normal"
                    type="time"
                    min={unitSchedule['Viernes'].start}
                    max={unitSchedule['Viernes'].end}
                    onChange={handleChange}
                  />
                  <input
                    name="Viernes-hora_cierre"
                    value={formData.horario.Viernes.hora_cierre}
                    className="normal"
                    type="time"
                    min={unitSchedule['Viernes'].start}
                    max={unitSchedule['Viernes'].end}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Sábado:
                  <input
                    name="Sabado-hora_inicio"
                    value={formData.horario.Sabado.hora_inicio}
                    className="normal"
                    type="time"
                    min={unitSchedule['Sábado'].start}
                    max={unitSchedule['Sábado'].end}
                    onChange={handleChange}
                  />
                  <input
                    name="Sabado-hora_cierre"
                    value={formData.horario.Sabado.hora_cierre}
                    className="normal"
                    type="time"
                    min={unitSchedule['Sábado'].start}
                    max={unitSchedule['Sábado'].end}
                    onChange={handleChange}
                  />
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
