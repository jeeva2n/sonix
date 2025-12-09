// AdminDashboard.js - UPDATED VERSION WITH PROPER CATEGORY SELECTION
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define your product type categories (should be at top level or imported)
const productTypeCategories = {
  calibration_block: {
    navigation: "reference-standards",
    categories: [
      "UT Calibration Blocks",
      "PAUT Calibration Blocks", 
      "TOFD Calibration Blocks",
      "MT/PT Calibration Blocks",
      "ET Calibration Blocks",
      "ECT/RFT/MFL Calibration Tubes",
      "APR Reference Tubes",
      "AUT-Z Reference Blocks"
    ]
  },
  
  flawed_specimen: {
    navigation: "flawed-specimens",
    categories: [
      "Training and Examination Flawed specimens",
      "Ultrasonic Testing Flawed specimens",
      "Dye Penetrant Flawed specimens",
      "Eddy Current Flawed specimens", 
      "Radiography Flawed specimens",
      "Visual testing Flawed specimens",
      "Paut and ToFD Flawed specimens",
      "NDT Flawed Specimens Kit",
      "UT Flawed Specimens Kit",
      "NDT Standards Flawed Specimens Kit", 
      "MT Flawed Specimens Kit",
      "PT Flawed Specimens Kit",
      "RT Flawed Specimens Kit",
      "ET Flawed Specimens Kit",
      "PAUT and ToFD Flawed Specimens Kit",
      "Welded Specimens",
      "Base Material Flawed Specimens",
      "Advanced NDT Validation Specimens", 
      "POD & Training Specimens"
    ]
  },
  
  validation_block: {
    navigation: "validation-blocks",
    categories: [
      "UT Validation Blocks",
      "PAUT and ToFD Validation Blocks",
      "Boiler Tube PAUT Validation Blocks"
    ]
  }
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    type: "calibration_block",
    price: "",
    image: null
  });
  const [formLoading, setFormLoading] = useState(false);
