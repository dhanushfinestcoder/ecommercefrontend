import React from "react";

const googleLogin = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/google";
};

const Home = () => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
  };

  const headingStyle = {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "1rem",
  };

  const buttonStyle = {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#4285F4", // Google's blue color
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const buttonHoverStyle = {
    backgroundColor: "#357AE8",
  };

  const button = React.useRef(null);

  const handleMouseEnter = () => {
    button.current.style.backgroundColor = buttonHoverStyle.backgroundColor;
  };

  const handleMouseLeave = () => {
    button.current.style.backgroundColor = buttonStyle.backgroundColor;
  };

  return (
    <div style={containerStyle}>
      {/* Add your image here */}
      <img
        src="/assets/Free.png"
        alt="Ecommerce App"
        style={{ width: "150px", height: "auto", marginBottom: "1rem" }}
      />
      <h2 style={headingStyle}>Welcome to Ecommerce App</h2>
      <button
        ref={button}
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={googleLogin}
      >
        Login With Google
      </button>
    </div>
  );
};

export default Home;
