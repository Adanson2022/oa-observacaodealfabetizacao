// api.js
export const BASE_URL = "https://script.google.com/macros/s/AKfycbyuzuNZ6UUF4kiDxp5RgPO4Wpv-F0HDz47hNFSTHMpJ1jihkS-LZf--dzVvUW-3eSNS_g/exec";

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
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, payload })
        });
        return await res.json();
    } catch (err) {
        console.error("Erro no POST:", err);
        return { sucesso: false, erro: err.message };
    }
}