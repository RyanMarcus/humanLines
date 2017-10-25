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
const blur = require('glur');
const seedrandom = require("seedrandom");


module.exports.generatePencilTexture = generatePencilTexture;
function generatePencilTexture() {
    // Meraj et al. didn't publish their co-occr matrix, so we can't
    // exactly replicate what they did. Instead, we'll just use smoothed
    // noise.

    const width = 300;
    const height = 300;
    const buffer = new Uint8ClampedArray(width*height*4);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const val = Math.random() * 120;
            const pos = (y * width + x)*4;
            buffer[pos] = val;
            buffer[pos+1] = val;
            buffer[pos+2] = val;
            buffer[pos+3] = 255; // alpha channel
        }
    }

    blur(buffer, width, 2);

    const root = (global && global.document
                  ? global.document : document);
    
    const canvas = root.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    
    const idata = ctx.createImageData(width, height);
    idata.data.set(buffer);

    ctx.putImageData(idata, 0, 0);
    
    return canvas;
}

function timeToPoint(sx, sy, fx, fy, t) {
    // scale the time value, which should be between 0 and 2, to 0 and 1
    const tau = t / 2.0;
    const polyTerm = 15 * Math.pow(tau, 4)
              - 6 * Math.pow(tau, 5)
              - 10 * Math.pow(tau, 3);
    
    return {"x": sx + (sx - fx) * polyTerm,
            "y": sy + (sy - fy) * polyTerm};
    
}


function getSquiggle(prev, next, seed=seed) {
    // find the midpoint
    const midpoint = {"x": (prev.x + next.x) / 2,
                      "y": (prev.y + next.y) / 2};

    // displace by a random value between -5 and 5
    // the paper calls to do this w.r.t. the normal of the line
    // but we'll just do it on the circle.
    let rng = Math.random;
    if (seed) {
        rng = seedrandom(seed);
    }
    
    const displacementX = rng() * 10 - 5;
    const displacementY = rng() * 10 - 5;
    
    midpoint.x += displacementX;
    midpoint.y += displacementY;

    return midpoint;
}

module.exports.drawLine = drawLine;
function drawLine(ctx, sx, sy, fx, fy, seed=false, drawPoints = false) {
    
    const dist = Math.sqrt(Math.pow(sx - fx, 2) + Math.pow(sy - fy, 2));
    let dt = false;
    if (dist < 200) {
        dt = 0.5;
    } else if (dist < 400) {
        dt = 0.3;
    } else {
        dt = 0.2;
    }

    let lastPoint = {"x": sx, "y": sy};
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    
    for (let t = 0; t <= 2.0; t += dt) {
        const currentPoint = timeToPoint(sx, sy, fx, fy, t);
        const squiggleControlPoint = getSquiggle(lastPoint, currentPoint, seed=seed);
        ctx.quadraticCurveTo(squiggleControlPoint.x, squiggleControlPoint.y,
                             currentPoint.x, currentPoint.y);

        if (drawPoints) {
            ctx.fillStyle = "black";
            ctx.fillRect(currentPoint.x - 4, currentPoint.y - 4, 8, 8);
            ctx.fillStyle = "red";
            ctx.fillRect(squiggleControlPoint.x - 4,
                         squiggleControlPoint.y - 4, 8, 8);
        }
        
        lastPoint = currentPoint;
    }
    ctx.stroke();
}

module.exports.drawRect = drawRect;
function drawRect(ctx, x, y, w, h, seed=false) {
    drawLine(ctx, x,     y    , x + w, y    , seed=seed);
    drawLine(ctx, x + w, y    , x + w, y + h, seed=seed);
    drawLine(ctx, x + w, y + h, x    , y + h, seed=seed);
    drawLine(ctx, x    , y + h, x    , y    , seed=seed);
}

