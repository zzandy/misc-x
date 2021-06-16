import App from './App.svelte';

const app = new App({
    target: document.body,
    props: {
        title: "App"
    }
})


function rnd(a: number): number;
function rnd(a: number, b: number): number;
function rnd<T>(a: T[]): T;
function rnd(a: any[] | number, b?: number) {
    if (a instanceof Array) {
        return a[Math.random() * a.length | 0];
    }

    if (b === undefined) {
        return (a * Math.random()) | 0;
    }

    return (a + (b - a) * Math.random()) | 0;
}