const [backendUrl, setBackendUrl] = useState("http://192.168.1.9:5000");
  
  // Get categories based on selected type
  const getCategoriesForType = (type) => {
    return productTypeCategories[type]?.categories || [];
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      alert("Please login first");
      navigate("/admin/login");
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/products`);
      const data = await res.json();
      
      if (data.success) {
        setProducts(data.products || []);
        console.log("Products loaded:", data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    // DEBUG LOGGING - Add this to see what's being sent
    console.log("📤 Submitting form data:", formData);
    console.log("Selected category:", formData.category);
    console.log("Selected type:", formData.type);
    
    // Check if required fields are present
    if (!formData.name || !formData.category || !formData.type) {
      console.error("❌ Missing required fields!");
      console.log("Name present:", !!formData.name);
      console.log("Category present:", !!formData.category);
      console.log("Type present:", !!formData.type);
      alert("Please fill all required fields!");
      setFormLoading(false);
      return;
    }
    
    const token = localStorage.getItem("admin_token");
    const data = new FormData();
    
    // Add debug info
    console.log("📝 FormData content:");
    
    data.append("name", formData.name);
    console.log("- name:", formData.name);
    
    data.append("description", formData.description);
    console.log("- description:", formData.description);
    
    data.append("category", formData.category);
    console.log("- category:", formData.category);
    
    data.append("type", formData.type);
    console.log("- type:", formData.type);
    
    data.append("price", formData.price);
    console.log("- price:", formData.price);
    
    if (formData.image) {
      data.append("image", formData.image);
      console.log("- image:", formData.image.name);
    }

    try {
      console.log("🚀 Sending request to:", `${backendUrl}/api/products`);
      const res = await fetch(`${backendUrl}/api/products`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });
      
      const result = await res.json();
      console.log("📥 Response:", result);

      if (result.success) {
        alert("✅ Product added successfully!");
        setFormData({
          name: "",
          description: "",
          category: "",
          type: "calibration_block",
          price: "",
          image: null
        });
        // Reset file input
        document.querySelector('input[type="file"]').value = "";
        fetchProducts();
      } else {
        alert(`❌ Error: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("❌ Failed to add product. Check console for details.");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle type change - reset category when type changes
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData({
      ...formData,
      type: newType,
      category: "" // Reset category when type changes
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${backendUrl}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await res.json();
      
      if (result.success) {
        alert("✅ Product deleted!");
        fetchProducts();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_data");
    navigate("/admin/login");
  };

  const testProducts = () => {
    console.log("Current products:", products);
    console.log("Available categories for current type:", getCategoriesForType(formData.type));
    alert(`Total products: ${products.length}\nView console for details`);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", alignItems: "center" }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p style={{ marginTop: "5px", color: "#666", fontSize: "14px" }}>
            Add and manage products for your NDT store
          </p>
        </div>
        <div>
          <button 
            onClick={testProducts} 
            style={{ 
              marginRight: "10px", 
              padding: "8px 15px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Debug ({products.length})
          </button>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: "8px 15px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px" }}>
        {/* Add Product Form */}
        <div style={{ background: "#f8f9fa", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginBottom: "20px", color: "#333" }}>Add New Product</h3>
          
          {/* Backend URL */}
          <div style={{ marginBottom: "20px", background: "#e9ecef", padding: "10px", borderRadius: "4px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Backend URL:</label>
            <input 
              type="text" 
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              style={{ width: "100%", padding: "8px", border: "1px solid #ced4da", borderRadius: "4px" }}
            />
            <small style={{ color: "#6c757d", fontSize: "12px" }}>
              Change this if your backend is running on a different port
            </small>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Product Name *
              </label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="e.g., ASME Calibration Block IIW Type"
                style={{ width: "100%", padding: "10px", border: "1px solid #ced4da", borderRadius: "4px" }}
              />
            </div>
            
            {/* Description */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                placeholder="Detailed description of the product..."
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  height: "100px",
                  border: "1px solid #ced4da", 
                  borderRadius: "4px",
                  resize: "vertical"
                }}
              />
            </div>
            
            {/* Type and Category */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                  Product Type *
                </label>
                <select
                  value={formData.type}
                  onChange={handleTypeChange}
                  style={{ 
                    width: "100%", 
                    padding: "10px", 
                    border: "1px solid #ced4da", 
                    borderRadius: "4px",
                    background: "white"
                  }}
                >
                  <option value="calibration_block">Calibration Block</option>
                  <option value="flawed_specimen">Flawed Specimen</option>
                  <option value="validation_block">Validation Block</option>
                </select>
                <small style={{ color: "#6c757d", fontSize: "12px" }}>
                  Type: {formData.type}
                </small>
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                  style={{ 
                    width: "100%", 
                    padding: "10px", 
                    border: "1px solid #ced4da", 
                    borderRadius: "4px",
                    background: "white"
                  }}
                >
                  <option value="">Select a category</option>
                  {getCategoriesForType(formData.type).map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <small style={{ color: "#6c757d", fontSize: "12px" }}>
                  {getCategoriesForType(formData.type).length} categories available
                </small>
              </div>
            </div>
            
            {/* Price */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Price ($) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                placeholder="0.00"
                min="0"
                step="0.01"
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid #ced4da", 
                  borderRadius: "4px" 
                }}
              />
            </div>
            
            {/* Image Upload */}
            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Product Image
              </label>
              <input
                type="file"
                onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                style={{ 
                  width: "100%", 
                  padding: "8px",
                  border: "1px dashed #ced4da",
                  borderRadius: "4px"
                }}
                accept="image/*"
              />
              {formData.image && (
                <small style={{ color: "#28a745", marginTop: "5px", display: "block" }}>
                  Selected: {formData.image.name}
                </small>
              )}
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit"
              disabled={formLoading}
              style={{ 
                background: formLoading ? "#6c757d" : "#28a745", 
                color: "white", 
                padding: "12px", 
                border: "none", 
                width: "100%",
                borderRadius: "4px",
                cursor: formLoading ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "500"
              }}
            >
              {formLoading ? "Adding Product..." : "Add Product"}
            </button>
            
            {/* Debug Info */}
            <div style={{ 
              marginTop: "15px", 
              padding: "10px", 
              background: "#fff3cd", 
              border: "1px solid #ffeaa7",
              borderRadius: "4px",
              fontSize: "12px"
            }}>
              <strong>Debug Info:</strong>
              <div>Type: {formData.type}</div>
              <div>Category: {formData.category || "Not selected"}</div>
            </div>
          </form>
        </div>

        {/* Products List */}
        <div>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "20px" 
          }}>
            <h3 style={{ margin: 0 }}>Products ({products.length})</h3>
            <div>
              <button 
                onClick={fetchProducts} 
                disabled={loading}
                style={{ 
                  padding: "8px 15px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "10px"
                }}
              >
                {loading ? "🔄 Refreshing..." : "🔄 Refresh List"}
              </button>
            </div>
          </div>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ 
              background: "#f8f9fa", 
              padding: "40px", 
              textAlign: "center", 
              borderRadius: "8px",
              border: "2px dashed #dee2e6"
            }}>
              <p style={{ color: "#6c757d", fontSize: "16px" }}>
                No products found. Add your first product!
              </p>
            </div>
          ) : (
            <div style={{ 
              background: "white", 
              borderRadius: "8px", 
              overflow: "hidden",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#343a40", color: "white" }}>
                  <tr>
                    <th style={{ padding: "12px 15px", textAlign: "left" }}>ID</th>
                    <th style={{ padding: "12px 15px", textAlign: "left" }}>Product</th>
                    <th style={{ padding: "12px 15px", textAlign: "left" }}>Category</th>
                    <th style={{ padding: "12px 15px", textAlign: "left" }}>Type</th>
                    <th style={{ padding: "12px 15px", textAlign: "left" }}>Price</th>
                    <th style={{ padding: "12px 15px", textAlign: "left" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, index) => (
                    <tr 
                      key={p.id} 
                      style={{ 
                        background: index % 2 === 0 ? "#f8f9fa" : "white",
                        borderBottom: "1px solid #dee2e6"
                      }}
                    >
                      <td style={{ padding: "12px 15px", fontWeight: "500" }}>#{p.id}</td>
                      <td style={{ padding: "12px 15px" }}>
                        <strong style={{ display: "block", marginBottom: "5px" }}>{p.name}</strong>
                        <small style={{ color: "#666", fontSize: "13px" }}>
                          {p.description?.substring(0, 60)}...
                        </small>
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        <span style={{ 
                          display: "inline-block",
                          padding: "3px 8px",
                          background: "#e7f5ff",
                          borderRadius: "4px",
                          fontSize: "12px",
                          color: "#0066cc"
                        }}>
                          {p.category}
                        </span>
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        <span style={{ 
                          display: "inline-block",
                          padding: "4px 10px",
                          background: 
                            p.type === 'calibration_block' ? '#e3f2fd' : 
                            p.type === 'flawed_specimen' ? '#f3e5f5' : '#e8f5e8',
                          color: 
                            p.type === 'calibration_block' ? '#1565c0' : 
                            p.type === 'flawed_specimen' ? '#7b1fa2' : '#2e7d32',
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500"
                        }}>
                          {p.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: "12px 15px", fontWeight: "bold", color: "#28a745" }}>
                        ${parseFloat(p.price || 0).toFixed(2)}
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          style={{ 
                            background: "#dc3545", 
                            color: "white", 
                            border: "none", 
                            padding: "6px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "13px"
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Products Summary */}
          {products.length > 0 && (
            <div style={{ 
              marginTop: "15px", 
              padding: "10px", 
              background: "#f8f9fa", 
              borderRadius: "4px",
              fontSize: "14px"
            }}>
              <strong>Summary:</strong>
              <div>Total Products: {products.length}</div>
              <div>Calibration Blocks: {products.filter(p => p.type === 'calibration_block').length}</div>
              <div>Flawed Specimens: {products.filter(p => p.type === 'flawed_specimen').length}</div>
              <div>Validation Blocks: {products.filter(p => p.type === 'validation_block').length}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;