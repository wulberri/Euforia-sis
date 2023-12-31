import "./resourcestable.css";
import { getAllResources } from "../api/recursos.api";
import { useEffect, useState } from "react";
import FormReserve from './FormReserve';

function ResourcesTable() {
  const [data, setData] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState(null);
  const [filter, setFilter] = useState('all')
  const [toShow, setToShow] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllResources();
        setData(result);
        setToShow(result)
        console.log(result)
      } catch (err) {
        console.error('Error al obtener los recursos:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = data;
    if (filter != 'all') {
      filtered = filtered.filter(r => r.type == filter);
    }

    setToShow(filtered)

  }, [filter])

  const showForm = (item) => {
    setFormData(item);
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
    setFormData(null);
  };

  return (
    <div>
      {data == null ? (
        <p>Cargando...</p>
      ) : (
        <>
        <div className="filter-container">
          <label htmlFor="s-filter">Filtro:</label>
          <select value={filter} onChange={(e) => { setFilter(e.target.value) }} name="" id="s-filter">
            <option value="all">Todos</option>
            <option value="auditorium">Auditorios</option>
            <option value="classroom">Salones</option>
            <option value="yard">Patios</option>
          </select>
        </div>
        {toShow.length == 0 ? (<p className="error-message">No hay coincidencias</p>) : (
          <table>
            <thead>
              <tr>
                <th>Unidad</th>
                <th>Espacio</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {toShow.map((item, index) => (
                <tr key={index} onClick={() => showForm(item)}>
                  <td>{item.unidNumber}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>)}
      {formVisible && formData && (
        <FormReserve
          data={formData}
          onClose={closeForm}
        />
      )}
    </div>
  );
}

export default ResourcesTable;
