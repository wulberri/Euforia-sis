import "./reservas.css"
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { useContextUser } from "../context/UserContext";
import { getReserveHistory, deleteReserve } from "../api/reservas.api";

function Dashboard() {
  const { getUser, getAccessToken } = useContextUser();
  const [reserves, setReserves] = useState(null);
  const [toShowReserves, setShowReserves] = useState(null);
  const [filter, setFilter] = useState('Todas')
  const [sinceDate, setSinceDate] = useState('')
  const [toDate, setToDate] = useState('')

  const loadReserves = async () => {
    try {
      let res = await getReserveHistory(getAccessToken());
      res.map(r => {
        r.reserveStartDate = new Date(r.reserveStartDate);
        r.reserveEndDate = new Date(r.reserveEndDate);
      });
      setReserves(res);
      setShowReserves(res)
      setFilter('Todas');
    }
    catch (e) {
      console.log("Error cargando las reservas")
    }
  }

  useEffect(() => {
    loadReserves()
  }, [])

  useEffect(() => {
    let filtered = reserves
    if (filter != 'Todas') {
      filtered = reserves.filter(r => r.state == filter);
    }
    if(sinceDate != '' && toDate != ''){
      filtered = filterByDate(filtered)
    }

    setShowReserves(filtered)

  }, [filter, sinceDate, toDate])

  const filterByDate = (res) => {
    let date1 = new Date(sinceDate.replaceAll('-', '/'));
    let date2 = new Date(toDate.replaceAll('-', '/'));

    return res.filter(r => {
      let reserveDay = new Date(r.reserveStartDate);
      reserveDay.setHours(0,0,0,0);
      return date1 <= reserveDay && reserveDay <= date2;
    });
  }

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

  const handleCancelReserve = async (reserveId) => {
    try {
      let res = await deleteReserve(reserveId, getAccessToken());
      console.log(res)
      loadReserves();
    } catch (error) {
      console.log("error al eliminar el elemento")
    }
  }

  const clearFilterHandle = ()=> {
    setFilter('Todas');
    setSinceDate('');
    setToDate('');
  }


  return (
    <>
      <NavBar />
      <h1>Página de reservas</h1>
      {
        (reserves) ? (
          <>
            <div className="filter-container">
              <label htmlFor="s-filter">Filtro:</label>
              <select value={filter} onChange={(e) => { setFilter(e.target.value) }} name="" id="s-filter">
                <option value="Todas">Todas</option>
                <option value="Reservada">Reservada</option>
                <option value="Activa">Activa</option>
                <option value="Terminada">Terminada</option>
                <option value="Vencida">Vencida</option>
              </select>
              <label htmlFor="date-since">Desde</label>
              <input onChange={(e)=>{setSinceDate(e.target.value)}} value={sinceDate} type="date" id="date-since"/>
              <label htmlFor="date-to">Hasta</label>
              <input onChange={(e)=>{setToDate(e.target.value)}} value={toDate} type="date" id="date-to" />
              <button className="button btn-clear" onClick={clearFilterHandle}>Limpiar filtro</button>
            </div>
            {
              toShowReserves.length == 0 ? (<p className="error-message">No hay coincidencias</p>) :
                (
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Id</th>
                        <th>Recurso</th>
                        <th>Descripción</th>
                        <th>Fecha</th>
                        <th>Hora Inicio</th>
                        <th>Hora Fin</th>
                        <th>Estado</th>
                        <th>Acción</th>
                      </tr>
                      {
                        toShowReserves.map((r, index) => (
                          <tr key={index}>
                            <td>{r.reserveID}</td>
                            <td>{r.resourceName}</td>
                            <td>{r.resourceDescp}</td>
                            <td>{formatDate(r.reserveStartDate)}</td>
                            <td>{formatHour(r.reserveStartDate)}</td>
                            <td>{formatHour(r.reserveEndDate)}</td>
                            <td >{r.state}</td>
                            {r.state == 'Reservada' ?
                              (
                                <td className="cancel-btn" onClick={() => { handleCancelReserve(r.reserveID) }}>
                                  <svg class="feather feather-trash-2" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                  Cancelar
                                </td>)
                              : (<td></td>)}
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                )
            }
          </>
        )
          : (<p className="error-message">No hay reservas</p>)
      }
    </>
  );
}

export default Dashboard;
