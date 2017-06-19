EvoJs is an evolutionary algorithm library written in coffeescript for node or browsers.

## What are Evolutionary Algorithms?

Evolutionary algorithms are optimization methods that mimics how evolution works to find a solution. It uses concepts such as mutations, fitness, and crossbreeding to optimize a solution. It is especially useful when the solution is space is large and complex, with the potential for unexpected solutions.

## Links
 - [evo.js on github](http://github.com/aprowe/evo)
 - [eco.js on npm](https://www.npmjs.com/package/evo-js)

## Tech Used
 - CoffeeScript
 - Grunt
 - Jasmine

### From the README:

The tool is used through a `population` object. Here is a simple example

```
    // Instantiate a population object
    var population = evo.population();

    var evaluateGenes = function (genes) {
      /* Use genes to return a score */
    }

    // Define a method to evaluate genes and return the fitness
    // 'genes' is an array of floats
    population.on('run', function(genes){
        return evaluateGenes(genes); // Supply this method to evaluate the genes
    });

    // Run with a stopping criteria
    population.run({generations: 10});

    // Get the best genes
    var result = population.bestGenes();
```
