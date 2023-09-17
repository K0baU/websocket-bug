let con;
Deno.serve({
    port: 443,
    cert: await Deno.readTextFile("/etc/letsencrypt/live/wab.sabae.cc/fullchain.pem"),
    key: await Deno.readTextFile("/etc/letsencrypt/live/wab.sabae.cc/privkey.pem")
}, async (req) => {
    const upgrade = req.headers.get("upgrade") || "";
    if (upgrade.toLowerCase() == "websocket") {
        const { socket, response } = Deno.upgradeWebSocket(req);
        socket.onopen = () => {
            if (con) {
                con.send("hi");
            }
            con = socket;
        };
        socket.onmessage = (e) => {
            console.log(e.data);
        }
        return response;
    } else {
        const data = await Deno.readTextFile("index.html");
        return new Response(data, { headers: new Headers({ "Content-Type": "text/html" }) });
    }
});