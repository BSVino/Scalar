var container, stats;
var camera, scene, raycaster, renderer, parentTransform, sphereInter;

var mouse = new THREE.Vector2();
var radius = 100;

var currentIntersected;

var clock = new THREE.Clock();
var dt;

var FADE_SPEED = 2;

var dragging = false;
var drag_object, drag_object_type, drag_object_offset, drag_object_handle;
drag_object_offset = new THREE.Vector3();
drag_object_handle = new THREE.Vector3();

var grid_fade = 0;
var grid;
var grid_strong;

var pages;
var current_page;
var init_vectors;
var run_vectors = {};
var raycast_objects = [];

function visualvectors_init()
{
	pages = [
		{
			vectors: [
				VVector("green", 0x0D690F, VVector3v(0, 0, 0), VVector3v(1, 1, 0)),
				VVector("red", 0x690D0D, VVector3v(0, 1, 0), VVector3v(1, 1, 0))
			]
		},
		{
			vectors: [
				VVector("green", 0x0D690F, VVector3v(0, 1, 0), VVector3v(1, 0, 0)),
				VVector("blue", 0x0D0D69, VVector3v(0, 0, 0), VVector3v(-1, -1, 0))
			]
		}
	];
	init();
	animate();
}

function arrangeVVector(k)
{
	var v = run_vectors[k];
	v.vector.position.copy(v.v0);
	v.vector_head.position.copy(v.v1);
	v.vector_handle.position.copy(v.v0);
	v.vector_base.position.copy(v.v0);
	v.vector_head_handle.position.copy(v.v1);

	var direction = new THREE.Vector3();
	direction.copy(v.v1);
	direction.sub(v.v0);
	var vector_length = direction.length();
	direction.normalize();

	v.vector.scale.setX(vector_length - 0.25);
	v.vector.quaternion.setFromUnitVectors(
		new THREE.Vector3(1, 0, 0),
		direction
	);

	v.vector_head.quaternion.setFromUnitVectors(
		new THREE.Vector3(1, 0, 0),
		direction
	);

	v.vector_head_handle.quaternion.setFromUnitVectors(
		new THREE.Vector3(1, 0, 0),
		direction
	);

	v.vector_handle.scale.setX(vector_length - 0.25);
	v.vector_handle.quaternion.setFromUnitVectors(
		new THREE.Vector3(1, 0, 0),
		direction
	);
}

var vector_geometry;
var handle_geometry;
var vector_handle_geometry;
var head_geometry;
var handle_material;

function remove_raycast_object(object)
{
	for (var k = 0; k < raycast_objects.length; k++)
	{
		if (object == raycast_objects[k])
		{
			raycast_objects[k] = raycast_objects[raycast_objects.length-1];
			raycast_objects.pop();
			return;
		}
	}

	console.error("Couldn't find raycast object " + object.name + " to remove");
}

