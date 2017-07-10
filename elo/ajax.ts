
type HttpVerb = "GET" | "POST" | "PUT" | "DELETE";

export function request(verb: HttpVerb, url: string, data: any = null): Promise<any> {
    return new Promise(function (resolve, reject) {
        let http = new XMLHttpRequest();

        http.open(verb, url, true);
        http.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                if (http.status == 200) {
                    resolve(JSON.parse(http.responseText));
                }
                else {
                    reject(verb + ' ' + url + ': ' + http.statusText + '. ' + http.responseText);
                }
            }
        }

        if (data)
            http.send(JSON.stringify(data));
        else http.send(null);
    });
}

export function postJson(url: string, data: any) {
    return request('POST', url, data);
}

export function getJson(url: string) {
    return request('GET', url);
}
