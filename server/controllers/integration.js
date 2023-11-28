
export async function allResources(req, res) {
    let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    }

    try {
        let response = await fetch("http://127.0.0.1:8000/api/resource/", {
            method: "GET",
            headers: headersList
        });
    
        let data = await response.json();
        return res.status(200).json(data)
    }
    catch(e) {
        return res.status(400).json({message: 'Imposible consultar recursos de otras unidades'})
    }

}