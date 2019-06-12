
const url = 'https://foosball-results.herokuapp.com/api/players';

function send(url, object) {
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(object)
    });
}

function objectify(record) {
    const pair = record.split(" ");
    return { firstName: pair[0], lastName: pair[1] };
}

['player name'].map(objectify).forEach(obj => {
    send(url, obj)
        .catch(e => console.log(e))
        .then(res =>
            console.log(obj.firstName + " " + obj.lastName + ": " + res)
        );
});
