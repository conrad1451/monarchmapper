import SamplePage from "./components/SamplePage";
// import CustomTable from './MyTable'
// import SightingTable from "./components/SightingTable";

import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import SightingDisplay from "./components/SightingDisplay";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

// eslint@typescript-eslint/no-empty-object-type
// interface NavigationButtonsProps {}

// const NavigationButtons: React.FC<NavigationButtonsProps> = () => {
function NavigationButtons() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 2 }}>
      <Button variant="contained" onClick={() => handleNavigate("/orig")}>
        Go to original page
      </Button>
      <Button
        variant="contained"
        onClick={() => handleNavigate("/datafetcher")}
      >
        Go to data fetcher
      </Button>
      {/* <Button variant="contained" onClick={() => handleNavigate("/tabletest")}>
        Go to table testing
      </Button> */}
    </Box>
  );
}

function FirstApp() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<NavigationButtons />} />
          <Route path="/orig" element={<SamplePage />} />
          <Route path="/datafetcher" element={<SightingDisplay />} />

          {/* <Route path="/datafetcher" element={<DataFetcher />} /> */}

          {/* <Route path="/test" element={<MyTableTest />} /> */}
          {/* <Route path="/orig" element={ <CustomTable/>} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default FirstApp;
