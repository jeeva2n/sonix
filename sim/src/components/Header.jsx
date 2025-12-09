import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaInfoCircle, FaUserTie, FaHome } from "react-icons/fa";
import "./Header.css";
import daksLogo from '../assets/primary/daks.png';
import h4 from '../assets/primary/h4.png';
import h3 from '../assets/primary/h3.png';
import h2 from '../assets/primary/h2.png';
import h1 from '../assets/primary/h1.png';

function Header() {
  const [contactOpen, setContactOpen] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(null);
  const [clickedMenu, setClickedMenu] = useState(null);

  // NEW — which flawed group is open (0 or 1)
  const [openFlawedGroup, setOpenFlawedGroup] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    setIsAdmin(!!token);
    
    const handleStorageChange = () => {
      const token = localStorage.getItem("admin_token");
      setIsAdmin(!!token);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleHomeClick = () => navigate("/");

  const handleAdminClick = () => {
    const token = localStorage.getItem("admin_token");
    if (token) navigate("/admin/dashboard");
    else navigate("/admin/login");
  };

  const handleMenuClick = (menuName) => {
    if (clickedMenu === menuName) {
      setClickedMenu(null);
      setMegaMenuOpen(null);
      setOpenFlawedGroup(null);
    } else {
      setClickedMenu(menuName);
      setMegaMenuOpen(menuName);

      if (menuName !== "flawed-specimens") {
        setOpenFlawedGroup(null);
      }
    }
  };

  // NEW — toggle a flawed group by index
  const toggleFlawedGroup = (index) => {
    setOpenFlawedGroup(openFlawedGroup === index ? null : index);
  };

  const megaMenuData = {
    'reference-standards': {
      title: 'Reference Standards',
      description: 'High-quality calibration blocks for various NDT methods',
      image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=500',
      items: [
        { name: 'UT Calibration blocks', link: '/calibration-blocks/ut' },
        { name: 'PAUT Calibration blocks', link: '/calibration-blocks/paut' },
        { name: 'ToFD Calibration blocks', link: '/calibration-blocks/tofd' },
        { name: 'MT / PT Calibration blocks', link: '/calibration-blocks/mt-pt' },
        { name: 'ET Calibration blocks', link: '/calibration-blocks/et' },
        { name: 'ECT/RFT/MFL Calibration blocks', link: '/calibration-blocks/ect-rft-mfl' },
        { name: 'APR Calibration blocks', link: '/calibration-blocks/apr' },
        { name: 'AUT-Z Calibration blocks', link: '/calibration-blocks/aut-z' }
      ]
    },

    'flawed-specimens': {
      title: 'Flawed Specimens',
      description: 'Precision-manufactured flawed specimens for training and testing',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500',
      isGrouped: true,
      groups: [
        {
          title: "Training and Examination Flawed specimens",
          items: [
            { name: 'Ultrasonic Testing', link: '/flawed-specimens/ultrasonic' },
            { name: 'Dye Penetrant', link: '/flawed-specimens/dye-penetrant' },
            { name: 'Eddy Current', link: '/flawed-specimens/eddy-current' },
            { name: 'Radiography', link: '/flawed-specimens/radiography' },
            { name: 'Visual Testing', link: '/flawed-specimens/visual-testing' },
            { name: 'PAUT & ToFD', link: '/flawed-specimens/paut-tofd' },
            { name: 'Welded Specimens', link: '/flawed-specimens/welded' },
            { name: 'Base Material', link: '/flawed-specimens/base-material' },
            { name: 'Advanced Validation', link: '/flawed-specimens/advanced' },
            { name: 'POD & Training', link: '/flawed-specimens/pod-training' }
          ]
        },
        {
          title: "NDT Flawed Specimens Kit",
          items: [
            { name: 'UT Flawed Specimens Kit', link: '/flawed-specimens/ut-kit' },
            { name: 'NDT Standards Kit', link: '/flawed-specimens/standards-kit' },
            { name: 'MT Flawed Specimens Kit', link: '/flawed-specimens/mt-kit' },
            { name: 'PT Flawed Specimens Kit', link: '/flawed-specimens/pt-kit' },
            { name: 'RT Flawed Specimens Kit', link: '/flawed-specimens/rt-kit' },
            { name: 'ET Flawed Specimens Kit', link: '/flawed-specimens/et-kit' },
            { name: 'PAUT & ToFD Kit', link: '/flawed-specimens/paut-tofd-kit' }
          ]
        }
      ]
    },

    'validation-blocks': {
      title: 'Validation Blocks',
      description: 'Certified validation blocks for equipment calibration',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500',
      items: [
        { name: 'UT Validation Blocks', link: '/validation-blocks/ut' },
        { name: 'PAUT / ToFD Validation Blocks', link: '/validation-blocks/paut-tofd' },
        { name: 'Boiler Tube PAUT Validation blocks', link: '/validation-blocks/boiler-tube' }
      ]
    },

    'resources': {
      title: 'Resources',
      description: 'Technical resources, certifications, and tools for NDT professionals',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
      items: [
        { name: 'Gallery', link: '/resources/gallery' },
        { name: 'Certifications', link: '/resources/certifications' },
        { name: 'Downloads', link: '/resources/downloads' },
        { name: 'PAUT & ToFD Validation Blocks Calculator', link: '/resources/calculator' }
      ]
    },

    'company': {
      title: 'Company',
      description: 'Learn about DAKS NDT Services - Our team, facilities, and vision',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
      items: [
        { name: 'About Us', link: '/company/about' },
        { name: 'Our Team', link: '/company/team' },
        { name: 'Facilities & Infrastructure', link: '/company/facilities' }
      ]
    }
  };

  const handleSubcategoryClick = (link) => {
    setMegaMenuOpen(null);
    setClickedMenu(null);
    setOpenFlawedGroup(null);
    navigate(link);
  };

  const getActiveMenu = () => {
    const path = location.pathname;
    if (path.includes('/calibration-blocks') || path.includes('/reference-standards')) return 'reference-standards';
    else if (path.includes('/flawed-specimens')) return 'flawed-specimens';
    else if (path.includes('/validation-blocks')) return 'validation-blocks';
    else if (path.includes('/resources')) return 'resources';
    else if (path.includes('/company')) return 'company';
    return null;
  };

  const activeMenu = getActiveMenu();

  return (
    <header className="header">
      <div className="header-container">

        {/* Logo */}
        <div className="logo">
          <Link 
            to="/"
            // --- FIXED: Reset state when clicking logo to close any open dropdowns ---
            onClick={() => {
              setClickedMenu(null);
              setMegaMenuOpen(null);
              setOpenFlawedGroup(null);
            }}
          >
            <img src={daksLogo} alt="DAKS NDT Services Logo" className="logo-image" />
          </Link>
        </div>

        {/* Hamburger */}
        <div className="hamburger-menu" onClick={() => setOpenSidebar(true)}>☰</div>

        {/* Desktop Nav */}
        <nav className="main-nav">
          <ul>
            <li className={`has-mega-menu ${activeMenu === 'reference-standards' ? 'active' : ''}`} onClick={() => handleMenuClick('reference-standards')}>
              <Link to="/reference-standards" onClick={(e) => e.preventDefault()}>Reference Standards</Link>
            </li>

            <li className={`has-mega-menu ${activeMenu === 'flawed-specimens' ? 'active' : ''}`} onClick={() => handleMenuClick('flawed-specimens')}>
              <Link to="/flawed-specimens" onClick={(e) => e.preventDefault()}>Flawed Specimens</Link>
            </li>

            <li className={`has-mega-menu ${activeMenu === 'validation-blocks' ? 'active' : ''}`} onClick={() => handleMenuClick('validation-blocks')}>
              <Link to="/validation-blocks" onClick={(e) => e.preventDefault()}>Validation Blocks</Link>
            </li>

            <li className={`has-mega-menu ${activeMenu === 'resources' ? 'active' : ''}`} onClick={() => handleMenuClick('resources')}>
              <Link to="/resources" onClick={(e) => e.preventDefault()}>Resources</Link>
            </li>

            <li className={`has-mega-menu ${activeMenu === 'company' ? 'active' : ''}`} onClick={() => handleMenuClick('company')}>
              <Link to="/company" onClick={(e) => e.preventDefault()}>Company</Link>
            </li>

            <li><Link to="/contact-us">Contact Us</Link></li>
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          <div className="home-button" onClick={handleHomeClick} title="Home"><FaHome /></div>

          <div className="contact-button admin-button" onClick={handleAdminClick} title={isAdmin ? "Admin Dashboard" : "Admin Login"}>
            <FaUserTie />
            <span className="admin-tooltip">{isAdmin ? "Dashboard" : "Login"}</span>
          </div>

          {/* Contact dropdown */}
          <div className="contact-button contact-dropdown-trigger"
               onMouseEnter={() => setContactOpen(true)}
               onMouseLeave={() => setContactOpen(false)}
          >
            <FaInfoCircle />
            <span className="dropdown-arrow">▼</span>

            {contactOpen && (
              <div className="contact-panel-dropdown">
                {/* (...existing content unchanged...) */}
                <div className="contact-company-info">
                  <h3 className="company-title">DAKS NDT Services</h3>
                  <p className="company-subtitle">Advanced Non-Destructive Testing Solutions • Inspection • Safety • Reliability</p>
                  <p className="contact-label">Address</p>
                  <p>Babu Garden, No.163,<br />Narasimman Street, 2nd St,<br />Sikkarayapuram, Tamil Nadu 600128<br />India</p>
                  <p className="contact-label">Phone</p><p>087784 23621</p>
                  <p className="contact-label">Email</p><p>jeevaoff22@gmail.com</p>
                  <p className="contact-label">Hours</p><p>Open 24 Hours</p>
                  <br /><h3 className="company-title">NDT Services Offered</h3>
                  <ul className="ndt-services-list">
                    <li>Ultrasonic Testing (UT)</li>
                    <li>Radiographic Testing (RT)</li>
                    <li>Magnetic Particle Testing (MT)</li>
                    <li>Dye Penetrant Testing (PT)</li>
                    <li>Visual Inspection (VT)</li>
                    <li>Eddy Current Testing (ECT)</li>
                  </ul>
                </div>

                <div className="contact-get-in-touch">
                  <h3>Get in Touch With Us</h3>
                  <div className="contact-panel-item">
                    <img src={h1} alt="Support" className="contact-item-image" />
                    <div><h4>NDT Inspection Support</h4><p>Fast and reliable service.</p></div>
                  </div>
                  <div className="contact-panel-item">
                    <img src={h2} alt="Areas" className="contact-item-image" />
                    <div><h4>Service Areas</h4><p>We provide on-site NDT services.</p></div>
                  </div>
                  <div className="contact-panel-item">
                    <img src={h3} alt="Career" className="contact-item-image" />
                    <div><h4>Careers</h4><p>Join our professional team.</p></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MEGA MENU */}
      {megaMenuOpen && megaMenuData[megaMenuOpen] && (
        <div
          className="mega-menu-dropdown"
          onClick={(e) => {
            if (e.target.classList.contains('mega-menu-dropdown')) {
              setClickedMenu(null);
              setMegaMenuOpen(null);
              setOpenFlawedGroup(null);
            }
          }}
        >
          <div className="mega-menu-container">
            <div className="mega-menu-content">

              <div className="mega-menu-left">
                <h2 className="mega-menu-title">{megaMenuData[megaMenuOpen].title}</h2>
                <p className="mega-menu-description">{megaMenuData[megaMenuOpen].description}</p>

                {/* GROUPED FLAWED SPECIMENS */}
                {megaMenuData[megaMenuOpen].isGrouped ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {megaMenuData[megaMenuOpen].groups.map((group, gIndex) => (
                      <div key={gIndex}>
                        
                        {/* CLICKABLE GROUP TITLE */}
                        <h4
                          style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "10px", cursor: "pointer" }}
                          onClick={() => toggleFlawedGroup(gIndex)}
                        >
                          {group.title} {openFlawedGroup === gIndex ? "▲" : "▼"}
                        </h4>

                        {/* ONLY OPEN SELECTED GROUP */}
                        {openFlawedGroup === gIndex && (
                          <div className="mega-menu-links">
                            {group.items.map((item, index) => (
                              <div
                                key={index}
                                className="mega-menu-link"
                                onClick={() => handleSubcategoryClick(item.link)}
                              >
                                <span className="link-arrow">→</span>{item.name}
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                ) : (
                  /* OTHER MENUS NORMAL */
                  <div className="mega-menu-links">
                    {megaMenuData[megaMenuOpen].items.map((item, index) => (
                      <div key={index} className="mega-menu-link" onClick={() => handleSubcategoryClick(item.link)}>
                        <span className="link-arrow">→</span>{item.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mega-menu-right">
                <img src={megaMenuData[megaMenuOpen].image} alt={megaMenuData[megaMenuOpen].title} className="mega-menu-image" />
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MOBILE SIDEBAR (unchanged) */}
      <div className={`mobile-sidebar ${openSidebar ? "active" : ""}`}>
        {/* (...your existing unchanged mobile code...) */}
        { /* I did not change anything in mobile section */ }
      </div>

      <div className={`sidebar-overlay ${openSidebar ? "active" : ""}`} onClick={() => setOpenSidebar(false)} />
    </header>
  );
}

export default Header;