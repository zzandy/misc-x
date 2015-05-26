<!DOCTYPE html>

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title></title>
</head>
    <body>
        <script type="text/javascript">

            var a = 100;

            function line(ctx, angle1, offst1, angle2, offst2) {
                //debugger;
                var h = a / 5;
                var w = a / 2 / Math.sqrt(3);
                offst1 *= 2/4*w;
                offst2 *= 2/4*w;

                var styles = [
                    { width: a/10, color: 'red' },
                    { width: a / 15, color: 'white' }
                ];


                styles.forEach(function(style) {

                    ctx.save();
                    ctx.lineWidth = style.width;
                    ctx.strokeStyle = style.color;

                    ctx.beginPath();

                    ctx.rotate(angle1);
                    ctx.moveTo(offst1, -a / 2);
                    ctx.bezierCurveTo(offst1, -h,
                        offst2 * Math.cos(angle2) + h * Math.sin(angle2),
                        offst2 * Math.sin(angle2) - h * Math.cos(angle2),
                        offst2 * Math.cos(angle2) + a / 2 * Math.sin(angle2),
                        offst2 * Math.sin(angle2) - a / 2 * Math.cos(angle2)
                    );

                    ctx.stroke();
                    ctx.restore();
                });
            }

            function render(deltas) {

                var w = a / 2 / Math.sqrt(3);

                var el = document.createElement('canvas');
                el.width = 4*w+2;//+ 'px';
                el.height = a +2;// + 'px';

                document.body.appendChild(el);

                var ctx = el.getContext('2d');

                ctx.translate(1+2*w, 1+ a/2);

                //var deltas = toDeltas(sequence);

                deltas.map(function(d) {
                    line(ctx,
                    ((d[0] / 2) | 0) * Math.PI / 3, -1 + 2 * (d[0] % 2),
                    ((d[1] / 2) | 0) * Math.PI / 3, -1 + 2 * ((d[0] + d[1]) % 2));
                });

                ctx.beginPath();
                ctx.moveTo(w, -a / 2);
                ctx.lineTo(2 * w, 0);
                ctx.lineTo(w, a / 2);
                ctx.lineTo(-w, a / 2);
                ctx.lineTo(-2 * w, 0);
                ctx.lineTo(-w, -a / 2);
                ctx.closePath();

                ctx.stroke();
            }

            // Convert outlet map (0 1 0 1 2 2) to deltas ((2 0) (2 1) (1 4))
            function toDeltas(seq) {

                var k = 0;
                var past = [];
                var res = [];
                do {

                    var out = seq[k];
                    var next = -1;

                    for (var i = k + 1; i < seq.length; ++i) {

                        if (seq[i] == out) {
                            res.push([k, i - k]);
                            past.push(out);
                        } else if (next == -1) {
                            next = i;
                        }

                    }

                    k = next;

                } while (next != -1);

                return res;

            }

            function printDelta(delta){return '('+delta.map(function(d){return d[0]+', '+d[1]}).join('), (')+')'}

            function rotDelta(delta, num) {
                var res = [];

                for (var i = 0; i < delta.length; ++i) {
                    var d = delta[(delta.length + i - num) % delta.length];
                    var t = (d[0] + 2) % 12;
                    res.push([t, d[1]]);

                }

                return res;
            }

            function deltaValid(delta) {

                return delta.every(function(d, i, a) {
                    return i == 0 || a[i - 1][1] >= d[1];
                });


                return delta.every(function(d) { return d[0] < 12 && d[0] + d[1] < 12 });

            }

            function deltaKey(delta) {
                return delta.map(function(d) { return d[1] }).join(' ');
            }

            function iter(res, seed, num) {
                var first = -1;

                for (var i = 0; i < seed.length; ++i) {
                    if (seed[i] == -1)
                    {
                        first = i;
                        break;
                    }
                }

                if (first == -1) {
                    var delta = toDeltas(seed);

                    var pass = true;

                    for (var i = 1; i < 6; ++i) {
                        var key = deltaKey(rotDelta(delta, i));

                        if (key in res) {
                            pass = false;
                            break;
                        }
                    }

                    var key = deltaKey(delta);

                    if (pass)
                        res[key] = delta;
                }
                else {
                    for (var i = first + 1; i < seed.length; ++i) {
                        if (seed[i] == -1) {
                            var newseed = seed.slice(0);
                            newseed[first] = newseed[i] = num;

                            iter(res, newseed, num + 1);
                        }
                    }
                }
            }

            var res = {};
            var seed = [];

            for (var i = 0; i < 12; ++i) seed.push(-1);

            var start = (new Date()).getTime();
            iter(res, seed, 0);

            var n = 0;
            for (var x in res) {
                render(res[x]);
                ++n
            }

            console.log(n, (((new Date()).getTime() - start)/1000).toFixed(2));

        </script>

    </body>
</html>