const BASE = "http://localhost:5000/v1/api";

async function handleResponse(res) {
    const data = await res.json();

    if(!res.ok) throw data;
    
    return data;
}

export const api = {
    getAssets: (params = {}) => {
        const query = new URLSearchParams(params).toString();

        return fetch(`${BASE}/assets${query ? `?${query}` : ""}`)
            .then(handleResponse);
    },

    getAsset: (id) => fetch(`${BASE}/assets/${id}`).then(handleResponse),

    ingestAsset: (body) =>
        fetch(`${BASE}/assets`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(body),
        }).then(handleResponse),

    updateStatus: (id, status) =>
        fetch(`${BASE}/assets/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        }).then(handleResponse),

    getStats: () => fetch(`${BASE}/stats`).then(handleResponse),
};