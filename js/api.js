export const API_URL = "https://script.google.com/macros/s/AKfycbxxKYTfx9Pt_aeIeaV48XIGH3Ix-HZ53GwK6WQ4rhtaErhMaGHm9LHLGaZYG0wChfNciA/exec";

export async function postRequest(action, payload = {}) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, payload })
        });

        const result = await response.json();
        if (!result.sucesso) throw new Error(result.erro || "Erro desconhecido");
        return result.data;

    } catch (error) {
        console.error("Erro API (POST):", error);
        alert("Erro de comunicação com servidor");
        throw error;
    }
}

export async function getRequest(params = {}) {
    try {
        const url = new URL(API_URL);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        const response = await fetch(url.toString());
        const result = await response.json();
        if (!result.sucesso) throw new Error(result.erro || "Erro desconhecido");
        return result.data;

    } catch (error) {
        console.error("Erro API (GET):", error);
        alert("Erro de comunicação com servidor");
        throw error;
    }
}