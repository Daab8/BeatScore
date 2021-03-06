# Statistics generator for Beat Saber Party mode

![image](https://user-images.githubusercontent.com/26748457/114684113-e7dd2700-9d10-11eb-9222-c516a3b707cd.png)

## Information
- All scores are generated only from local "Party Mode" data.
- "Top Scores" tables show how many first places does each player have.
- "Full Combos" show how many FCs each player has on unique map/difficulty combinations (for example if the player has three FC on the "Normal" difficulty of "Believer" map, only 1 of these will be counted).
- Song maps that have been deleted still exist in save file, so they are counted in the statistics 
- Each player can see score changes that happened since they reset the change counter

## How to Run
- set environment variable SAVE_PATH to point to the file LocalLeaderboards.dat ( for example: `C:/Users/USER/AppData/LocalLow/Hyperbolic Magnetism/Beat Saber/LocalLeaderboards.dat` )
- if optional environment variable PORT is not specified, `80` will be used
- run either `node app.js` or `npm start`
- in browser, navigate to `localhost:80` (or whichever port you chose)
- webpage should be available on local netword for any connected device
- refresh page (even during playing) to get actual results
  
## Windows start script
Script like this can be run from `.bat` file to automatically start the app in minimized cmd window
```
if not DEFINED IS_MINIMIZED set IS_MINIMIZED=1 && start "" /min "%~dpnx0" %* && exit
cd C:\Users\USER\workspace\BeatScore
cls
SET SAVE_PATH=C:/Users/USER/AppData/LocalLow/Hyperbolic Magnetism/Beat Saber/LocalLeaderboards.dat
node app.js
exit

```
