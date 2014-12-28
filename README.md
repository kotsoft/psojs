pso.js
=====

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/kotsoft/psojs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**pso.js** aims to be a clean and tiny implementation of [Particle Swarm Optimization](http://en.wikipedia.org/wiki/Particle_swarm_optimization). I am currently using it in my neural network library to optimize weights. However, it's flexible enough to be used in many different kinds of optimization problems.

Usage
-----
Creating a swarm is simple. All you need to do is specify the number of particles and the number of parameters you want to optimize. The last argument is the options hash.
```javascript
var numParticles = 30;
var numParams = 20;
var swarm = new PSO.swarm(numParticles, numParams, {
  min: -1,
  max: 1,
  velocityMultiplier: .1,
  springCoefficient: .25,
  bounceCoefficient: .25,
  enableJitter: false,
  jitterRatio: .01,
  fitnessCompare: function(a, b) {
    return a < b;
  }
});
```

The final step is to create an iteration loop.
```javascript
while (true) {
  for (var i in swarm.particles) {
    var fitness = yourMethodOfDeterminingFitness();
    swarm.particles[i].setFitness(fitness);
  }
  
  swarm.update();
}
```

Parameters and Options
-----
`numParticles` Usually the recommended number is 30. I've gotten away with using fewer, so definitely play around with it to see what works for your particular problem.

`numParams` The number of parameters you want to optimize. For a neural network, it would be the total number of weights and biases.

`min` and `max` Use these to define the range you want to search over. **Warning:** I am using a soft bounce at the edges so values may go over slightly.

`velocityMultiplier` How fast you want the particles to go in proportion to the search range.

`springCoefficient` Unless you want to slow things down so you can see the behavior more clearly, I would recommend keeping it as is. Going over will keep it from converging and going lower doesn't improve the search much.

`bounceCoefficient` Increase to 1 for a harder boundary. Set it to 0 if you want no boundary at all.

`enableJitter` and `jitterRatio` For more difficult problems where you find yourself getting stuck at local optima, jittering really helps. When I was using PSO for neural network regression, jittering often helped me converge with errors an order of magnitude lower than with it turned off.

`fitnessCompare` Just define a function that returns true when `a` is considered more fit than `b`. The default returns `true` when `a < b`, which is useful for error minimization problems.
