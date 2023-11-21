import NavBar from "../components/NavBar";
import AdReservesTable from "../components/AdReservesTable";
import {useState} from "react";
import { getEmailReserve } from "../api/reservas.api.js";
import { useContextUser } from "../context/UserContext.jsx";

function Dashboard() {  
  const [data, setData] = useState(null);
  const {getAccessToken} = useContextUser();
  const [email, setEmail] = useState('');


  const fetchEmailReserve = async () => {
    try {
      const result = await getEmailReserve({
        "reserveOwnerMail": email,
        }, getAccessToken());
        setData(result);
    } catch (err){
        console.error('Error al obtener las reservas del usuario:', err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetchEmailReserve();
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <>
      <NavBar />
      <h1>Reservas por Usuario</h1>
      <div className="adreservesForm">
          <form onSubmit={handleSubmit}>
            <label>
              Email a buscar:
              <input className="normal" type="email" onChange={handleEmailChange} required/>
            </label>

            <button className="button" type="submit">
              Buscar
            </button>
          </form>
      </div>
      {data && (
        <AdReservesTable
          data={data}
          email={email}
        />
      )}
    </>
  );
}

export default Dashboard;
