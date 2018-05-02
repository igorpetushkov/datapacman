var keyMirror = require('keymirror');

module.exports = {
    STORE_SIZE: 25,
    TREE_SIZE: 10,

    StoreType: keyMirror({
        RAM: null,
        TREE: null
    }),

    EventPriority: {
        DEFAULT: 0,
        STORE: 1,
        TREE: 1,
        VIEW: 2
    },

    PlanetName: keyMirror({
        RAM: null
    }),

    TreeName: keyMirror({
       TREE: null
    }),

    PlanetEvent: keyMirror({
        RAM_REFRESH: null,
        RAM_ADD: null,
        RAM_UPDATE: null,
        RAM_SELECT: null
    }),

    TreeEvent: keyMirror({
        TREE_GET_ALL: null,
        TREE_ADD: null,
        TREE_REMOVE: null,
        TREE_SELECT: null
    })
};
