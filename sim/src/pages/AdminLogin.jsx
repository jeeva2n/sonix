// AdminLogin.js - SIMPLIFIED WORKING VERSION
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [credentials, setCredentials] = useState({ 
    username: "admin", 
    password: "admin123" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [backendUrl, setBackendUrl] = useState("http://192.168.1.9:5000");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Logging in to:", `${backendUrl}/api/admin/login`);
      
      const response = await fetch(`${backendUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      console.log("Login response:", data);

      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_data", JSON.stringify(data.admin));
        alert("✅ Login successful!");
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError(`Cannot connect to backend at ${backendUrl}`);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = () => {
    fetch(`${backendUrl}/api/health`)
      .then(res => res.json())
      .then(data => {
        alert(`✅ Backend OK: ${data.message}`);
      })
      .catch(() => {
        alert(`❌ Cannot connect to ${backendUrl}`);
      });
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>🔐 Admin Login</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <label>Backend URL:</label>
        <input 
          type="text" 
          value={backendUrl}
          onChange={(e) => setBackendUrl(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
        <button onClick={testConnection} style={{ marginTop: "10px" }}>
          Test Connection
        </button>
      </div>
      
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>
        
        <button 
          type="submit" 
          style={{ 
            background: "#007bff", 
            color: "white", 
            padding: "10px 20px", 
            border: "none", 
            cursor: "pointer",
            width: "100%"
          }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      
      <div style={{ marginTop: "20px", background: "#f5f5f5", padding: "15px", borderRadius: "5px" }}>
        <p><strong>Default Credentials:</strong></p>
        <p>Username: <code>admin</code></p>
        <p>Password: <code>admin123</code></p>
        <p><small>These will be auto-created on first login</small></p>
      </div>
    </div>
  );
}

export default AdminLogin;