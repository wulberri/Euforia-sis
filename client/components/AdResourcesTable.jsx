import "./resourcestable.css";
import { getAllResources, getUnitSchedule, deleteResourceRequest } from "../api/recursos.api";
import {useEffect, useState} from "react";
import AdFormEdit from './AdFormEdit';
import AdFormCreate from './AdFormCreate';

function ResourcesTable() {
    const [data, setData] = useState(null);
    const [scheduleData, setScheduleData] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [formCreateVisible, setFormCreateVisible] = useState(false);
    const [formData, setFormData] = useState(null);
    
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const result = await getAllResources();
                setData(result);
            } catch (err){
                console.error('Error al obtener los recursos:', err);
            }
            try {
                const result = await getUnitSchedule(1);
                setScheduleData(result.schedule);
            } catch (err){
                console.error('Error al obtener el horario de la unidad:', err);
            }
        };
        fetchData();
    },[]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllResources();
        setData(result);
      } catch (err) {
        console.error("Error al obtener los recursos:", err);
      }
    };
    fetchData();
  });

  const createData = () => {
    setFormCreateVisible(true);
  };

  const editData = (item) => {
    setFormData(item);
    setFormVisible(true);
  };

  const deleteData = (item) => {
    /*PONER LOGICA DELETE*/
    try {
      deleteResourceRequest(item.id);
    } catch (error) {
      console.log(error);
    }
  };

  const closeForm = () => {
    setFormVisible(false);
    setFormData(null);
  };

  const closeCreateForm = () => {
    setFormCreateVisible(false);
  };

  return (
    <div>
      <div className="createBtn" onClick={() => createData()}>
        Crear Recurso
      </div>
      {data ? (
        <table>
          <thead>
            <tr>
              <th>Unidad</th>
              <th>Espacio</th>
              <th>Descripción</th>
              <th>Operaciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="noPointer">{item.unidNumber}</td>
                <td className="noPointer">{item.name}</td>
                <td className="noPointer">{item.description}</td>
                <td className="noPointer opBtns">
                  <span className="edit" onClick={() => editData(item)}>
                    <svg
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </span>
                  <span className="delete" onClick={() => deleteData(item)}>
                    <svg
                      class="feather feather-trash-2"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Cargando...</p>
      )}
      {formVisible && formData && (
        <AdFormEdit
          data={formData}
          onClose={closeForm}
          unitSchedule={scheduleData}
        />
      )}
      {formCreateVisible && (
        <AdFormCreate
          onClose={closeCreateForm}
          unitSchedule={scheduleData}
        />
      )}
      {formCreateVisible && <AdFormCreate onClose={closeCreateForm} />}
    </div>
  );
}

export default ResourcesTable;
