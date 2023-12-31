import "./resourcestable.css";
import { startLoan } from "../api/prestamos.api";
import { useContextUser } from "../context/UserContext.jsx";
import {useState} from "react";

function ResourcesTable({data, email}) {
    const [msg, setMsg] = useState('');
    const {getAccessToken} = useContextUser();

    const fetchStartLoan = async (id) => {
      try {
        const result = await startLoan({
          "reserveID": id,
          "reserveOwnerMail": email,
          }, getAccessToken());
          setMsg(result);
      } catch (err){
          console.error('Error al iniciar el prestamo:', err);
      }
    };
    
    const iniciarLoan = async(item) => {
        await fetchStartLoan(item.reserveID);
        setTimeout(()=>setMsg(''),2000)
    };

    const formatDate = (date) => {
      const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };
      return new Date(date).toLocaleDateString('es-ES', options);
    };
  
    const formatHour = (date) => {
      return new Date(date).toLocaleTimeString('es-ES', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    };

    return (
       <div>
      {typeof data[0] === "object" ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Fecha y hora limite</th>
              <th>Iniciar prestamo</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="noPointer">{item.reserveID}</td>
                <td className="noPointer">{item.resourceName}</td>
                <td className="noPointer">{
                  formatDate(item.reserveEndDate)+' '+formatHour(item.reserveEndDate)
                }</td>
                <td className="noPointer opBtns">
                    <span className="accept" onClick={()=>iniciarLoan(item)}>
                        <svg fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="errReserve">{data.message}</p>
      )}
      {msg !== '' && (
        <p className="successReserve">{msg.message}</p>
      )}
      </div> 
    );
}

export default ResourcesTable;
