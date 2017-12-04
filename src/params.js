
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

    yearDurationMilliseconds: 40000,
    rentPerTile: 1,
    basePriceUnripe: 5,
    basePriceRipe: 15,
    topQualityPriceRipe: 30,
    ripeAgeYears: 3,
    overripeAgeYears: 4,
    deathAgeYears: 6,
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
    house: 1900,
    popup: 5000,
};

costs = {
  chicken: 10,
  fence: 1,
  feeder: 50,
};
