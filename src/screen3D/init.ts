// ## <a id="Screen3D"></a>Screen3D
// Two dimensional plotting

export class Screen3D extends Screen {
 
  scene: any;

  constructor (id: string, options) {
    super(id, options)
    var defaults = {
          anaglyphMode: false,
          axis: true,
          background: 0xffffff,
          camera: {
            lookAt: [0, 0, 0],
            position: [10, 10, 10]
          },
          controls: 'Trackball',
          height: 500,
          renderer: 'WebGL',
          width: 500
        },
        opts = extendObject(defaults, options),
        scene = new THREE.Scene(),
        camera, renderer, controls,
        // keyboard = new THREEx.KeyboardState(),
        clock = new THREE.Clock();
        


    // Camera
    // ======
    var viewAngle = 45,
        aspect = opts.width / opts.height,
        near = 0.1,
        far = 20000;

    camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
    camera.position = to3js(opts.camera.position);
    camera.lookAt(to3js(opts.camera.lookAt));
    camera.up = new THREE.Vector3(0, 0, 1);
    scene.add(camera);

    

    // Renderer
    // ========
    renderer = new THREE[opts.renderer + 'Renderer']( {antialias:true, preserveDrawingBuffer: true} );
    this.wrapper.appendChild(renderer.domElement);


    // Storing the the original renderer to recover it easily when leaving anaglyph mode
    var origRenderer = renderer;

    // Overwrite the renderer with the anaglyph mode renderer
    if (opts.anaglyphMode) {
      renderer = new THREE.AnaglyphEffect(renderer);
    }

    renderer.setSize(opts.width, opts.height);



    // Controls
    // ========

    // Other possible values are: 'FirstPerson', 'Fly', 'Orbit', 'Path', 'Roll', 'Trackback' or false
    // MathLib defaults to the TrackballControls
    // move mouse and left   click (or hold 'A') to rotate
    //                middle click (or hold 'S') to zoom
    //                right  click (or hold 'D') to pan
    if(opts.controls) {
      controls = new THREE[opts.controls+'Controls'](camera, renderer.domElement);
    }
    // A update function for the controls doing nothing.
    // The function is called in the update function.
    else {
      controls = {
        update: function (){}
      };
    }
    




    // Light
    // =====
    var light1 = new THREE.PointLight(0xffffff);
    light1.position.set(0,0,200);
    scene.add(light1);
    var light2 = new THREE.PointLight(0xffffff);
    light2.position.set(0,0,-200);
    scene.add(light2);



    // Background
    // ==========
    renderer.setClearColorHex(opts.background, 1);
    renderer.clear();





    // Axis
    // ====
    if (opts.axis) {
      var axis = new THREE.AxisHelper();
      scene.add(axis);
    }



    // Animate the scene
    // =================
    function animate() {
      requestAnimationFrame(animate);
      render();
      update();
    }

    function update() {
      var delta = clock.getDelta();
      controls.update();

//      if (opts.autoRotation) {
//        phi += 0.003;
//        camera.position.x = 20*Math.cos(phi);
//        camera.position.y = 20*Math.sin(phi);
//      }

    }

    // Render the scene
    function render() {
      renderer.render(scene, camera);
    }


    // kick of the animation loop
    animate();



    // screen3D = Object.create(screen3DProto, {
    //   container: {writable:false, configurable:false, value: screen.container},
    //   figure: {writable:false, configurable:false, value: screen.figure},
    //   scene: {writable:false, configurable:false, value: scene}
    // });



    this.scene = scene;


  }