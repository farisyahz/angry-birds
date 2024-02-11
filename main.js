const matterContainer = document.getElementById("matter-container");
const thicness = 60;

// module aliases
let Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;

// create an engine
let engine = Engine.create();

// create a renderer
let render = Render.create({
  element: matterContainer,
  engine: engine,
  options: {
    width: matterContainer.clientWidth,
    height: matterContainer.clientHeight,
    background: "#fff",
    wireframes: false,
    showAngleIndicator: true,
  },
});

// ground, right wall, and left wall
let ground = Bodies.rectangle(
  matterContainer.clientWidth / 2,
  matterContainer.clientHeight + thicness / 2,
  30000,
  thicness,
  { isStatic: true }
);
let rightWall = Bodies.rectangle(
  matterContainer.clientWidth + thicness / 2,
  matterContainer.clientHeight / 2,
  thicness,
  matterContainer.clientHeight * 10,
  { isStatic: true }
);
let leftWall = Bodies.rectangle(
  -thicness / 2,
  matterContainer.clientHeight / 2,
  thicness,
  matterContainer.clientHeight * 10,
  { isStatic: true }
);

// create bird
let bird = Bodies.circle(400, 800, 30, { restitution:0.5})

// create slingshot
let slingShot = Matter.Constraint.create({
  pointA : {
      x: 300,
      y: 900
  },
  bodyB: bird,
  stiffness: 0.1,
  length:100,
  render:{
      strokeStyle:"black"
  }
})

// create obstacle
let side = 60;
for(let i = 0; i < 5; i++){
    let box = Bodies.rectangle(1300, side + (i)*side, side, side*2, {restitution:0})
    Composite.add(engine.world, box)
}
for(let i = 0; i < 5; i++){
    let box = Bodies.rectangle(1200, side + (i)*side, side, side*2, {restitution:0})
    Composite.add(engine.world, box)
}
let rect = Bodies.rectangle(1250, 0, 200, side)
Composite.add(engine.world, rect)

// add all of the bodies to the world
Composite.add(engine.world, [ground, rightWall, leftWall, slingshot, bird]);

// create mouse constraint to make objects interactive
let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constaint: {
    stiffness: 0.5,
    render: {
      visible: true,
    },
  },
});
Composite.add(engine.world, mouseConstraint);


// run the renderer
Render.run(render);

// create runner
let runner = Runner.create();

// run the engine
Runner.run(runner, engine);

// Make the canvas resizable and responsive
function handleResize(matterContainer) {
  render.canvas.width = matterContainer.clientWidth;
  render.canvas.height = matterContainer.clientHeight;

  Matter.Body.setPosition(
    ground,
    Matter.Vector.create(matterContainer.clientWidth / 2, matterContainer.clientHeight + thicness / 2)
  );
  Matter.Body.setPosition(
    rightWall,
    Matter.Vector.create(matterContainer.clientWidth + thicness / 2, matterContainer.clientHeight / 2)
  );
  Matter.Body.setPosition(leftWall, Matter.Vector.create(-thicness / 2, matterContainer.clientHeight / 2));
}

function handleLaunch(){
    setTimeout(()=>{
        slingShot.bodyB = null
        slingShot.render.strokeStyle = "transparent"
    }, 20)
}

window.addEventListener("resize", () => handleResize(matterContainer));

window.addEventListener("click", () => handleLaunch())


