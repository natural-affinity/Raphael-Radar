Raphael.fn.polygon = function (points) {
    "use strict";
    var path = "M100 100";
    var i, len = points.length;

    for (i = 0; i < len; i += 1) {
      path += ((i === 0) ? "M" : "L") + points[i][0] + " " + points[i][1];

      if (i === len - 1) {
        path += "L" + points[0][0] + " " + points[0][1];
      }
    }

    return this.path(path);
}; //draw polygon container

function lined_on(origin, base, bias) {
    "use strict";
    return origin + (base - origin) * bias;
} //fetch position along radar line

function path_string(cx, cy, points, score) {
    "use strict";
    var i, x, y, len = points.length, vertex = [];

    for (i = 0; i < len; i += 1) {
        x = lined_on(cx, points[i][0], score[i]);
        y = lined_on(cy, points[i][1], score[i]);
        vertex.push(x + " " + y);
    }

    return "M" + vertex.join("L") + "L" + vertex[0];
} //fetch SVG path string for a series

function break_per(n, s) {
    "use strict";
    return (s.length <= n) ? s : (s.slice(0, n) + "\n" + break_per(n, s.slice(n)));
} //line break label text every 'n' characters

Raphael.fn.radarchart = function (x, y, radius, sides, params, score, labels, ids, max)
{
    // Saves a point of center
    var cx = x;
    var cy = y;

    // Genarates points of the chart frame
    var angle = 360;
    var edgeLength = 2 * radius * Math.sin(Math.PI / sides);
    x += edgeLength / 2;
    y += radius * Math.cos(Math.PI / sides);
    var points = [[x,y]];
    for(side = 1; side < sides; side++) {
        angle -= 360 / sides;
        rads = angle * (Math.PI / 180);
        x = x + edgeLength * Math.cos(rads);
        y = y + edgeLength * Math.sin(rads);
        points.push([x,y]);
    }

    // Regularises scores
    for( var i = 0; i < scores.length; i++){ scores[i] /= max}

    var st = this.set(); // A set to compose elements of a frame

    // Draws measures of the chart
    for( var i = 0; i < points.length; i++){
      var x = points[i][0];
      var y = points[i][1];
      st.push( this.path("M " + cx + " " + cy + " L " + x + " " + y).attr("stroke", "#777"));
    }

    // Draws chart
    var value = this.path( path_string( cx, cy, points, score));
    value.attr("fill","#f90");
    value.attr("fill-opacity","0.8");
    value.attr("stroke-width", "2");
    value.attr("stroke", "#a64");
    st.push(value);

    // Draws a frame of the chart and sets styles it
    var poly = this.polygon(points);
    poly.attr("stroke", "#555");
    poly.attr("stroke-width", "3");
    st.push(poly);

    if(labels){
      for( var i = 0; i < points.length; i++){
        var x = lined_on( cx, points[i][0], 1.3);
        var y = lined_on( cy, points[i][1], 1.3);
        this.text( x, y, break_per( 3, labels[i])).attr({fill:"#555"})
      }
    }

    if(ids){
      for( var i = 0; i < points.length; i++){
        var s = "";
        for( var j = 1; j < 6; j++){
          var x = lined_on( cx, points[i][0], j * 0.2);
          var y = lined_on( cy, points[i][1], j * 0.2);
          var cl = this.circle(x,y,3.5).attr({'fill':'#888','stroke-width':'0'}).mousedown(
            function(){
              score[this.axis] = this.score;
              $('#' + this.related_id).val(this.score * max);
              value.animate({path: path_string( cx, cy, points, score)},200);
            }
          ).mouseover(
            function(){
              this.animate({r: 5}, 150);;
            }
          ).mouseout(
            function(){
              this.animate({r: 3.5}, 150);;
            }
          ).mouseup(
            function(){
              this.animate({fill:"#888"}, 150);;
            }
          );
          cl.axis = i;
          cl.score = j / 5.0;
          cl.related_id = ids ? ids[i] : null;
          st.push(cl);
        }
      }
    }
    return st;
};

function radar( id, w, h, score, labels, ids, max){
  var center_x = w / 2;
  var center_y = h / 2;
  var shorter  = (w < h) ? w : h;
  var r = shorter / Math.PI;
  var n = score.length;

  var paper = Raphael( id, w, h);
  var bg    = paper.rect(0, 0, w, h, 0);
  var chart = paper.radarchart( center_x, center_y, r, n, 0, score, labels, ids, max);
  chart.rotate(0, center_x, center_y);

  bg.attr("gradient", "270-#fff-#fff:40-#ddd");
  bg.attr("stroke-width", "0");
};
