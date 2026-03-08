// api.js
export const BASE_URL = "https://script.google.com/macros/library/d/1SzmTi8gaRoIQ__QOoxNsMn5aaPt5H2b6DpPoxfh2QBcrrLdI2-72DdtT/205";

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

    script.onerror = reject;

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