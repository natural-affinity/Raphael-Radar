Raphael.fn.radarchart = function (data, size, ids) {
    "use strict";

    function polygon(points) {
        var path = "M100 100";

        for (var i = 0, len = points.length; i < len; i += 1) {
            path += ((i === 0) ? "M" : "L") + points[i][0] + " " + points[i][1];

            if (i === len - 1) {
                path += "L" + points[0][0] + " " + points[0][1];
            }
        }

        return path;
    }//get polygon container path

    function lined_on(origin, base, bias) {
        return origin + (base - origin) * bias;
    }//get position along radar line

    function path_string(cx, cy, points, score) {
        var x, y, vertex = [];

        for (var i = 0, len = points.length; i < len; i += 1) {
            x = lined_on(cx, points[i][0], score[i]);
            y = lined_on(cy, points[i][1], score[i]);
            vertex.push(x + " " + y);
        }

        return "M" + vertex.join("L") + "L" + vertex[0];
    }//get SVG path string for a series

    var break_per = (function bp(n,s) {
        return (s.length <= n) ? s : (s.slice(0, n) + "\n" + bp(n, s.slice(n)));
    });//line break label text every 'n' characters

    var st = this.set();
    var w = size.width;
    var h = size.height;
    var cx = w / 2;
    var cy = h / 2;
    var max = data.max;
    var labels = data.labels;
    var score = data.scores;
    var radius = (w < h ? w : h) / Math.PI;
    var angle = 360;
    var sides = score.length;
    var edgeLength = 2 * radius * Math.sin(Math.PI / sides);
    var x = cx + edgeLength / 2;
    var y = cy + radius * Math.cos(Math.PI / sides);
    var points = [[x, y]];

    for (var side = 1; side < sides; side += 1) {
        angle -= 360 / sides;
        x += edgeLength * Math.cos(Raphael.rad(angle));
        y += edgeLength * Math.sin(Raphael.rad(angle));
        points.push([x, y]);
    }

    var plen = points.length;


    for (var i = 0; i < plen; i += 1) {
        x = points[i][0];
        y = points[i][1];
        st.push(this.path("M" + cx + " " + cy + "L" + x + " " + y).attr("stroke", "#777"));
    }//draw inner axes

    for (i = 0; i < plen; i += 1) {
        x = lined_on(cx, points[i][0], 1.3);
        y = lined_on(cy, points[i][1], 1.3);
        this.text(x, y, break_per(3, labels[i])).attr({fill: "#555"});
    }//draw labels

    //draw outer polygon frame
    st.push(this.path(polygon(points)).attr({"stroke": "#555", "stroke-width": "3"}));

    // Regularises scores
    for (i = 0; i < score.length; i += 1) { score[i] /= max; }

    // Draws chart
    var ipoly = this.path(path_string(cx, cy, points, score));
    ipoly.attr({"fill": "#f90", "fill-opacity": "0.8",
                "stroke-width": "2", "stroke": "#a64"});
    st.push(ipoly);

    var mouseUp = function () { this.animate({fill: "#888"}, 150); };
    var mouseOut = function () { this.animate({r: 3.5}, 150); };
    var mouseOver = function () { this.animate({r: 5}, 150); };
    var mouseDown = function () {
        score[this.axis] = this.score;
        $('#' + this.related_id).val(this.score * max);
        ipoly.animate({path: path_string(cx, cy, points, score)}, 200);
    };

    for (i = 0; i < plen; i += 1) {
        for (var j = 1; j < 6; j += 1) {
            x = lined_on(cx, points[i][0], j * 0.2);
            y = lined_on(cy, points[i][1], j * 0.2);

            var cl = this.circle(x, y, 3.5).attr({'fill': '#888','stroke-width': '0'});
            cl.axis = i;
            cl.score = j / 5.0;
            cl.related_id = ids ? ids[i] : null;
            cl.mouseup(mouseUp);
            cl.mouseout(mouseOut);
            cl.mouseover(mouseOver);
            cl.mousedown(mouseDown);
            st.push(cl);
        }
    }

    return st;
};
