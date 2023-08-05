import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "layouts/Layout";
import DeelanceStakingPage from "pages/DeelanceStakingPage";
import PortfolioPage from "pages/PortfolioPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<DeelanceStakingPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
