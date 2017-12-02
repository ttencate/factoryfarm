#!/usr/bin/python2

import subprocess
import os

subprocess.call(["python2", "generateIndex.py"], cwd=".")
subprocess.call(["python2", "createImageMap.py"], cwd="./assets/images")
subprocess.call(["python2", "createSoundMap.py"], cwd="./assets/sound/")
subprocess.call(["python2", "createAssetsObject.py"], cwd="./assets")
