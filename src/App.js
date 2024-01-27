import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import Chart from './components/Chart';

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [chartData, setChartData] = useState([]); // Chart data state

  const handleLogin = (credentials) => {
    // Perform login logic (you can replace this with API call)
    if (credentials.email === 'admin@example.com' && credentials.password === 'adminpassword') {
      setLoggedIn(true);

      // Example chart data (replace with your actual data fetching logic)
      const exampleChartData = [
        { label: 'Category 1', value: 5 },
        { label: 'Category 2', value: 8 },
        { label: 'Category 3', value: 12 },
        // Add more data points as needed
      ];

      setChartData(exampleChartData);
    } else {
      console.log('Login failed');
    }
  };

  const handleLogout = () => {
    // Perform logout actions
    setLoggedIn(false);
    setChartData([]); // Clear chart data on logout
  };

  return (
    <div>
      <h1>Dashboard App</h1>
      {isLoggedIn ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <Dashboard />
          <Chart data={chartData} /> {/* Pass chart data to the Chart component */}
        </>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
