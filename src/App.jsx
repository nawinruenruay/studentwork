import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import Student from "./Page/Student";
import Work from "./Page/Work";
import Worktype from "./Page/Worktype";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/student" element={<Student />} />
          <Route path="/work" element={<Work />} />
          <Route path="/worktype" element={<Worktype />} />
        </Route>
        <Route path="*" element={<work />} />
      </Routes>
    </>
  );
}

export default App;
