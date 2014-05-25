```
* JmZ is now known as JmZ_
* Maurice has quit ()
<__joshua___> munumnu: underscore.js is useful for this.  

_.intersect(x,y).length === x.length;  
If you have used pythons itertools, its pretty similar

<ljharb> >> 
var arr1 = [1, 2, 3], 
    arr2 = [2, 3], 
    arr3 = [2, 3, 4]; 
    
var hash = arr1.reduce(function (acc, key) { acc[key] = true; return acc; }, {}); 
[arr2.every(function (key) { return hash[key]; }), 
arr3.every(function (key) { return hash[key]; })] 
@ munumnu

<ecmabot> munumnu: (object) [true, false]
<ljharb> in the midst of underscore's many unnecessary functions, that's one of the useful ones :-) but you could just make your own intersect function with what i have up there ^
<__joshua___> true
<munumnu> thanks :)
<__joshua___> but at 13kb its pretty small
<ljharb> it's not the size of the lib that i object to, it's the sprawling polymorphism, and unnecessarily replicating native functions

```