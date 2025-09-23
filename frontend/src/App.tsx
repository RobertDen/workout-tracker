//src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Workouts from "./Workouts";

// Simple home page component
function Home() {
  return (
    <div>
      <h1>Welcome to the Workout Tracker</h1>
      <p>This is the home page. Navigate to see workouts.</p>
    </div>
  );
}

function App() {
  return (
    //Router wraps the whole app so we can navigate between pages
    <Router>
      <nav style={{marginBottom: "20px" }}>
        {/*Simple navigation links */}
        <Link to="/" style={{ marginRight: "10px"}}>Home</Link>
        <Link to="/workouts">Workouts</Link>
      </nav>


      {/*Routes define which component to show based on the URL*/}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="workouts" element={<Workouts />} />
      </Routes>
    </Router>
  );
}

export default App;