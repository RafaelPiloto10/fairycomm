let server = location.hostname == "localhost" || location.hostname == "127.0.0.1" ? "http://localhost:3000" : "www.fairycomm.tech";
fetch(server + "/auth").then(response => response.json()).then(response => {
    if (!response.authenticated) {
        window.location.replace("/login");
        console.error("Could not authenticate with server");
    }
}).catch((err) => {
    console.log(err);
    window.location.replace("/login");
    console.error("Error: There was an error trying to authenticate with server");
});