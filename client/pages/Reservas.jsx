import "./reservas.css"
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { useContextUser } from "../context/UserContext";
import { getReserveHistory, deleteReserve } from "../api/reservas.api";

function Dashboard() {  
  const { getUser, getAccessToken } = useContextUser();
  const [ reserves, setReserves ] = useState(null);

  const loadReserves = async ()=> {
    try{
      let res = await getReserveHistory(getAccessToken());
      res.map(r => {
        r.reserveStartDate = new Date(r.reserveStartDate);
        r.reserveEndDate = new Date(r.reserveEndDate);
      });
      console.log(res)
      setReserves(res);
    }
    catch(e){
      console.log(e)
      console.log("Error cargando las reservas")
    }
  }

  useEffect(()=>{
    loadReserves()
  }, [])

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

  const handleCancelReserve =  async (reserveId) => {
    try {
      let res = await deleteReserve(reserveId, getAccessToken());
      console.log(res)
      loadReserves();
    } catch (error) {
      console.log("error al eliminar el elemento")
    }
  }

  return (
    <>
      <NavBar />
      <h1>Página de reservas</h1>
      {
        reserves && (
          <table className="table">
            <tr>
              <th>#</th>
              <th>Recurso</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Hora Inicio</th>
              <th>Hora Fin</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
            {
              reserves.map((r, index) => (
                <tr>
                  <td>{index+1}</td>
                  <td>{r.resourceName}</td>
                  <td>{r.resourceDescp}</td>
                  <td>{formatDate(r.reserveStartDate)}</td>
                  <td>{formatHour(r.reserveStartDate)}</td>
                  <td>{formatHour(r.reserveEndDate)}</td>
                  <td >{r.state}</td>
                  { r.state == 'Reservada' ? 
                  (
                  <td className="cancel-btn" onClick={()=>{handleCancelReserve(r.reserveID)}}>
                    <svg class="feather feather-trash-2" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    Cancelar
                  </td>)
                  : (<td></td>) }
                </tr>
              ))
            }
          </table>
        )
      }
    </>
  );
}

export default Dashboard;
