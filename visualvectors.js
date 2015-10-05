var container, stats;
var camera, scene, raycaster, renderer, parentTransform, sphereInter;

var mouse = new THREE.Vector2();
var radius = 100;

var currentIntersected;

var dragging = false;
var drag_object, drag_object_offset, drag_object_handle;
drag_object_offset = new THREE.Vector3();
drag_object_handle = new THREE.Vector3();

var init_vectors;
var run_vectors;

function visualvectors_init(v)
{
	init_vectors = v;
	init();
	animate();
}

function arrangeVVector(k)
{
	var v = run_vectors[k];
	v.vector.position.copy(v.v0);
	v.vector_head.position.copy(v.v0);
}

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	//info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> webgl - interactive lines';
	container.appendChild( info );

	var width = window.innerWidth;
	var height = window.innerHeight;
	var ratio = height/width;
	var size = 10;
	camera = new THREE.OrthographicCamera( -size, size, size*ratio, -size*ratio, -1, 10000 );
	//camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );

	scene = new THREE.Scene();

	var geometry = new THREE.SphereGeometry( 0.1, 16, 12 );
	var background_material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

	sphereInter = new THREE.Mesh( geometry, background_material );
	sphereInter.visible = false;
	scene.add( sphereInter );

	var point = new THREE.Vector3();
	var direction = new THREE.Vector3();

	var geometry = new THREE.Geometry( );
	geometry.vertices.push(new THREE.Vector3(0, 0, 0));
	geometry.vertices.push(new THREE.Vector3(1, 0, 0));

	parentTransform = new THREE.Object3D();

	var handle_geometry = new THREE.SphereGeometry(.2, 4, 4);

	var vector_geometry = new THREE.CylinderGeometry(.03, .03, 1, 16);
	vector_geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( THREE.Math.degToRad( 90 ) ) );
	vector_geometry.translate(0.5, 0, 0);

	var head_geometry = new THREE.CylinderGeometry(.08, 0, 0.25, 16);
	head_geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( THREE.Math.degToRad( 90 ) ) );
	head_geometry.translate(1, 0, 0);

	/*var handle_material = new THREE.MeshBasicMaterial();
	handle_material.opacity = 0.01;
	handle_material.transparent = true;
	handle_material.visible = false;*/

	run_vectors = [];

	for ( var i = 0; i < init_vectors.length; i ++ ) {
		var arrow_material = new THREE.MeshBasicMaterial( { color: init_vectors[i].color } );

		var vector = new THREE.Mesh( vector_geometry, arrow_material );
		var vector_head = new THREE.Mesh( head_geometry, arrow_material );
		//var vector_base = new THREE.Mesh( handle_geometry );

		vector.position.copy(init_vectors[i].v0);
		vector_head.position.copy(init_vectors[i].v0);
		//vector_base.position.copy(init_vectors[i].v0);

		vector.userData.vid = i;
		vector.userData.meshtype = "body";
		vector_head.userData.vid = i;
		vector_head.userData.meshtype = "head";

		parentTransform.add( vector );
		parentTransform.add( vector_head );
		//parentTransform.add( vector_base );

		run_vectors[i] = {
			v0: init_vectors[i].v0,
			v1: init_vectors[i].v1,
			vector, vector_head
		};
	}

	console.log(run_vectors);

	scene.add( parentTransform );

	raycaster = new THREE.Raycaster();
	raycaster.linePrecision = 3;

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0xF0E9E1 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild(renderer.domElement);

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );

	window.addEventListener( 'resize', onWindowResize, false );

	//parentTransform.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(Math.sqrt(2)/2, Math.sqrt(2)/2, 0));
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	if (dragging)
	{
		var original_screen_position = toScreenPosition(drag_object_handle, camera);
		var screen_position = new THREE.Vector3(event.clientX, event.clientY, original_screen_position.z);
		var world_position = fromScreenPosition(screen_position, camera)
		world_position.sub(drag_object_offset);

		run_vectors[drag_object].v0 = world_position;

		arrangeVVector(drag_object);
	}
}

function onDocumentMouseDown( event ) {
	event.preventDefault();

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( parentTransform.children, true);

	if (!intersects.length)
		return;

	dragging = true;
	drag_object = intersects[0].object.userData.vid;
	drag_object_handle.copy(intersects[0].point);
	drag_object_offset.copy(drag_object_handle);
	drag_object_offset.sub(intersects[0].object.position);
}

function onDocumentMouseUp( event ) {
	event.preventDefault();

	raycaster.setFromCamera( mouse, camera );

	dragging = false;
}

function animate() {
	requestAnimationFrame( animate );

	render();
	stats.update();
}

function render() {
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 10;
	camera.lookAt( new THREE.Vector3(0, 0, 0) );

	camera.updateMatrixWorld();

	// find intersections

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( parentTransform.children, true);

	if ( intersects.length > 0 ) {
		currentIntersected = intersects[ 0 ].object;

		sphereInter.visible = true;
		sphereInter.position.copy( intersects[ 0 ].point );
	} else {
		currentIntersected = undefined;

		sphereInter.visible = false;
	}

	renderer.render( scene, camera );
}

