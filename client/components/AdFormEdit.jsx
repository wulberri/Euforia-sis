import "./formreserve.css";
import { useEffect } from "react";
import { useState } from "react";
import { getResourceRequest, updateResourceRequest } from "../api/recursos.api";

const FormReserve = ({ data, onClose }) => {
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

  useEffect(() => {
    return async () => {
      const result = await getResourceRequest(data.id);
      setFormData(result[0]);
    };
  }, [data.id]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateResourceRequest(data.id, formData)
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fat_form">
      <form className="formRe" onSubmit={handleSubmit}>
        <label>
          Unidad:
          <input
            name="unidad"
            value={formData.unidad}
            className="normal"
            type="number"
            min="1"
            readOnly
            onChange={handleChange}
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
        {data.type === "auditorium" ? (
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
        ) : data.type === "classroom" ? (
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
        ) : (
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
                min="8:00:00"
                max="20:00:00"
                onChange={handleChange}
              />
              <input
                name="Lunes-hora_cierre"
                value={formData.horario.Lunes.hora_cierre}
                className="normal"
                type="time"
                min="8:00:00"
                max="20:00:00"
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
                min="8:00:00"
                max="20:00:00"
                onChange={handleChange}
              />
              <input
                name="Martes-hora_cierre"
                value={formData.horario.Martes.hora_cierre}
                className="normal"
                type="time"
                min="8:00:00"
                max="20:00:00"
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
                min="8:00:00"
                max="20:00:00"
                onChange={handleChange}
              />
              <input
                name="Miercoles-hora_cierre"
                value={formData.horario.Miercoles.hora_cierre}
                className="normal"
                type="time"
                min="8:00:00"
                max="20:00:00"
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
                min="8:00:00"
                max="20:00:00"
                onChange={handleChange}
              />
              <input
                name="Jueves-hora_cierre"
                value={formData.horario.Jueves.hora_cierre}
                className="normal"
                type="time"
                min="8:00:00"
                max="20:00:00"
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
                min="8:00:00"
                max="20:00:00"
                onChange={handleChange}
              />
              <input
                name="Viernes-hora_cierre"
                value={formData.horario.Viernes.hora_cierre}
                className="normal"
                type="time"
                min="8:00:00"
                max="20:00:00"
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
                min="8:00:00"
                max="20:00:00"
                onChange={handleChange}
              />
              <input
                name="Sabado-hora_cierre"
                value={formData.horario.Sabado.hora_cierre}
                className="normal"
                type="time"
                min="8:00:00"
                max="20:00:00"
                onChange={handleChange}
              />
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
