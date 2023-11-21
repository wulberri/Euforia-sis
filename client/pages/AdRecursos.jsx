import "./recursos.css"
import NavBar from "../components/NavBar";
import AdResourcesTable from "../components/AdResourcesTable";

function Dashboard() {  
  return (
    <>
      <NavBar />
      <h1>Recursos Disponibles</h1>
      <AdResourcesTable />
    </>
  );
}

export default Dashboard;
