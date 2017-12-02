#!/usr/bin/python

import subprocess
import os

subprocess.call(["python", "generateIndex.py"], cwd=".")
subprocess.call(["python", "createImageMap.py"], cwd="./assets/images")
subprocess.call(["python", "createSoundMap.py"], cwd="./assets/sound/")
subprocess.call(["python", "createAssetsObject.py"], cwd="./assets")
