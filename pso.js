var PSO = PSO || {};

PSO.Swarm = function(numParticles, numParams, options) {
  this.numParticles = numParticles;
  this.numParams = numParams;
  
  options = options || {};
  this.min = options.min || -1;
  this.max = options.max || 1;
  this.springCoefficient = options.springCoefficient || .25;
  this.bounceCoefficient = options.bounceCoefficient || .25;
  this.inertia = options.inertia || .9;
  this.jitterRatio = options.jitterRatio || .01;
  this.fitnessCompare = options.fitnessCompare || function(a, b) {
    return a < b;
  };
  
  this.range = this.max - this.min;
  this.velocityRange = this.range * .5;
  this.numJitters = Math.ceil(this.jitterRatio * numParticles * numParams);
  
  this.particles = new Array(numParticles);
  
  for (var i = 0; i < numParticles; i++) {
    this.particles[i] = new PSO.Particle(this);
  }
}

PSO.Swarm.prototype = {
  update: function() {
    // Find the global best
    var globalBest = this.particles[0];
    
    for (var i = 1; i < this.numParticles; i++) {
      if (this.fitnessCompare(this.particles[i].fitness, globalBest.fitness)) {
        globalBest = this.particles[i];
      }
    }
    
    // Update particles
    for (var i = 0; i < this.numParticles; i++) {
      this.particles[i].update(globalBest);
    }
    
    // Jitter
    for (var i = 0; i < this.numJitters; i++) {
      //var randomIndex = parseInt(Math.random() * this.numParticles);
      //this.particles[randomIndex].jitter();
    }
  }
}

PSO.Particle = function(swarm) {
  this.swarm = swarm;
  
  this.fitnessCurrent = 0;
  this.fitnessBest = 0;
  this.hasHistory = false;
  
  this.params = new Array(swarm.numParams);
  this.paramsBest = new Array(swarm.numParams);
  this.velocities = new Array(swarm.numParams);
  
  // Initialize with parameters and velocities
  for (var i = 0; i < swarm.numParams; i++) {
    this.params[i] = swarm.min + Math.random() * swarm.range;
    this.velocities[i] = swarm.velocityRange * (Math.random() - Math.random());
  }
};

PSO.Particle.prototype = {
  setFitness: function(fitness) {
    this.fitnessCurrent = fitness;
  },
  update: function(globalBest) {
    var swarm = this.swarm;
    
    // Save parameters if current fitness is better than historical best
    if (!this.hasHistory || swarm.fitnessCompare(this.fitnessCurrent, this.fitnessBest)) {
      this.hasHistory = true;
      this.fitnessBest = this.fitnessCurrent;
      for (var i = 0; i < swarm.numParams; i++) {
        this.paramsBest[i] = this.params[i];
      }
    }
    
    for (var i = 0; i < swarm.numParams; i++) {
      var globalDiff = globalBest.params[i] - this.params[i];
      var localDiff = this.paramsBest[i] - this.params[i];
      
      // Accelerate towards global and historical bests
      this.velocities[i] += swarm.springCoefficient * (Math.random() * globalDiff + Math.random() * localDiff);
      this.velocities[i] *= swarm.inertia;

      this.params[i] += this.velocities[i];
      
      // Bounce off boundaries
      if (this.params[i] > swarm.max) {
        this.velocities[i] += swarm.bounceCoefficient * (swarm.max - this.params[i]);
      } else if (this.params[i] < swarm.min) {
        this.velocities[i] += swarm.bounceCoefficient * (swarm.min - this.params[i]);
      }
    }
  },
  jitter: function() {
    var swarm = this.swarm;
    var randomIndex = parseInt(Math.random() * swarm.numParams);
    
    if (Math.random() < .5) {
      this.velocities[randomIndex] = swarm.velocityRange * (Math.random() - Math.random());
    } else {
      this.params[randomIndex] = swarm.min + Math.random() * swarm.range;
    }
  }
};