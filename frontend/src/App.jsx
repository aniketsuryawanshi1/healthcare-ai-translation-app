import { Provider } from "react-redux";
import MainRoutes from "./Routes/routes";
import store from "./store/store";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
const App = () => {

  return (
    <Router>
    <AuthProvider>
    <Provider store={store}>
      <MainRoutes />
    </Provider>
    </AuthProvider>
    </Router>
  )
}

export default App
