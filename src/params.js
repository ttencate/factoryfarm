var params = {
	debug: false,
	proxLimit: 144*144,
  proxLimitLow: 100*100,
	needD2: 64*64,
	needCheckTime: 4000,
	chickWalkRange: 400,
	grassSearchRadius: 15,
	pCluck: 0.25,
	criticalNeed: 30,
	repelForce: 0.001,
	repelForceThreshold: 0.0005,
	repelForceDistance: 40,
	// fed factors
	hunger: 100/30 / 1000, // eat once every 30 seconds (= 2 times per year = $0.66/year)
	feedTime: 2000, // milliseconds needed to eat an empty belly full
	pShit: 1,
	// happy factors
	pavedImpact: 70,
	filthImpact: 0.4,
	crowdImpact: 10,
	// farmer parameters
	grabReach: 20,
	grabAreaSize: 35,
	interactDist: 40,
	indicatorSize: 32,
	cleanFilthAmount: 20,
	cleanFilthAmountPaved: 60,

	yearDurationMilliseconds: 60000,
	rentPerTile: 0.25,
	basePriceUnripe: 5,
	basePriceRipe: 15,
	topQualityPriceRipe: 30,
	ripeAgeYears: 2,
	overripeAgeYears: 3,
	deathAgeYears: 4,
};

params.monthDurationMilliseconds = params.yearDurationMilliseconds / 12;

var zLevels = {
	background: 1000,
	paths: 1001,
	floor: 1002,
	filth: 1003,
	highlight: 1100,
	seller: 1730,
	player: 1700,
	chicken: 1670,
	markers: 1670,
	walls: 1680,
	roof: 1900,
	house: 1900,
	popup: 5000,
};
