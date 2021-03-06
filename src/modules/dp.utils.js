var utils = {
  /**
   * Add or remove the css class "show" from a DOM element
   * @param {object}  elm  - A DOM element
   */
  toggle: function(elm) {
    if (elm.classList.contains("show")) {
      elm.classList.remove('show');
    } else {
      elm.classList.add('show');
    }
  },

  /**
   * simple toggler to add/remove a class that uses CSS3 transition to show/hide an element
   * @param  {string}   handler
   * @param  {string}   targ
   */
  toggler: function(handler, targ) {
    var self = this;
    var elm = document.getElementById(targ);
    document.getElementById(handler).addEventListener('click', function(e) {
      self.toggle(elm);
    }, false);
  },

  /**
   * gets the hostname from a URL string
   * @param  {string}  a full url
   * @return {string}
   */
  getHostname: function(url) {
    // letting the browser give me the hostname, easier than a regex
    // inspired by: http://stackoverflow.com/a/12470263
    var _url = url || "",
      a = document.createElement('a');
    if (_url !== "") {
      a.href = _url;
      return a.hostname;
    } else {
      console.warn('url undefined');
      return false;
    }
  },

  encodeHTML: function(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  },

  addslashes: function(str) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  },

  getJSON: function(req_url, yay, bummer) {
    var data,
      request = new XMLHttpRequest();

    var _noCB = function() {
      console.log('');
    };
    var success = (typeof yay === 'function') ? yay : _noCB;
    var fail = (typeof bummer === 'function') ? bummer : _noCB;

    request.open('GET', req_url, false);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        data = JSON.parse(request.responseText);
        success(data);
      } else {
        fail();
      }
    };

    request.onerror = function() {
      fail();
    };

    request.send(null);
  }
}; // close utils

var Fake$ = function(st) {

  // my simple fake jQuery
  var about = "this is my minimal fake jQuery";

  if (st) {
    if (window === this) {
      return new Fake$(st);
    }

    var x = st.charAt(0);
    if (x === "#") {
      this.el = document.getElementById(st.substring(1));
    } else if (x === ".") {
      var nodeList = document.querySelectorAll(st);
      this.el = Array.prototype.slice.call(nodeList); //to return an array intead of a nodeList
    } else {
      this.el = document.getElementById(st);
    }
    return this.el;
  } else {
    return about;
  }
};
//var $ = Fake$;

/**
 * mini templating library using native html5 templating
 * important to note: since html5 templating is basically a wrapper over documentFragment you need to have content nested 1 level deep.
 * You can't grab innerHTML of the documentFragment itself, but you can for its children.
 * @param  {string} id       id attribute of the template tag
 * @param  {object} tmplData data to be added to the template
 *
 */
var html5tmpl = (function(id, tmplData) {

  var template = document.importNode(document.getElementById(id).content, true);
  var parent = template.children[0]; // grabbing the element that wraps the actual template
  var _tmpl = parent.innerHTML;

  function repl(match, p1, offset, string) {
    return tmplData[p1];
  }

  _tmpl = _tmpl.trim().replace(/\{\{(\w+)\}\}/g, repl);

  var render = function(to) {
    parent.innerHTML = _tmpl;
    document.getElementById(to).appendChild(parent);
  };

  return {
    appendTo: render
  };
});