import "./resourcestable.css";
import { getAllResources } from "../api/recursos.api";
import {useEffect, useState} from "react";
import FormReserve from './FormReserve';

function ResourcesTable() {
    const [data, setData] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState(null);
    
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const result = await getAllResources();
                setData(result);
            } catch (err){
                console.error('Error al obtener los recursos:', err);
            }
        };
        fetchData();
    },[]);

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
      {data ? (
        <table>
          <thead>
            <tr>
              <th>Unidad</th>
              <th>Espacio</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} onClick={() => showForm(item)}>
                <td>{item.unidNumber}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Cargando...</p>
      )}
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
