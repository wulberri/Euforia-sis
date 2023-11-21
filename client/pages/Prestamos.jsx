import NavBar from "../components/NavBar";
import AdLoanTable from "../components/AdLoanTable";
import {useState} from "react";
import { getActiveLoans } from "../api/prestamos.api";
import { useContextUser } from "../context/UserContext.jsx";

function Dashboard() {  
  const [data, setData] = useState(null);
  const {getAccessToken} = useContextUser();
  const [email, setEmail] = useState('');


  const fetchEmailLoan = async () => {
    try {
      const result = await getActiveLoans({
        "reserveOwnerMail": email,
        }, getAccessToken());
        setData(result);
    } catch (err){
        console.error('Error al obtener las reservas del usuario:', err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetchEmailLoan();
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <>
      <NavBar />
      <h1>Prestamos por Usuario</h1>
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
        <AdLoanTable
          data={data}
          email={email}
        />
      )}
    </>
  );
}

export default Dashboard;
