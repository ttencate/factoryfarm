#!/usr/bin/python

import os
import re

indexFile = open('index.html', 'w')


header = """<!DOCTYPE html>
<html>
    <head>
        <title>Factory Farm</title>
    <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
    <meta content="utf-8" http-equiv="encoding">
        <link rel="stylesheet" type="text/css" href="stylesheet.css" />
        <!-- font -->
    <link rel="shortcut icon" type="image/x-icon" href="assets/images/favoicon.png"> 
    <!-- <link href='http://fonts.googleapis.com/css?family=Lobster' rel='stylesheet' type='text/css'> -->
    <!--   <meta name="viewport"   content="width=device-width, user-scalable=no, initial-scale=1.0" /> -->
    <script src="node_modules/craftyjs/dist/crafty.js"></script>
"""
footer = """    <script>
      window.addEventListener('load', Game.start);
    </script>
    
    <!--  Thumbnail voor Facebook enzo. ;) -->
    <link rel="image_src" href="scrshot.png"/>  
  </head>
  <body>
        <!--Add your own HTML!-->   
        
    <div id="canvascontainer">  
    <div id="cr-stage"></div>
    </div>
    <!--<div><p><h1>Game Title</h1></p></div>-->
    <div>
      <p>Made by Thomas & Jelle with the <a href="http://craftyjs.com">Crafty library</a> 
            <!-- for <a href="http://www.ludumdare.com/compo/ludum-dare-40/?action=preview&uid=18490">Ludum Dare 40</a> with the theme 'The more you have, the worse it is'.</p> -->
      <p> <a href="http://jellenauta.com/games/">Return to the game page</a></p> 
    </div>
    
  </body>
</html>"""

try:
  jsRegex = re.compile('.*\.js');
  indexFile.write(header)
  for root, dirs, files in os.walk('./src/'):
    for name in files:
      indexFile.write('    <script src="');
      indexFile.write(os.path.join(root, name));
      indexFile.write('"></script>\n');
  for root, dirs, files in os.walk('./assets/'):
    for name in files:
      if jsRegex.match(name):
        indexFile.write('    <script src="');
        indexFile.write(os.path.join(root, name));
        indexFile.write('"></script>\n');

  indexFile.write(footer)

finally:
  indexFile.close()