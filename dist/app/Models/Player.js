"use strict";
var Player = (function () {
    function Player(_id, id, name) {
        this._id = _id;
        this.id = id;
        this.name = name;
        if (_id) {
            this.id = _id;
        }
    }
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=Player.js.map