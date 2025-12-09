// ValidationBlocks.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SimpleProductModal from "./SimpleProductModal";
import "./css/ValidationBlocks.css";

function ValidationBlocks({ category: initialCategory }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const categories = [
    "All",
    "UT Validation Blocks",
    "PAUT and ToFD Validation Blocks",
    "Boiler Tube PAUT Validation Blocks"
  ];

  // Category to URL mapping
  const categoryUrlMap = {
    "All": "/validation-blocks",
    "UT Validation Blocks": "/validation-blocks/ut",
    "PAUT and ToFD Validation Blocks": "/validation-blocks/paut-tofd",
    "Boiler Tube PAUT Validation Blocks": "/validation-blocks/boiler-tube"
  };

  // Update selected category when prop changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const reveal = () => {
      const elements = document.querySelectorAll('.product-card');
      elements.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
          el.classList.add('active');
        }
      });
    };
    
    window.addEventListener('scroll', reveal);
    reveal();
    return () => window.removeEventListener('scroll', reveal);
  }, [products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products?type=validation_block");
      console.log("Fetching validation blocks from:", response.url);
      
      const data = await response.json();
      console.log("Validation blocks response:", data);

      if (data.success) {
        setProducts(data.products || []);
        console.log("Loaded validation blocks:", data.products.length);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching validation blocks:", err);
      setLoading(false);
    }
  };

  // Handle category change with navigation
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const url = categoryUrlMap[category];
    if (url) {
      navigate(url);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    navigate("/validation-blocks");
  };

  // Get page title based on category
  const getPageTitle = () => {
    if (selectedCategory && selectedCategory !== "All") {
      return selectedCategory;
    }
    return "NDT Validation Blocks";
  };

  return (
    <div className="validation-blocks-container">
      <div className="page-container-wrapper">
        
        <div className="page-header">
          <div className="header-content">
            <span className="header-badge">EQUIPMENT VALIDATION</span>
            <h1>{getPageTitle()}</h1>
            <p>
              Precision-engineered validation blocks for equipment calibration, 
              accuracy verification, and NDT method validation
            </p>
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-number">{filteredProducts.length}</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{categories.length - 1}</span>
                <span className="stat-label">Categories</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">ISO</span>
                <span className="stat-label">Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        {selectedCategory !== "All" && (
          <div className="breadcrumb">
            <span onClick={() => navigate("/validation-blocks")} className="breadcrumb-link">
              Validation Blocks
            </span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{selectedCategory}</span>
          </div>
        )}

        <div className="filters-section">
          <div className="filters-header">
            <h2>Browse Validation Blocks</h2>
            <p>Find the perfect validation block for your NDT equipment</p>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search validation blocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="search-clear" onClick={() => setSearchTerm("")}>
                ✕
              </button>
            )}
          </div>

          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {(searchTerm || selectedCategory !== "All") && (
            <div className="active-filters">
              <span className="filters-label">Active filters:</span>
              {selectedCategory !== "All" && (
                <span className="filter-tag">
                  {selectedCategory}
                  <button onClick={() => handleCategoryChange("All")}>×</button>
                </span>
              )}
              {searchTerm && (
                <span className="filter-tag">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm("")}>×</button>
                </span>
              )}
              <button className="clear-all-btn" onClick={clearFilters}>
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Category Info Section */}
        {selectedCategory === "All" && (
          <div className="category-info-section">
            <div className="category-grid">
              <div className="category-info-card" onClick={() => handleCategoryChange("UT Validation Blocks")}>
                <div className="category-icon">🔬</div>
                <h3>UT Validation Blocks</h3>
                <p>Standard calibration blocks for ultrasonic thickness gauges and flaw detectors</p>
                <div className="category-tags">
                  <span>Accuracy Testing</span>
                  <span>Velocity Calibration</span>
                </div>
              </div>
              
              <div className="category-info-card" onClick={() => handleCategoryChange("PAUT and ToFD Validation Blocks")}>
                <div className="category-icon">📐</div>
                <h3>PAUT & ToFD Validation Blocks</h3>
                <p>Complex geometry blocks for phased array and time-of-flight diffraction</p>
                <div className="category-tags">
                  <span>Array Calibration</span>
                  <span>Beam Steering</span>
                </div>
              </div>
              
              <div className="category-info-card" onClick={() => handleCategoryChange("Boiler Tube PAUT Validation Blocks")}>
                <div className="category-icon">⚙️</div>
                <h3>Boiler Tube PAUT Blocks</h3>
                <p>Specialized blocks for tube inspection in boilers and heat exchangers</p>
                <div className="category-tags">
                  <span>Tube Inspection</span>
                  <span>Corrosion Mapping</span>
                </div>
              </div>
            </div>
          </div>
        )}
