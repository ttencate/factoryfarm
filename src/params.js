
params = {
    debug: false,
    proxLimit: 20000,
    needD2: 10000,
    needCheckTime: 4000,
    chickWalkRange: 400,
    grassSearchRadius: 15,
    pCluck: 0.25,
    criticalNeed: 30,
    // fed factors
    hunger: 0.13,
    eatSpeed: 0.005,
    pShit: 1,
    // happy factors
    pavedImpact: 70,
    filthImpact: 0.4,
    crowdImpact: 10,
    // farmer parameters
    grabReach: 20,
    grabAreaSize: 35,
    interactDist: 80,
    indicatorSize: 32,

    yearDurationMilliseconds: 60000,
    rentPerTile: 1,
    basePriceUnripe: 10,
    basePriceRipe: 40,
    topQualityPriceRipe: 80,
    ripeMinAgeYears: 3,
    ripeMaxAgeYears: 4,
    deathAgeYears: 5,
};
params.monthDurationMilliseconds = params.yearDurationMilliseconds / 12;

zLevels = {
    background: 1000,
    seller: 1730,
    player: 1700,
    chicken: 1670,
    markers: 1670,
    walls: 1680,
    roof: 1900,
};

costs = {
  chicken: 30,
  fence: 4,
  feeder: 55,
};
