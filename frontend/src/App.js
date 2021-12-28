import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import ResultScreen from "./components/ResultScreen";

function App() {
  return (
    <Router>
      <Route path="/" component={HomeScreen} exact />
      <Route path="/:id" component={ResultScreen} />
    </Router>
  );
}

export default App;
