import "./resourcestable.css";
import { endLoan } from "../api/prestamos.api";
import { useContextUser } from "../context/UserContext.jsx";
import {useState} from "react";

function ResourcesTable({data, email}) {
    const [msg, setMsg] = useState('');
    const {getAccessToken} = useContextUser();

    const fetchEndLoan = async (id) => {
      try {
        const result = await endLoan({
          "reserveID": id,
          "reserveOwnerMail": email,
          }, getAccessToken());
          setMsg(result);
      } catch (err){
          console.error('Error al terminar el prestamo:', err);
      }
    };
    
    const finLoan = async(item) => {
        await fetchEndLoan(item.reserveID);
        setTimeout(()=>setMsg(''),2000)
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
              <th>Finalizar prestamo</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="noPointer">{item.reserveID}</td>
                <td className="noPointer">{item.resourceName}</td>
                <td className="noPointer">{
                  new Date(item.reserveEndDate).getDate() +"/"+
                  (new Date(item.reserveEndDate).getMonth()+1) +"/"+
                  new Date(item.reserveEndDate).getFullYear() +" "+
                  ("00"+new Date(item.reserveEndDate).getHours()).slice(-2) +":"+
                  ("00"+new Date(item.reserveEndDate).getMinutes()).slice(-2)
                }</td>
                <td className="noPointer opBtns">
                    <span className="accept" onClick={()=>finLoan(item)}>
                        <svg fill="#ee6055" height="25px" width="25px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 283.194 283.194" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M141.597,32.222c-60.31,0-109.375,49.065-109.375,109.375s49.065,109.375,109.375,109.375s109.375-49.065,109.375-109.375 S201.907,32.222,141.597,32.222z M50.222,141.597c0-50.385,40.991-91.375,91.375-91.375c22.268,0,42.697,8.01,58.567,21.296 L71.517,200.164C58.232,184.293,50.222,163.865,50.222,141.597z M141.597,232.972c-21.648,0-41.558-7.572-57.232-20.2 L212.772,84.366c12.628,15.674,20.2,35.583,20.2,57.231C232.972,191.982,191.981,232.972,141.597,232.972z"></path> <path d="M141.597,0C63.52,0,0,63.52,0,141.597s63.52,141.597,141.597,141.597s141.597-63.52,141.597-141.597S219.674,0,141.597,0z M141.597,265.194C73.445,265.194,18,209.749,18,141.597S73.445,18,141.597,18s123.597,55.445,123.597,123.597 S209.749,265.194,141.597,265.194z"></path> </g> </g></svg>
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