function page_setup(page)
{
	current_page = page;

	init_vectors = pages[page].vectors;

	for (var name in run_vectors)
	{
		run_vectors[name].kill = true;
		if (!run_vectors[name].kill)
		{
			remove_raycast_object(run_vectors[name].vector_handle);
			remove_raycast_object(run_vectors[name].vector_head_handle);
			remove_raycast_object(run_vectors[name].vector_base);
		}
	}

	for ( var i = 0; i < init_vectors.length; i ++ )
	{
		var vname = init_vectors[i].name;

		if (!(vname in run_vectors))
		{
			var arrow_material = new THREE.MeshBasicMaterial( { color: init_vectors[i].color } );

			var vector = new THREE.Mesh( vector_geometry, arrow_material );
			var vector_handle = new THREE.Mesh( vector_handle_geometry, handle_material );
			var vector_head = new THREE.Mesh( head_geometry, arrow_material );
			var vector_head_handle = new THREE.Mesh( head_handle_geometry, handle_material );
			var vector_base = new THREE.Mesh( handle_geometry, handle_material );

			vector.userData.vid = i;
			vector.userData.vname = vname;
			vector.userData.meshtype = "body";
			vector_handle.userData.vid = i;
			vector_handle.userData.vname = vname;
			vector_handle.userData.meshtype = "body";
			vector_head.userData.vid = i;
			vector_head.userData.vname = vname;
			vector_head.userData.meshtype = "head";
			vector_head_handle.userData.vid = i;
			vector_head_handle.userData.vname = vname;
			vector_head_handle.userData.meshtype = "head";
			vector_base.userData.vid = i;
			vector_base.userData.vname = vname;
			vector_base.userData.meshtype = "base";

			parentTransform.add( vector );
			parentTransform.add( vector_handle );
			parentTransform.add( vector_head );
			parentTransform.add( vector_head_handle );
			parentTransform.add( vector_base );

			run_vectors[vname] = {};
			run_vectors[vname].vector = vector;
			run_vectors[vname].vector_head = vector_head;
			run_vectors[vname].vector_handle = vector_handle;
			run_vectors[vname].vector_head_handle = vector_head_handle;
			run_vectors[vname].vector_base = vector_base;

			run_vectors[vname].vector.material.transparent = true;
			run_vectors[vname].vector.material.opacity = 0;
		}

		raycast_objects.push(run_vectors[vname].vector_handle);
		raycast_objects.push(run_vectors[vname].vector_base);
		raycast_objects.push(run_vectors[vname].vector_head_handle);

		run_vectors[vname].v0 = VVector3(init_vectors[i].v0);
		run_vectors[vname].v1 = VVector3(init_vectors[i].v1);
		run_vectors[vname].kill = false;

		arrangeVVector(init_vectors[i].name);
	}
}

function page_retreat()
{
	if (current_page - 1 < 0)
		return;

	page_setup(current_page-1);
}

function page_advance()
{
	if (current_page + 1 >= pages.length)
		return;

	page_setup(current_page+1);
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

	var GRID_MAX = 5;

	var grid_geometry = new THREE.Geometry();

	for (var k = -GRID_MAX+1; k < GRID_MAX; k++)
	{
		if (k == 0)
			continue;

		grid_geometry.vertices.push(
			new THREE.Vector3( k, -GRID_MAX, 0 ),
			new THREE.Vector3( k, GRID_MAX, 0 ),
			new THREE.Vector3( -GRID_MAX, k, 0 ),
			new THREE.Vector3( GRID_MAX, k, 0 )
		);
	}

	grid_geometry.computeBoundingSphere();

	var grid_material = new THREE.MeshBasicMaterial( { color: 0xe6d5c1 } );
	grid = new THREE.LineSegments(grid_geometry, grid_material);
	scene.add(grid);

	var grid_strong_geometry = new THREE.Geometry();

	grid_strong_geometry.vertices.push(
		new THREE.Vector3( -5, -5, 0 ),
		new THREE.Vector3( -5, 5, 0 ),
		new THREE.Vector3( 5, -5, 0 ),
		new THREE.Vector3( 5, 5, 0 ),
		new THREE.Vector3( -5, -5, 0 ),
		new THREE.Vector3( 5, -5, 0 ),
		new THREE.Vector3( -5, 5, 0 ),
		new THREE.Vector3( 5, 5, 0 ),
		new THREE.Vector3( 0, -5, 0 ),
		new THREE.Vector3( 0, 5, 0 ),
		new THREE.Vector3( -5, 0, 0 ),
		new THREE.Vector3( 5, 0, 0 )
	);

	grid_strong_geometry.computeBoundingSphere();

	var grid_strong_material = new THREE.MeshBasicMaterial( { color: 0xc3b5a5 } );
	grid_strong = new THREE.LineSegments(grid_strong_geometry, grid_strong_material);
	scene.add(grid_strong);

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

	vector_geometry = new THREE.CylinderGeometry(.03, .03, 1, 16);
	vector_geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( THREE.Math.degToRad( 90 ) ) );
	vector_geometry.translate(0.5, 0, 0);

	handle_geometry = new THREE.SphereGeometry(.15, 4, 4);
	head_handle_geometry = new THREE.SphereGeometry(.15, 4, 4);
	head_handle_geometry.translate(-0.15, 0, 0);

	vector_handle_geometry = new THREE.CylinderGeometry(.08, .08, 1, 16);
	vector_handle_geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( THREE.Math.degToRad( 90 ) ) );
	vector_handle_geometry.translate(0.5, 0, 0);

	head_geometry = new THREE.CylinderGeometry(.08, 0, 0.25, 16);
	head_geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( THREE.Math.degToRad( 90 ) ) );
	head_geometry.translate(-0.125, 0, 0);

	handle_material = new THREE.MeshBasicMaterial();
	handle_material.visible = false;

	page_setup(0);

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
	document.addEventListener( 'keydown', onDocumentKeyDown, false );

	window.addEventListener( 'resize', onWindowResize, false );
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

		if (drag_object_type == "body")
		{
			var difference = VVector3(world_position);
			difference.sub(run_vectors[drag_object].v0);
			run_vectors[drag_object].v0 = world_position;
			run_vectors[drag_object].v1.add(difference);
		}
		else if (drag_object_type == "head")
			run_vectors[drag_object].v1 = world_position;
		else if (drag_object_type == "base")
			run_vectors[drag_object].v0 = world_position;

		arrangeVVector(drag_object);
	}
}