// Add in each component (ValidationBlocks, ReferenceStandards, FlawedSpecimens)
// After the filters section, before the loading check

<div style={{ margin: "20px 0", padding: "10px", background: "#f5f5f5", borderRadius: "5px" }}>
  <h4>Debug Info:</h4>
  <p>Backend: http://localhost:5000</p>
  <p>Fetch URL: /api/products?type=
    {(() => {
      if (window.location.pathname.includes('validation-blocks')) return 'validation_block';
      if (window.location.pathname.includes('reference-standards')) return 'calibration_block';
      if (window.location.pathname.includes('flawed-specimens')) return 'flawed_specimen';
      return 'unknown';
    })()}
  </p>
  <p>Loaded Products: {products.length}</p>
  <button 
    onClick={() => {
      const url = `http://localhost:5000/api/products?type=${
        window.location.pathname.includes('validation-blocks') ? 'validation_block' :
        window.location.pathname.includes('reference-standards') ? 'calibration_block' :
        'flawed_specimen'
      }`;
      console.log("Testing URL:", url);
      fetch(url)
        .then(res => res.json())
        .then(data => {
          console.log("API Response:", data);
          alert(`Found ${data.products?.length || 0} products`);
        });
    }}
    style={{ marginRight: "10px", padding: "5px 10px" }}
  >
    Test API Connection
  </button>
  <button 
    onClick={() => console.log("Current products:", products)}
    style={{ padding: "5px 10px" }}
  >
    Log Products
  </button>
</div>
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>Loading validation blocks...</span>
          </div>
        ) : (
          <div className="products-container">
            <div className="results-header">
              <span className="results-count">
                Showing {filteredProducts.length} of {products.length} products
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="product-card hardware-accelerated"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div 
                      className="product-image"
                      onClick={() => setSelectedProductId(product.id)}
                    >
                      <img
                        src={`http://localhost:5000${product.image_url}`}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/images/placeholder.jpg";
                        }}
                      />
                      <div className="product-badge">
                        {product.category}
                      </div>
                      <div className="image-overlay">
                        <span className="overlay-icon">🔍</span>
                        <span>Quick View</span>
                      </div>
                    </div>

                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-description">
                        {product.description}
                      </p>
                      
                      <div className="product-specs">
                        {product.material && (
                          <div className="spec-item">
                            <span className="spec-label">Material:</span>
                            <span className="spec-value">{product.material}</span>
                          </div>
                        )}
                        {product.dimensions && (
                          <div className="spec-item">
                            <span className="spec-label">Dimensions:</span>
                            <span className="spec-value">{product.dimensions}</span>
                          </div>
                        )}
                        {product.standards && (
                          <div className="spec-item">
                            <span className="spec-label">Standards:</span>
                            <span className="spec-value">{product.standards}</span>
                          </div>
                        )}
                      </div>

                      <button
                        className="view-details-btn"
                        onClick={() => setSelectedProductId(product.id)}
                      >
                        <span>View Specifications</span>
                        <span className="btn-arrow">→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <div className="no-products-icon">⚙️</div>
                <h3>No {selectedCategory !== "All" ? selectedCategory : "Validation Blocks"} Found</h3>
                <p>
                  {products.length === 0
                    ? "No validation blocks available. Add some from the admin dashboard."
                    : "No products match your current search criteria."}
                </p>
                {products.length > 0 && (
                  <button className="reset-btn" onClick={clearFilters}>
                    Clear Filters & Show All
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {selectedProductId && (
          <SimpleProductModal
            product={products.find((p) => p.id === selectedProductId)}
            onClose={() => setSelectedProductId(null)}
          />
        )}
      </div>
    </div>
  );
}

export default ValidationBlocks;