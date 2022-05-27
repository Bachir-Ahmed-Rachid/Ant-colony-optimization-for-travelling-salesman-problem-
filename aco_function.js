module.exports.ACO= function (fourmisNumber,Tho_0,alpha,beta,rho,Q,NCmax,distances){
    let pheromonesMatrix = [];
    let tabou = [];
    let tabou_best = [];
    let Lk = [];
    let Lk_best = [];
    function choosNextNode(actualeNode, actualeList, distance, pheromone) {
        let proba = [];
        let denominator = 0;
        let numirator = 0;
        let unvisitedNode = [];
        for (let i = 0; i < distance.length; i++) {
            if (actualeList.indexOf(i) === -1) {
                unvisitedNode.push(i);
            }
        };
        for (let i = 0; i < distance.length; i++) {
            if (i !== actualeNode && actualeList.indexOf(i) === -1) {
                denominator += Math.pow(pheromone[actualeNode][i], alpha) * Math.pow(1 / distance[actualeNode][i], beta)
            }
        };
        for (let i = 0; i < distance[actualeNode].length; i++) {
            if (i !== actualeNode && actualeList.indexOf(i) === -1) {
                numirator = Math.pow(pheromone[actualeNode][i], alpha) * Math.pow(1 / distance[actualeNode][i], beta);
                proba.push(numirator / denominator);
            }
        };
        let indiceMax = 0;
        let maxProb = proba[indiceMax];
        for (let i = 0; i < proba.length; i++) {
            if (proba[i] >= maxProb) {
                indiceMax = i;
                maxProb = proba[i];
            }
        };
        return unvisitedNode[indiceMax];
    };


    function tabooLongeur(distance, array) {
        somme = 0;
        for (let i = 0; i < distance.length - 1; i++) {
            somme += distance[array[i]][array[i + 1]];
        }
        return somme;
    };

    //update tho
function update_tho(P, old_tho, array_taboo, array_Lk, Q) {
    let new_tho = [];
    for (let i = 0; i < distances.length; i++) {
        new_tho[i] = [];
        for (let j = 0; j < distances.length; j++) {
            if (i !== j) {
                new_tho[i][j] = (1 - P) * old_tho[i][j];
            }
        }
    };
   for (let i = 0; i < array_Lk.length; i++) {
        for (let j = 0; j < array_taboo[i].length - 1; j++) {
            new_tho[array_taboo[i][j]][array_taboo[i][j + 1]] += Q / array_Lk[i];
        }
        new_tho[array_taboo[i][array_Lk.length]][array_taboo[i][0]] = Q / array_Lk[i];

    }
    return new_tho;
    };


    //initialise pheromonesMatrix with tho0 and tabou matrix

    for (let i = 0; i < distances.length; i++) {
    pheromonesMatrix[i] = []
    for (let j = 0; j < distances.length; j++) {
        if (i !== j) {
            pheromonesMatrix[i][j] = Tho_0;
        }
    }
    };
    for (let i = 0; i < fourmisNumber; i++) {
    tabou_best[i] = [];
    Lk_best[i] = 10000000000;
    };
    // the cycle star
    for (let t = 0; t < NCmax; t++) {
    //first elemnts of the tabou array
    for (let i = 0; i < fourmisNumber; i++) {
        tabou[i] = [];
        tabou[i][0] = i;
    }
    //the rest of elemnts+calcule of tabou longeur
    for (let i = 0; i < fourmisNumber; i++) {
        for (let j = 1; j < distances.length; j++) {
            tabou[i][j] = choosNextNode(tabou[i][j - 1], tabou[i], distances, pheromonesMatrix);
        }
        tabou[i].push(tabou[i][0]);
        Lk[i] = (tabooLongeur(distances, tabou[i]));
    }
    for (let i = 0; i < fourmisNumber; i++) {
        if (Lk[i] < Lk_best[i]) {
            Lk_best[i] = Lk[i];
            tabou_best[i] = tabou[i];
        }
    }
    pheromonesMatrix = update_tho(rho, pheromonesMatrix, tabou, Lk, Q);
    };
    

    let indiceMin = 0;
        let max_Lk_best = Lk_best[indiceMin];
        for (let i = 0; i < Lk_best.length; i++) {
            if (Lk_best[i] < max_Lk_best) {
                indiceMin = i;
                max_Lk_best = Lk_best[i];
            }
        };

        tabou_best = tabou_best.map(x => x.map(y => y + 1));


    return([tabou_best[indiceMin],Lk_best[indiceMin]]);


}