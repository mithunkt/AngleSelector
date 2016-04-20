/**
 * @classdesc This is an implementation of angle selector which can be used to select angle.
 *
 * @class SketchBoard
 * @param {Object} options Valid options are "container", "sizes",
 *                         "colors", "toolsPosition". @see "Members" section for details
 *
 * @example
 *
 * var angleselector = new AngleSelector({
 *         container: $("#container"),
 *         direction: -1
 * });
 *
 * @author Mithun KT
 * @version 1.0
 *
 * @license The MIT License (MIT)
 *
 * Copyright (c) 2015 Mithun KT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function (factory, globalScope) {

    "use strict";

    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["jquery", "underscore"], factory);
    } else {
        // Browser globals
        globalScope.AngleSelector = factory(globalScope.jQuery, globalScope.d3);
    }
})(function ($, d3) {

    "use strict";

    return function AngleSelector(options) {

        var _domNode;
        var _dragFlag = false;
        var _dial, _dialContainer, _arrow, _display, _needle;
        var _radius;
        var _config = {};

        /**
         * Creating controlls which support sketch tool
         *
         * @memberof SketchBoard
         */
        var create = function () {
            _domNode = $(_config.container);
            _dialContainer = $("<div class='angleselector-dialcontainer'></div>").appendTo(_domNode);
            _radius = _dialContainer.width() > _dialContainer.height() ?
                _dialContainer.height() / 2 : _dialContainer.width() / 2;
            var _dialSVG = d3.selectAll(_dialContainer).append("svg");
            _dialSVG.attr("height", _dialContainer.height()).attr("width", _dialContainer.width());

            _dialSVG.append("circle")
                .attr("cx", _dialContainer.width() / 2)
                .attr("cy", _dialContainer.height() / 2)
                .attr("r", 5)
                .style("fill", "red");

            _dial = _dialSVG.append("circle").attr("class", "angleselector-dial")
                .attr("cx", _dialContainer.width() / 2)
                .attr("cy", _dialContainer.height() / 2)
                .attr("r", _radius)
                .style("fill", "transparent")
                .style("stroke", "#eee");
            var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            var interval = 360 / data.length;
            _dialSVG.append("g")
                .attr("transform", "translate(" + _dialContainer.width() / 2 + "," + _dialContainer.height() / 2 + ")")
                .selectAll("g").data(data)
                .enter()
                .append("circle")
                .attr("fill", "steelblue")
                .attr("r", 5)
                .attr("transform", function (d, i) {
                    return "translate(" + ((_dialContainer.width() / 2 - 5) * Math.cos((interval * i) * Math.PI / 180)) + "," + ((_dialContainer.width() / 2 - 5) * Math.sin((interval * i) * Math.PI / 180)) + ")";
                });

            _arrow = _dialSVG.append("g").attr("class", "angleselector-arrow");
            _needle = _arrow.append("line").attr("class", "angleselector-needle").style("stroke", "#cc0707")
                .attr("x1", _dialContainer.width() / 2).attr("y1", _dialContainer.height() / 2)
                .attr("x2", (_dialContainer.width() / 2))
                .attr("y2", (_dialContainer.height() / 2 - (_radius)));
            _arrow.append("path")
                .attr("class", "point")
                .attr("d", d3.svg.symbol().type("triangle-up"))
                .attr("transform", "translate(" + (_dialContainer.width() / 2) + "," + (_dialContainer.height() / 2 - _radius) + ")")
                .style("fill", "#cc0707");

            _display = $("<div class='angleselector-display'></div").appendTo(_domNode);
        };

        var registerEvents = function () {
            _dial.on("click", function () {
                rotateNeedle(d3.event);
            });
            _dial.on("mousedown", function () {
                _dragFlag = true;
            });
            /*_dial.on("mousemove", function () {
                if (_dragFlag) {
                    rotateNeedle(d3.event);
                }
            });*/
            _dial.on("mouseup", function () {
                _dragFlag = false;
            });
        };

        var rotateNeedle = function (event) {
            var angle = getPoint(event);
            _display.html(angle + " Degree");
            _arrow.transition().duration(300)
                .attr("transform", "rotate(" + angle + " " + _dialContainer.width() / 2 + "," + _dialContainer.height() / 2 + ")");
        };

        var getPoint = function (event) {
            var opposite = (_dialContainer.offset().top + (_dialContainer.height() / 2) - event.clientY);
            var adjacent = (event.clientX) - (_dialContainer.offset().left + (_dialContainer.width() / 2));
            opposite = _config.direction > -1 ? opposite : -opposite;
            var angleInRadian = Math.atan(opposite / adjacent);
            var angle = angleInRadian * 180 / Math.PI;
            if (adjacent < 0 && opposite >= 0) {
                angle += 180;
            } else if (opposite < 0 && adjacent < 0) {
                angle -= 180;
            }
            return roundAngle(angle + 90);
        };

        var roundAngle = function (angle) {
            return Math.round(angle);
        };

        /**
         * Init this instance. Called once at startup.
         *
         * @memberof SketchBoard
         */
        var init = function () {
            _config = $.extend(true, _config, options);
            create();
            registerEvents();
        };

        init.call(this);
    };
}, this);