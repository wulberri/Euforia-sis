import "./resourcestable.css";
import { getAllResourcesInt } from "../api/integracion.api";
import {useEffect, useState} from "react";

function IntegrationTable() {
    const [data, setData] = useState(null);
    
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const result = await getAllResourcesInt();
                setData(result);
            } catch (err){
                setData(err.response.data.message)
                console.error('Error al obtener los recursos externos:', err);
            }
        };
        fetchData();
    },[]);


  return (
    <div>
      {data ? (
        typeof(data) == 'string' ? (<p className="errReserve">{data}</p>) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="noPointer">{item.t_name}</td>
                  <td className="noPointer">{item.t_description}</td>
                  <td className="noPointer">{item.n_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default IntegrationTable;
