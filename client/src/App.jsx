import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import PrivateRouteAdmin from '../components/PrivateRouteAdmin'
import Sign from "../pages/Sign";
import NotFound from "../pages/NotFound";
import Reservas from "../pages/Reservas";
import Usuarios from '../pages/Usuarios';
import Prestamos from '../pages/Prestamos'
import Recursos from '../pages/Recursos'
import Adrecursos from '../pages/AdRecursos'
import Adreservas from '../pages/AdReservas'
import IntegrationResources from '../pages/IntegrationResources'

function App() {
  return (
    //Manejo de rutas
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sign />} />
        <Route element={<PrivateRoute />}>
          <Route path="/reservas" element={<Reservas />} />
        </Route>
        <Route element={<PrivateRouteAdmin />}>
          <Route path="/adreservas" element={<Adreservas />} />
        </Route>
        <Route element={<PrivateRouteAdmin />}>
          <Route path="/usuarios" element={<Usuarios />} />
        </Route>
        <Route element={<PrivateRouteAdmin />}>
          <Route path="/prestamos" element={<Prestamos />} />
        </Route>
        <Route element={<PrivateRouteAdmin />}>
          <Route path="/adrecursos" element={<Adrecursos />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/recursos" element={<Recursos />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/otros" element={<IntegrationResources />} />
        </Route>
        <Route element={<PrivateRouteAdmin />}>
          <Route path="/otros-ad" element={<IntegrationResources />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
