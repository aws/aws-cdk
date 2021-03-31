proxy-agent
===========

This is a fork of https://github.com/TooTallNate/node-proxy-agent.

At the time of forking, proxy-agent transitively depended on netmask@1.0.6
via the following dependency chain.

> proxy-agent@4.0.1 → pac-proxy-agent@4.1.0 → pac-resolver@4.1.0 → netmask@1.0.6

netmask@1 has a known vulnerability - CVE-2021-28918 - that affects
proxy auto-config (pac).

A patch has been applied on the original code of node-proxy-agent to remove
support for pac proxies.

When the upstream, namely pack-resolver@^4.1.0 is updated to use netmask@2,
this change fork can be removed and the original dependency tree restored.

License
-------

(The MIT License)

Copyright (c) 2013 Nathan Rajlich &lt;nathan@tootallnate.net&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
