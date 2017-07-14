/// <reference path="../../node_modules/@types/knockout/index.d.ts" />

import { AlmazApi, ApiPlayer } from '../lib/almaz-api';

ko.bindingHandlers['text-as-pct'] = {
    update: (e, value, all) => {
        const v = ko.unwrap(value());

        if (typeof (v) == 'number')
            (<Element>e).innerHTML = Math.round(Math.max(1, v) * 100).toFixed(0) + '%';
        else
            (<Element>e).innerHTML = '&nbsp;';
    }
}

interface Player {
    readonly nickName: string;
    readonly apiPlayer: any;
}

const getCurrentTeamModel = () => {
    const d = ko.observable<Player>(null);
    const o = ko.observable<Player>(null);
    return {
        numTotalGames: ko.observable<number | null>(null),
        expectedWinProb: ko.observable<number | null>(null),
        historicWins: ko.observable<number | null>(null),
        historicWinRate: ko.observable<number | null>(null),
        defence: d,
        offence: o,
        defenceNickName: ko.computed(() => {
            const v: Player = d();
            return v == null ? null : v.nickName;
        }),
        offenceNickName: ko.computed(() => {
            const v: Player = o();
            return v == null ? null : v.nickName;
        })
    }
}

const getCurrentGameModel = () => {
    return {
        red: getCurrentTeamModel(),
        blu: getCurrentTeamModel(),
        historicGames: ko.observable<number | null>(null)
    }
}

export const getSubmitterModel = () => {
    const url = 'https://foosball-results.herokuapp.com/api/';
    const api = new AlmazApi(url);

    const m: any = {};

    m.currentGame = getCurrentGameModel();
    m.players = ko.observableArray<Player>([]);
    m.gameReady = ko.observable(false);

    whenAllNotNul(m.currentGame.red.defence, m.currentGame.red.offence).then(() => console.log('red'));
    whenAllNotNul(m.currentGame.blu.defence, m.currentGame.blu.offence).then(() => console.log('blu'));

    m.currentGame.red.offence.subscribe((v: any) => console.log(v))

    m.gameReady.subscribe((v: boolean) => {
        if (v) {

        }
    });

    let picksPending: KnockoutObservable<Player>[] = [];

    const resetPicking = () => {
        m.currentGame = getCurrentGameModel();

        picksPending = [
            m.currentGame.red.defence,
            m.currentGame.red.offence,
            m.currentGame.blu.offence,
            m.currentGame.blu.defence
        ]
    }

    m.pick = (player: Player) => {
        let next: KnockoutObservable<Player> | undefined;
        if ((next = picksPending.shift()) != null) {
            next(player);
            m.gameReady(picksPending.length == 0);
        }
    }

    m.isNotPicked = (player: Player) => {
        return m.currentGame.red.defence() != player
            && m.currentGame.red.offence() != player
            && m.currentGame.blu.defence() != player
            && m.currentGame.blu.offence() != player;
    }

    api.getPlayers().then((apiPlayers: ApiPlayer[]) => {
        apiPlayers.forEach(player => {
            m.players.push({
                nickName: uniqueNickName(player, apiPlayers),
                apiPlayer: player,
            })
        });
    });

    resetPicking();

    return m;
};

const uniqueNickName = (player: ApiPlayer, players: ApiPlayer[]) => {
    let nickName = normalizeName(player.firstName);

    if (!players.some(p => p._id != player._id && normalizeName(p.firstName) == nickName))
        return nickName;

    nickName = player.lastName;

    if (!players.some(p => p._id != player._id && p.lastName == nickName))
        return nickName;

    return player.firstName + ' ' + player.lastName;
}

const normalizeName = (name: string) => {
    if ('Mykyta'.indexOf(name) >= 0) return 'Nikita';
    if ('Dmytro'.indexOf(name) >= 0) return 'Dima';
    if ('Andriy;Andrii;Andrey'.indexOf(name) >= 0) return 'Andriy';
    if ('Sergei;Sergii;Serhii;Serge'.indexOf(name) >= 0) return 'Sergii';
    if ('Vova;Volodymyr;Vladimir'.indexOf(name) >= 0) return 'Vova';

    return name;
}

const isNullObservable = <T>(o: KnockoutObservable<T>) => {
    console.log(o(), o() == null);
    return o() == null;
};

const whenAllNotNul = <T>(...observables: KnockoutObservable<T>[]) => {
    const promisify = (o: KnockoutObservable<T>) => {
        return new Promise((resolve, reject) => {
            o.subscribe((v: T) => {
                if (!observables.some(isNullObservable))
                    resolve();
            })
        });
    };
    return Promise.all(observables.map(promisify))
}