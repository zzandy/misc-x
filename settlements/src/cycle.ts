export function findCycles(graph: [number, number][]): number[][] {
    let cycles: number[][] = [];

    graph.forEach(edge => edge.forEach(node => findNewCycles([node])));

    function findNewCycles(path: number[]) {
        const start_node = path[0];
        let next_node = null;

        // visit each edge and each node of each edge
        for (const edge of graph) {
            const [node1, node2] = edge;

            if (node1 == start_node || node2 == start_node) {
                next_node = node1 === start_node ? node2 : node1;
            } else continue;

            if (!visited(next_node, path)) {
                findNewCycles([next_node].concat(path));
            } else if (path.length > 2 && next_node == path[path.length - 1]) {
                const cycle = rotateToSmallest(path);
                if (isNew(cycle) && isNew(reverse(cycle))) cycles.push(cycle);
            }
        }

        function isNew(path: number[]) {
            const p = JSON.stringify(path);
            for (const cycle of cycles) {
                if (p === JSON.stringify(cycle)) {
                    return false;
                }
            }
            return true;
        }
    }

    return cycles;
}

function reverse(path: number[]) {
    return rotateToSmallest([...path].reverse());
}

// rotate cycle path such that it begins with the smallest node
function rotateToSmallest(path: number[]): number[] {
    const n = path.indexOf(Math.min(...path));
    return path.slice(n).concat(path.slice(0, n));
}

function visited(node: number, path: number[]) {
    return path.indexOf(node) != -1;
}
