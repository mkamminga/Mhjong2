import {TileLayout} from '../Models/TileLayout'

export const hybridTileLayout: TileLayout = {
    "Bamboo" : {
        "1" : [0, 0],
        "2" : [0, 1],
        "3" : [0, 2],
        "4" : [0, 3],
        "5" : [0, 4],
        "6" : [0, 5],
        "7" : [0, 6],
        "8" : [0, 7],
        "9" : [0, 8]
    },
    "Character" : {
        "1" : [1, 0],
        "2" : [1, 1],
        "3" : [1, 2],
        "4" : [1, 3],
        "5" : [1, 4],
        "6" : [1, 5],
        "7" : [1, 6],
        "8" : [1, 7],
        "9" : [1, 8]
    },
    //"Dot" : 2,
    "Circle":  {
        "1" : [2, 0],
        "2" : [2, 1],
        "3" : [2, 2],
        "4" : [2, 3],
        "5" : [2, 4],
        "6" : [2, 5],
        "7" : [2, 6],
        "8" : [2, 7],
        "9" : [2, 8]
    },
    'Dragon' : {
        'Green' :   [0, 13],
        'Red' :     [1, 13],
        'White' :   [2, 13]
    },
    'Flower' : {
        'Bamboo' :          [2, 9],
        'Chrysantememum' :  [2, 12],
        'Orchid' :          [2, 10],
        'Plum' :            [2, 13],
    },
    'Season' : {
        'Autumn' : [1, 11],
        'Spring' : [1,  9],
        'Summer' : [1, 10],
        'Winter' : [1, 12]
    },
    'Wind' : {
        'South' :   [0, 10],
        'East' :    [0, 11],
        'West' :    [0, 12],
        'North' :   [0, 9]
    }
};