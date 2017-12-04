module.exports = {
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": "off",
        "linebreak-style": "off",
        "quotes": "off",
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars": "off",
        "no-mixed-spaces-and-tabs": "off",
    },
    "globals": {
        // true to allow overwriting
        "Crafty": false,
        "Game": true,
        "tileMatrix": true,
        "tileSize": true,
        "getTile": true,
        "params": true,
        "costs": true,
        "zLevels": true,
        "utility": true,
        "assetsObject": true,
        "imageMap": true,
        "femaleNames": true,
        "soundMap": true,
        "player": true,
        "globalGrimness": true,
        "mycolors": true,
        "fontFamily1": true,
        "mutemusic": true,
        "TileMaps": false,
    },
};
