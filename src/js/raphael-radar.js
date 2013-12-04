Raphael.fn.radarchart = function (data, size, style) {
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
    }//get svg path string for a series

    var break_per = (function bp(n,s) {
        return (s.length <= n) ? s : (s.slice(0, n) + "\n" + bp(n, s.slice(n)));
    });//line break label text every 'n' characters

    var mouseUp = function () { this.animate(cstyle, 150); };
    var mouseOut = function () { this.animate({r: 3.5}, 150); };
    var mouseOver = function () { this.animate({r: 5}, 150); };
    var mouseDown = function () {
        score[this.axis] = this.score;
        ipoly.animate({path: path_string(cx, cy, points, score)}, 200);
    };//animates and registers score changes for single-series models

    this.destruct = function() {
        for(var i = 0, len = st.length; i < len; i += 1) {
            if(st[i][0].localName === "circle") {
                st[i].unmouseout(mouseOut);
                st[i].unmouseup(mouseUp);
                st[i].unmousedown(mouseDown);
                st[i].unmouseover(mouseOver);
            }//unbind all previously attached events
        }
    };

    var st = this.set();
    var w = size.width;
    var h = size.height;
    var cx = w / 2;
    var cy = h / 2;
    var axis = null;
    var max = data.max;
    var legend = data.legend;
    var labels = data.labels;
    var scores = data.scores;
    var pstyle = style.polygon;
    var lstyle = style.label;
    var cstyle = style.circle;
    var sstyle = style.scores;
    var astyle = style.axis;
    var radius = (w < h ? w : h) / Math.PI;
    var angle = 360;
    var sides = scores[0].length;
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
    var slen = scores.length;
    var bottom = points[plen - 1][1];

    for (var i = 0; i < plen; i += 1) {
        x = points[i][0];
        y = points[i][1];
        axis = this.path("M" + cx + " " + cy + "L" + x + " " + y);
        st.push(axis.attr.apply(axis, astyle));
    }//draw inner axes

    for (i = 0; i < plen; i += 1) {
        x = lined_on(cx, points[i][0], 1.3);
        y = lined_on(cy, points[i][1], 1.3);
        this.text(x, y, break_per(3, labels[i])).attr(lstyle);
    }//draw labels

    // draw outer polygon frame
    st.push(this.path(polygon(points)).attr(pstyle));

    for (var k = 0; k < slen; k += 1) {
        var score = scores[k];
        var scstyle = sstyle[k];

        // scale scores
        for (i = 0; i < sides; i += 1) { score[i] /= max; }

        // draws inner poly chart
        var ipoly = this.path(path_string(cx, cy, points, score)).attr(scstyle);
        st.push(ipoly);

        if (slen > 1) {
            for (i = 0; i < plen; i += 1) {
                x = lined_on(cx, points[i][0], score[i]);
                y = lined_on(cy, points[i][1], score[i]);
                st.push(this.circle(x, y, 3.5).attr(cstyle));
            }

            var x1 = cx - 30;
            var y1 = bottom + 50 + 20 * k;
            var x2 = cy + 10;
            var y2 = y1;
            st.push(this.path("M" + x1 + " " + y1 + "L" + x2 + " " + y2).attr(scstyle));
            this.text(x2 + 20, y2, legend[k]).attr(lstyle);
        } else if (slen === 1) {
            for (i = 0; i < plen; i += 1) {
                for (var j = 1; j < 6; j += 1) {
                    x = lined_on(cx, points[i][0], j * 0.2);
                    y = lined_on(cy, points[i][1], j * 0.2);

                    var cl = this.circle(x, y, 3.5).attr(cstyle);
                    cl.axis = i;
                    cl.score = j / 5.0;
                    cl.mouseup(mouseUp);
                    cl.mouseout(mouseOut);
                    cl.mouseover(mouseOver);
                    cl.mousedown(mouseDown);
                    st.push(cl);
                }
            }
        }
    }

    return st;
};
