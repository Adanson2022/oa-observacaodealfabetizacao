// api.js
export const BASE_URL = "https://script.google.com/macros/s/AKfycby2QLUorQY7yA9-633cnAZI4vC9DpAVd1WZX5bjE48T_RdQ53Ol6pdFG_HfVhtF7VNHqA/exec";

export async function getRequest(params) {
    const query = new URLSearchParams(params).toString();
    try {
        const res = await fetch(`${BASE_URL}?${query}`);
        return await res.json();
    } catch (err) {
        console.error("Erro no GET:", err);
        return { sucesso: false, erro: err.message };
    }
}

export async function postRequest(action, payload) {

    try {

        const body = new URLSearchParams();

        body.append(
            "data",
            JSON.stringify({
                action,
                payload
            })
        );

        const res = await fetch(BASE_URL, {
            method: "POST",
            body
        });

        return await res.json();

    } catch (err) {

        console.error("Erro no POST:", err);

        return {
            sucesso: false,
            erro: err.message
        };

    }

}