function onDocumentMouseDown( event ) {
	event.preventDefault();

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( raycast_objects, true);

	if (!intersects.length)
		return;

	dragging = true;
	drag_object = intersects[0].object.userData.vname;
	drag_object_type = intersects[0].object.userData.meshtype;
	drag_object_handle.copy(intersects[0].point);
	drag_object_offset.copy(drag_object_handle);
	drag_object_offset.sub(intersects[0].object.position);
}

function onDocumentMouseUp( event ) {
	event.preventDefault();

	raycaster.setFromCamera( mouse, camera );

	dragging = false;
}

function onDocumentKeyDown( event ) {
	switch (event.keyCode)
	{
	case 40: // down arrow
		event.preventDefault();

		page_advance();
		break;

	case 38: // up arrow
		event.preventDefault();

		page_retreat();
		break;

	default:
	}
}

function animate() {
	requestAnimationFrame( animate );

	render();
	stats.update();
}

function render() {
	dt = clock.getDelta();

	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 10;
	camera.lookAt( new THREE.Vector3(0, 0, 0) );

	camera.updateMatrixWorld();

	// find intersections

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( raycast_objects, true);

	if ( intersects.length > 0 ) {
		currentIntersected = intersects[ 0 ].object;

		sphereInter.visible = true;
		sphereInter.position.copy( intersects[ 0 ].point );
	} else {
		currentIntersected = undefined;

		sphereInter.visible = false;
	}

	// Handle animations
	for (var v in run_vectors)
	{
		var vector = run_vectors[v];
		if (vector.kill)
		{
			vector.vector.material.transparent = true;
			vector.vector.material.opacity -= FADE_SPEED*dt;

			if (vector.vector.material.opacity <= 0)
			{
				parentTransform.remove(vector.vector);
				parentTransform.remove(vector.vector_head);
				parentTransform.remove(vector.vector_head_handle);
				parentTransform.remove(vector.vector_handle);
				parentTransform.remove(vector.vector_base);

				delete run_vectors[v];
			}
		}
		else
		{
			if (vector.vector.material.transparent)
			{
				vector.vector.material.opacity += FADE_SPEED*dt;
				if (vector.vector.material.opacity >= 1)
					vector.vector.material.transparent = false;
			}
		}
	}

	if (grid_fade < 1)
	{
		grid_fade += dt;
		grid.material.opacity = grid_strong.material.opacity = grid_fade;
		grid.material.transparent = grid_strong.material.transparent = true;
	}
	else
	{
		grid_fade = 1;
		grid.material.opacity = grid_strong.material.opacity = grid_fade;
		grid.material.transparent = grid_strong.material.transparent = false;
	}

	renderer.render( scene, camera );
}

