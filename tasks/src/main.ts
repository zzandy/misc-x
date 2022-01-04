import App from './App.svelte';
import { Task } from './task';
import { at } from './schedule';
import moment from 'moment';

const app = new App({
    target: document.body,
    props: {
        title: "App",
        tasks: getTasks()
    }
})

function getTasks(): Task[] {
    return [
        new Task("Get milk", at(moment(new Date()).add(10, 'hours').toDate())),
        new Task("Chase PRs", at(new Date())),
        new Task("Review comments", at(new Date())),
        new Task("Write task app", at(new Date())),
    ];
}

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