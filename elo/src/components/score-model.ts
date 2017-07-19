/// <reference path="../../node_modules/@types/knockout/index.d.ts" />

const getScoreSideModel = () => {

    const score = ko.observable<number | null>(null);

    const extendedScore = ko.computed({
        read: () => {
            const v = score();
            return v != null && v > 3 ? v : 'more';
        },
        write: (value) => {
            if (typeof (value) === 'number')
                score(value);
            else
                score(null);
        }
    });

    const isActive = (n: number) => {
        return score() == n;
    };

    const setScore = (n: number) => {
        score(n);
    }

    return { score: score, extendedScore: extendedScore, isActive: isActive, setScore: setScore };
}

export const getScoreModel = () => {
    return {
        red: getScoreSideModel(),
        blu: getScoreSideModel()
    }
};