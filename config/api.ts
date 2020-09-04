
const host = 'https://mhapi.coldrain.top'

export default (input: RequestInfo, init?: RequestInit): Promise<Res> => {
    return fetch(host + input, init).then(res => res.json())
}