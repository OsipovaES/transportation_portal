import { Header } from "./components/Header";
import { AppRouter } from "./router";
import { Footer } from "./components/Footer";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <AppRouter />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
