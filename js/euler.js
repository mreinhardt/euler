//============================================================================//
// euler
// Math and data extension for Javascript
// inspired by Project Euler (http://projecteuler.net/)
// @author    Mike Reinhardt
// @created   07/16/2011
// @modified  07/23/2011
// @version   0.02
//============================================================================//

(function(window, document, undefined) {
	
var euler = {

    // returns true if num is prime
    isPrime: function (num) {
        num = +num; // convert String to Number
        if (isNaN(num) || num < 2) return false;
        if (num === 2) return true;
        if (!(num % 2)) return false;
        for (var i = 3, il = Math.sqrt(num); i <= il; i+=2) {
            if (!(num % i)) return false;
        }
        return true;
    },

    // return next lexicographic permutation of array
    permute: function (arr) {
        var a = arr.slice(0),
            al = a.length,
            swap = al - 1,
            pivot = al - 2;

        while (pivot >= 0 && a[pivot] > a[pivot + 1]) { pivot--; }
        if (pivot < 0) return a;

        while (a[pivot] > a[swap]) { swap--; }
        a[pivot] = a[pivot] + a[swap] - (a[swap] = a[pivot]); // swap
        swap = 0;
        for (var i = pivot + 1; i < ~~((al + pivot)/2 + 1); i++, swap++) {
            a[i] = a[i] + a[al - 1 - swap] - (a[al - 1 - swap] = a[i]); // swap
        }
        return a;
    }

};

//============================================================================//
// Data Types
//============================================================================//

// Unisigned integer with no precision bounds
euler.BigUInt = function(sNum) {
    var value = [];
    sNum = sNum + '';

    for (var i = 0, il = sNum.length; i < il; i++) {
        value.push(+sNum[i]);
    }

    this.value = value;
};
euler.BigUInt.prototype = {
    add: function(bui) {
        var tv = this.value,
            bv = bui.value,
            tl = tv.length,
            bl = bv.length,
            longer = tl > bl ? tv.slice(0) : bv.slice(0),
            shorter = tl > bl ? bv.slice(0) : tv.slice(0),
            ll = longer.length,
            diff = Math.abs(tl - bl),
            ans = [], 
            cur;

        for (var i = ll- 1; i >= 0; i--) {
            cur = longer[i] + (shorter[i - diff] ? shorter[i - diff] : 0);
            if (ans.length === ll - i) {
                cur += ans.pop();
            }
            if (cur < 10) {
                ans.push(cur);
            } else {
                ans.push(cur - 10, 1);
            }
        }

        this.value = ans.reverse();
    },

    sub: function(bui) {
        
    },

    mult: function(bui) {
        var ans = new euler.BigUInt('0'),
            tv = this.value,
            bv = bui.value,
            tl = tv.length,
            bl = bv.length,
            pow = '',
            hold, cur;

        for (var i = tl - 1; i >= 0; i--) {
            hold = [];
            for (var j = bl - 1; j >= 0; j--) {
                cur = tv[i] * bv[j];
                if (hold.length === bl - j) {
                    cur += hold.pop();
                }
                if (cur < 10) {
                    hold.push(cur);
                } else {
                    hold.push(cur % 10, ~~(cur / 10));
                }
            }
            if (tl - 1 - i) pow += '0';
            ans.add(new euler.BigUInt(hold.reverse().join('') + pow));
        }

        this.value = ans.value;
    },

    div: function(bui) {
        
    }
};

//============================================================================//
// Data Structures
//============================================================================//

// binary tree cell
euler.BinTree = function(settings) {
    this.value = settings.value;
    this.left = settings.left;
    this.right = settings.right;
};

// @fn weave returns interwoven binary tree object built bottom up from an array
// of the form:       0
//                   / \
//                  1   2
//                 / \ / \
//                3   4   5
//               / \ / \ / \
//              6   7   8   9
// @param ext is an optional function that will be applied to every BinTree cell
// e.g. function() {
//          this.sumChildren = this.left.value + this.right.value;
//      }
// @returns object
// {
//     depth: 4,     // how many levels to the tree
//     remainder: 0, // how many left-over cells on the bottom level
//     l1c0: { value: array[0], left: this.l2c0, right: this.l2c1 },
//     l2c0: { value: array[1], left: this.l3c0, right: this.l3c1 },
//     l2c1: { value: array[2], left: this.l3c1, right: this.l3c2 },
//     ...
//     l4c3: { value: array[9], left: undefined, right: undefined }
// }
euler.BinTree.weave = function(arr, ext) {
    var obj = {},
        curDepth = 1,
        depthCount = 0;

    for (var i = 0, il = arr.length; i < il; i++) {
        if (depthCount >= curDepth) {
            depthCount = 0;
            curDepth++;
        }
        depthCount++;
    }

    obj.depth = curDepth;
    obj.remainder = depthCount >= curDepth ? 0 : depthCount;

    depthCount = obj.remainder ? obj.remainder - 1 : obj.depth - 1;
    for (i = arr.length - 1; i >= 0; i--) {
        obj['l'+curDepth+'c'+depthCount] = new euler.BinTree({
            value: arr[i],
            left: obj['l'+(curDepth+1)+'c'+depthCount],
            right: obj['l'+(curDepth+1)+'c'+(depthCount+1)]
        });
        if (ext) {
            ext.call(obj['l'+curDepth+'c'+depthCount]);
        }
        depthCount--;
        if (depthCount < 0) {
            depthCount = --curDepth - 1;
        }
    }

    return obj;
};

//============================================================================//
// Init
//============================================================================//

// expose euler globally
window.euler = euler;

}(this, this.document));