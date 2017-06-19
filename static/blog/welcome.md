
It's late Sunday night, and as part of prolonging the beginning of the work week, I am writing my first
blog post. I've spent about 4 hours today creating the code to make this happen.

## Here's the tech stack:
- Express
- Harp (so cool, check it out)
- Webpack + Babel
- Nginx + Passenger

It's built using Express.
Webpack is being used to compile all the es6 server code into a nice app.js file.
I like using webpack even for server code. It's nice to have a single executable file, similar to a binary.


-----------
Since the page is mostly going to be static content, I chose to use **harp** to
compile all my views into html for me. This blog post and all the other pages are
written using markdown with css and template I have made. When developing, I use harp as middleware for express, but for deploying it I wrote a hook in webpack to
precompile all the static views into a public folder.

---------------
Right now, express is hardly doing anything, but I want to have it as an option
for posting whatever API's I need for miscellaneous projects, and also to have a playground where I can try out new backend stuff. I love how barebones express is compared to most frameworks.

----------------
For fun, I did implement a session tracking system with mongodb and cookies.
Using PHP as my first server language stunted my understanding of how http servers and client actually communicate with one another, so it was refreshing to write some of those features from scratch and get a feel for how they work. I also implemented a basic authentication middleware, which is another technology I never thought about how it is implemented.

I am looking forward to adding over-engineered content and interactive experiments online.

**Ok. Time for bed.**

`npm run deploy`
