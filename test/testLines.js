// < begin copyright > 
// Copyright Ryan Marcus 2017
// 
// This file is part of humanLines.
// 
// humanLines is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// humanLines is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with humanLines.  If not, see <http://www.gnu.org/licenses/>.
// 
// < end copyright > 
const assert = require("assert");
const humanLines = require("../index.js");
const Canvas = require("canvas");

describe("drawLines", function() {
    it("should create some non-white pixels", function() {
        const canvas = new Canvas(500, 500);
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, 500, 500);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 500, 500);
        
        ctx.strokeStyle = "black";
        humanLines.drawLine(ctx, 50, 50, 300, 350);

        const data = ctx.getImageData(0, 0, 500, 500).data;
        for (let x of data) {
            if (x != 255) {
                // good!
                return;
            }
        }

        assert.fail("Did not find any non-white pixels!");
    });

    it("should create some non-white pixels when textured", function() {
        const canvas = new Canvas(500, 500);
        const ctx = canvas.getContext('2d');

        global["document"] = {};
        global["document"]["createElement"] = function () {
            return new Canvas(500, 500);
        };
        
        const texture = humanLines.generatePencilTexture();
        const pattern = ctx.createPattern(texture, 'repeat');
        ctx.strokeStyle = pattern;

        
        ctx.clearRect(0, 0, 500, 500);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 500, 500);
        
        humanLines.drawLine(ctx, 50, 50, 300, 350);

        const data = ctx.getImageData(0, 0, 500, 500).data;
        for (let x of data) {
            if (x != 255) {
                // good!
                return;
            }
        }

        assert.fail("Did not find any non-white pixels!");
    });
});
