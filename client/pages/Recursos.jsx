import "./recursos.css"
import NavBar from "../components/NavBar";
import ResourcesTable from "../components/ResourcesTable";

function Dashboard() {  
  return (
    <>
      <NavBar />
      <h1>Recursos Disponibles</h1>
      <ResourcesTable />
    </>
  );
}

export default Dashboard;
