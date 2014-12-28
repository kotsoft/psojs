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
  springCoefficient: .25,
  bounceCoefficient: .25,
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
