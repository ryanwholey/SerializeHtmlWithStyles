'use strict';

module.exports = (function () {

    // Mapping between tag names and css default values lookup tables. This allows to exclude default values in the result.
    var defaultStylesByTagName = {};

    // Styles inherited from style sheets will not be rendered for elements with these tag names
    var noStyleTags = { 'BASE': true, 'HEAD': true, 'HTML': true, 'META': true, 'NOFRAME': true, 'NOSCRIPT': true, 'PARAM': true, 'SCRIPT': true, 'STYLE': true, 'TITLE': true };

    var forEach = function (collection, callback) {
        return [].forEach.call(collection, callback);
    };

    function getTagNames() {
        var tagsObj = {},
            tagsArr = [];

        (function inspectNode(node) {
            if (!noStyleTags[node.tagName]) {
                tagsObj[node.tagName.toUpperCase()] = true;
            }
            forEach(node.children, function (child) {
                return inspectNode(child);
            });
        })(document.body);

        for (name in tagsObj) {
            tagsArr.push(name);
        }
        return tagsArr;
    }

    function computeDefaultStyleByTagName(tagName) {
        var defaultStyle = {},
            element = document.body.appendChild(document.createElement(tagName)),
            computedStyle = window.getComputedStyle(element);

        forEach(computedStyle, function (styleName) {
            return defaultStyle[styleName] = computedStyle[styleName];
        });

        document.body.removeChild(element);
        return defaultStyle;
    }

    function getDefaultStyleByTagName(tagName) {
        tagName = tagName.toUpperCase();
        if (!defaultStylesByTagName[tagName]) {
            defaultStylesByTagName[tagName] = computeDefaultStyleByTagName(tagName);
        }
        return defaultStylesByTagName[tagName];
    };

    function serializeHtmlWithStyles(elem) {

        var tagNames = getTagNames(),
            cssTexts = [],
            elements,
            computedStyle,
            defaultStyle,
            result;

        forEach(tagNames, function (tagName) {
            if (!noStyleTags[tagName]) {
                defaultStylesByTagName[tagName] = computeDefaultStyleByTagName(tagName);
            }
        });

        elements = elem.querySelectorAll('*');

        forEach(elements, function (el, i) {
            if (!noStyleTags[el.tagName]) {
                computedStyle = window.getComputedStyle(el);
                defaultStyle = getDefaultStyleByTagName(el.tagName);
                cssTexts[i] = el.style.cssText;

                forEach(computedStyle, function (cssPropName) {
                    if (computedStyle[cssPropName] !== defaultStyle[cssPropName]) {
                        el.style[cssPropName] = computedStyle[cssPropName];
                    }
                });
            }
        });

        result = elem.outerHTML;

        forEach(elements, function (el, i) {
            el.style.cssText = cssTexts[i];
        });

        return result;
    };
    return serializeHtmlWithStyles;
}());