// App.tsx

// CHQ: yes the following comment is to force a re-deploy

// import FirstApp from "./FirstApp";
// import Login from "./auth/Login";
// import SamplePage from "./components/SamplePage";
import LoginDashboard from "./components/accountAccessPages/LoginDashboard";

function App() {
  // const myChoice: number = 1;
  // const myChoice: number = 2;
  // return <>{myChoice === 1 ? <Login /> : <SamplePage />}</>;
  return (
    <>
      <LoginDashboard />
    </>
  );
}

export default App;
