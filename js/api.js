// api.js
export const BASE_URL = "https://script.google.com/macros/s/AKfycbzgg3gxIcktefqeGTnNJozMm7C6fNqjgNtldVDJ_hooiTlxv0UJnYWyHUUIyigB7-YL5A/exec";

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
        delete window[callbackName];
        document.body.removeChild(script);
        reject(new Error("Falha ao carregar JSONP: " + script.src));
    };

    document.body.appendChild(script);

  });

}

export async function postRequest(action, payload) {

    try {

        const body = new URLSearchParams();
        console.log("POST enviado.", {
            action,
            payload
        });
        body.append(
            "data",
            JSON.stringify({
                action,
                payload
            })
        );

        const res = await fetch(BASE_URL, {
            method: "POST",
            mode: "no-cors", //apagar isso aqui depois quando mudarmos para domínio próprio
            body
        });

        //return await res.json(); quando parar de usar o no-cors posso retomar essa linha e apagar a debaixo dessa.
        return { sucesso: true}

    } catch (err) {

        console.error("Erro no POST:", err);

        return {
            sucesso: false,
            erro: err.message
        };

    }

}