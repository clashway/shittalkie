## Wall of Shame - Which friend played the worst last night?

This project is currently in development. Users can find their Fortnite stats and compare them to their buddies side by side.

## Installation and Setup Instructions

Clone down this repository. You will need `node` and `npm` installed globally on your machine.  

Installation:

`npm install`  

To Start Server:

`npm start`  

To Visit App:

`localhost:3000`  

## Tools Used

  - ReactJS 16.4
  - Redux / React-Redux
  - CSSModules
  - MaterialUI
  - Axios
  - Babel/Webpack
  - NodeJS / Express engine
  - Firebase Cloud Functions
  - Firebase RTDB
  - Create-React-App ejected

#### My take on this project:  

This was a 5-day enthusiastic project based on a recurring theme my buddies and I would discuss throughout our days about who played well and who didn't in the video games from the night before. I knew games like Fortnite, Rocket League and R6: Siege had public APIs, and I knew there were sites out there that you could look up those stats so I figured I'd give it a shot in creating something specifically tendered towards us.

The difference between this app and some of the others out there, is a critical feature was having the delta of "The night before", which I built into the middleware data storage in Google Firebase. Having that delta data allows me to do simple calculations against baseline vs current stats and have those discussions around "Man, what happened last night?"

I explored many different facets of React, from managing state via prop methods and stateful/functional components, higher order components, lifecycle hooks and integrating helpful libraries like redux and react-router. CSSModules was great. Next time though, or maybe with updates to this, I'm going to try styled components as an alternative approach. MaterialUI was also very easy to integrate and play with, and I may of overused it in some cases and run into areas where overriding the inherited css properties with !importants was not ideal.

I've gone through multiple iterations of tightening up state, and also recently abstracted out the initial prototype that was focused purely on 1 game to accommodate a multitude of games. 

#### Things to do: 
1. I want to audit the components and see where PureComponents/componentShouldUpdate checks would be appropriate to optimize lifecycles.
2. Finish the abstraction of rocket league
3. Port over to styled components rather than cssmodules to see what the hype about CSS-in-JS is about.
4. Add authentication and persistent player management (should be easy with Firebase building new express endpoints for posting) 
