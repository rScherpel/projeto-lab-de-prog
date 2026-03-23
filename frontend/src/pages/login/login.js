export const handleLoginSubmit = async (email, password, rememberMe, navigate) => {
  const response = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (data.token) {
    if (rememberMe) {
      localStorage.setItem("token", data.token);
    } else {
      sessionStorage.setItem("token", data.token);
    }
    alert("Login realizado!");
    navigate("/home");
    return true;
  } else {
    alert(data.message);
    return false;
  }
};
