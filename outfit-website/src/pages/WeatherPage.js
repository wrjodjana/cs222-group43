const apiKey = process.env.GOOGLE_API_KEY;

export const WeatherPage = () => {
  const divStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100vh",
  };

  const textStyle = {
    fontSize: "32px",
  };

  const inputStyle = {
    width: "400px",
    height: "50px",
    borderRadius: "20px",
    padding: "10px 10px 10px 20px",
    fontSize: "18px",
  };

  return (
    <div style={divStyle} class="topnav">
      <p style={textStyle}>Search your location!</p>
      <input style={inputStyle} type="text" placeholder="Search" />
    </div>
  );
};
