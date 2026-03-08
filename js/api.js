// api.js
export const BASE_URL = "https://script.google.com/macros/s/AKfycbwE2PWwbDvM_vEvaVk3T0bLqKyefvVXii99wc7Lr_cYI-2uiMO_kVpu-AN1KEJ6Lhd6iA/exec";

export function getRequest(params){

  return new Promise((resolve, reject) => {

    const callbackName = "jsonp_callback_" + Math.round(100000 * Math.random());

    window[callbackName] = function(data){
      delete window[callbackName];
      document.body.removeChild(script);
      resolve(data);
    };

    const query = new URLSearchParams(params).toString();

    const script = document.createElement("script");

    script.src = `${BASE_URL}?${query}&callback=${callbackName}`;

    script.onerror = () => {
        reject(new Error("Falha ao carregar JSONP: " + script.src));
    };

    document.body.appendChild(script);

  });

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