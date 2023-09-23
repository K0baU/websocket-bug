const cons = new Set();
Deno.serve({
    port: 443,
    cert: await Deno.readTextFile("tls/server.crt"),
    key: await Deno.readTextFile("tls/server.key")
}, async (req) => {
    const upgrade = req.headers.get("upgrade") || "";
    if (upgrade.toLowerCase() == "websocket") {
        const { socket, response } = Deno.upgradeWebSocket(req);
        socket.onopen = () => {
            cons.forEach((con) => {
                con.send("hi");
            });
            cons.add(socket);
        };
        socket.onmessage = (e) => {
            console.log("e.data", e.data);
        }
        return response;
    } else {
        const data = await Deno.readTextFile("index.html");
        return new Response(data, { headers: new Headers({ "Content-Type": "text/html" }) });
    }
});