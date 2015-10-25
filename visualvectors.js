var container, stats;
var camera, scene, raycaster, renderer, parentTransform, sphereInter;

var mouse = new THREE.Vector2();
var radius = 100;

var currentIntersected;

var clock = new THREE.Clock();
var dt;

var TRANSITION_SPEED = 2;

var dragging = false;
var drag_object, drag_object_type;
var drag_object_offset = new THREE.Vector3();
var drag_object_handle = new THREE.Vector3();
var drag_object_v1 = new THREE.Vector3();

var grid_fade = 0;
var grid;
var grid_strong;

var pages;
var current_page;
var init_vectors;
var run_vectors = {};
var raycast_objects = [];

var shift_down = false;

function visualvectors_init()
{
	pages = [
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(-1, 0, 0), v1: VVector3v(1, 1, 0)}),
			]
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(-1, 0, 0), v1: VVector3v(1, 1, 0),
					length: true,
					angle: true,
					notransition: true
				}),
			]
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(-1, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true
				}),
			]
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(-1, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true,
					coordinates: true,
					notransition: true
				}),
			]
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(-1, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true,
					notransition: true
				}),
			]
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, -1, 0),
					fixbase: "green"
				})
			]
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, -1, 0),
					notransition: true,
					fixbase: "green"
				}),
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					fixorigin: true,
					fixhead: "red"
				})
			],

			info_div: "c = a.add(b)"
		},
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

var length_text_attr = {
	size: 60,
	height: 0,
	curveSegments: 3,
	font: 'droid sans',
	weight: 'normal',
	bevelEnabled: false
};

var angle_text_attr = {
	size: 60,
	height: 0,
	curveSegments: 3,
	font: 'droid sans',
	weight: 'normal',
	bevelEnabled: false
};

function array_swap_pop(array, index)
{
	array[index] = array[array.length-1];
	array.pop();
}

function remove_raycast_object(object)
{
	for (var k = 0; k < raycast_objects.length; k++)
	{
		if (object == raycast_objects[k])
		{
			array_swap_pop(raycast_objects, k);
			return;
		}
	}

	console.error("Couldn't find raycast object to remove:");
	console.log(object);
	console.log(raycast_objects);
}

function page_setup(page)
{
	current_page = page;

	init_vectors = pages[page].vectors;

	if ("info_div" in pages[page])
		info_div.innerHTML = pages[page].info_div;
	else
		info_div.innerHTML = "";

	for (var name in run_vectors)
	{
		if (!run_vectors[name].kill)
		{
			remove_raycast_object(run_vectors[name].vector_handle);
			remove_raycast_object(run_vectors[name].vector_head_handle);
			remove_raycast_object(run_vectors[name].vector_base);
		}
		run_vectors[name].kill = true;

		if (run_vectors[name].length_label)
		{
			parentTransform.remove(run_vectors[name].length_label);
			run_vectors[name].length_label = null;
		}

		if (run_vectors[name].angle_label)
		{
			parentTransform.remove(run_vectors[name].angle_label);
			run_vectors[name].angle_label = null;
		}

		if (run_vectors[name].angle_circle)
		{
			parentTransform.remove(run_vectors[name].angle_circle);
			run_vectors[name].angle_circle = null;
		}

		if (run_vectors[name].angle_xaxis)
		{
			parentTransform.remove(run_vectors[name].angle_xaxis);
			run_vectors[name].angle_xaxis = null;
		}

		if (run_vectors[name].head_coord_label)
		{
			parentTransform.remove(run_vectors[name].head_coord_label);
			run_vectors[name].head_coord_label = null;
		}

		if (run_vectors[name].tail_coord_label)
		{
			parentTransform.remove(run_vectors[name].tail_coord_label);
			run_vectors[name].tail_coord_label = null;
		}
	}

	for ( var i = 0; i < init_vectors.length; i ++ )
	{
		var vname = init_vectors[i].name;

		var fixorigin = false;

		if ("fixorigin" in init_vectors[i] && init_vectors[i].fixorigin)
			fixorigin = true;

		if (fixorigin)
			init_vectors[i].v0 = VVector3v(0, 0, 0);

		if (vname in run_vectors)
		{
			if (!("notransition" in init_vectors[i]))
			{
				run_vectors[vname].transitions = [];

				{
					var d0 = TV3_Distance(run_vectors[vname].v0, run_vectors[vname].v1);
					var d1 = TV3_Distance(init_vectors[i].v0, init_vectors[i].v1);
					if (Math.abs(d0 - d1) > 0.00001)
						run_vectors[vname].transitions.push(VTransition("length", d0, d1,
							clock.getElapsedTime(), clock.getElapsedTime()+1/TRANSITION_SPEED
							));
				}
				{
					var v0 = TV3_Center(run_vectors[vname].v0, run_vectors[vname].v1);
					var v1 = TV3_Center(init_vectors[i].v0, init_vectors[i].v1);
					if (VVector3(v0).sub(v1).length() > 0.00001)
						run_vectors[vname].transitions.push(VTransition("center", v0, v1,
							clock.getElapsedTime(), clock.getElapsedTime()+1/TRANSITION_SPEED
							));
				}
				{
					var q0 = TV3_Direction(run_vectors[vname].v0, run_vectors[vname].v1);
					var q1 = TV3_Direction(init_vectors[i].v0, init_vectors[i].v1);
					var v0 = VVector3v(1, 0, 0).applyQuaternion(q0);
					var v1 = VVector3v(1, 0, 0).applyQuaternion(q1);
					if (v0.dot(v1) < 0.9999)
						run_vectors[vname].transitions.push(VTransition("direction", q0, q1,
							clock.getElapsedTime(), clock.getElapsedTime()+1/TRANSITION_SPEED
							));
				}
			}
		}
		else
		{
			var arrow_material = new THREE.MeshBasicMaterial( { color: init_vectors[i].color } );

			var vector = new THREE.Mesh( vector_geometry, arrow_material );
			var vector_handle = new THREE.Mesh( vector_handle_geometry, handle_material );
			var vector_head = new THREE.Mesh( head_geometry, arrow_material );
			var vector_head_handle = new THREE.Mesh( head_handle_geometry, handle_material );
			var vector_base = new THREE.Mesh( handle_geometry, handle_material );

			vector.userData.vid = i;
			vector.userData.vname = vname;
			vector_handle.userData.vid = i;
			vector_handle.userData.vname = vname;
			vector_head.userData.vid = i;
			vector_head.userData.vname = vname;
			vector_head_handle.userData.vid = i;
			vector_head_handle.userData.vname = vname;
			vector_base.userData.vid = i;
			vector_base.userData.vname = vname;

			parentTransform.add( vector );
			parentTransform.add( vector_handle );
			parentTransform.add( vector_head );
			parentTransform.add( vector_head_handle );
			parentTransform.add( vector_base );

			run_vectors[vname] = {};
			run_vectors[vname].transitions = [];
			run_vectors[vname].vector = vector;
			run_vectors[vname].vector_head = vector_head;
			run_vectors[vname].vector_handle = vector_handle;
			run_vectors[vname].vector_head_handle = vector_head_handle;
			run_vectors[vname].vector_base = vector_base;

			run_vectors[vname].vector.material.transparent = true;
			run_vectors[vname].vector.material.opacity = 0;
		}

		if (fixorigin)
		{
			run_vectors[vname].fixorigin = true;
			
			run_vectors[vname].vector.userData.meshtype = "head_offset";
			run_vectors[vname].vector_handle.userData.meshtype = "head_offset";
			run_vectors[vname].vector_head.userData.meshtype = "head";
			run_vectors[vname].vector_head_handle.userData.meshtype = "head";
			run_vectors[vname].vector_base.userData.meshtype = "head_offset";
		}
		else
		{
			run_vectors[vname].fixorigin = false;

			run_vectors[vname].vector.userData.meshtype = "body";
			run_vectors[vname].vector_handle.userData.meshtype = "body";
			run_vectors[vname].vector_head.userData.meshtype = "head";
			run_vectors[vname].vector_head_handle.userData.meshtype = "head";
			run_vectors[vname].vector_base.userData.meshtype = "base";
		}

		run_vectors[vname].fixbase = init_vectors[i].fixbase;
		run_vectors[vname].fixhead = init_vectors[i].fixhead;

		if ("length" in init_vectors[i])
		{
			var text_material = new THREE.MeshBasicMaterial( { color: 0x0 } );
			var text_geometry = new THREE.TextGeometry("Length", length_text_attr);

			text_geometry.computeBoundingBox();

			var scale = 0.005;

			run_vectors[vname].length_label = new THREE.Mesh( text_geometry, text_material );
			run_vectors[vname].length_label.scale.copy(VVector3v(scale, scale, scale));
			parentTransform.add(run_vectors[vname].length_label);

			run_vectors[vname].length_label.text_size = (text_geometry.boundingBox.max.x - text_geometry.boundingBox.min.x) * run_vectors[vname].length_label.scale.x;
		}

		if ("angle" in init_vectors[i])
		{
			var text_material = new THREE.MeshBasicMaterial( { color: 0x0 } );
			var text_geometry = new THREE.TextGeometry("Angle", angle_text_attr);

			text_geometry.computeBoundingBox();

			var scale = 0.005;

			run_vectors[vname].angle_label = new THREE.Mesh( text_geometry, text_material );
			run_vectors[vname].angle_label.scale.copy(VVector3v(scale, scale, scale));
			parentTransform.add(run_vectors[vname].angle_label);

			run_vectors[vname].angle_label.text_size = (text_geometry.boundingBox.max.x - text_geometry.boundingBox.min.x) * run_vectors[vname].angle_label.scale.x;

			var circle_geometry = new THREE.RingGeometry(1, 5, 32);
			run_vectors[vname].angle_circle = new THREE.Mesh(circle_geometry, text_material);
			parentTransform.add(run_vectors[vname].angle_circle);

			var xaxis_geometry = new THREE.Geometry();

			for (var k = 0; k < 2; k += 0.2)
				xaxis_geometry.vertices.push(
					new THREE.Vector3( k, 0, 0 ),
					new THREE.Vector3( k+0.08, 0, 0 )
				);

			var xaxis_material = new THREE.LineBasicMaterial( { color: 0 } );
			run_vectors[vname].angle_xaxis = new THREE.LineSegments(xaxis_geometry, xaxis_material);
			parentTransform.add(run_vectors[vname].angle_xaxis);
		}

		if ("coordinates" in init_vectors[i])
		{
			var text_material = new THREE.MeshBasicMaterial( { color: 0x0 } );
			var text_geometry = new THREE.TextGeometry("(0.00, 0.00)", length_text_attr);

			text_geometry.computeBoundingBox();

			var scale = 0.005;

			run_vectors[vname].head_coord_label = new THREE.Mesh( text_geometry, text_material );
			run_vectors[vname].head_coord_label.scale.copy(VVector3v(scale, scale, scale));
			parentTransform.add(run_vectors[vname].head_coord_label);
			run_vectors[vname].head_coord_label.text_size = (text_geometry.boundingBox.max.x - text_geometry.boundingBox.min.x) * run_vectors[vname].head_coord_label.scale.x;

			run_vectors[vname].tail_coord_label = new THREE.Mesh( text_geometry, text_material );
			run_vectors[vname].tail_coord_label.scale.copy(VVector3v(scale, scale, scale));
			parentTransform.add(run_vectors[vname].tail_coord_label);
			run_vectors[vname].tail_coord_label.text_size = (text_geometry.boundingBox.max.x - text_geometry.boundingBox.min.x) * run_vectors[vname].tail_coord_label.scale.x;
		}

		if (!("notransition" in init_vectors[i]))
		{
			run_vectors[vname].v0 = VVector3(init_vectors[i].v0);
			run_vectors[vname].v1 = VVector3(init_vectors[i].v1);
		}

		run_vectors[vname].kill = false;

		raycast_objects.push(run_vectors[vname].vector_base);
		raycast_objects.push(run_vectors[vname].vector_handle);
		raycast_objects.push(run_vectors[vname].vector_head_handle);

		arrangeVVector(init_vectors[i].name);

		run_vectors[vname].old_length = 0;
		update_length_label(run_vectors[vname]);

		run_vectors[vname].old_angle = -7;
		update_angle_label(run_vectors[vname]);

		run_vectors[vname].old_head_coords = -100;
		run_vectors[vname].old_tail_coords = -100;
		update_coords_label(run_vectors[vname]);
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

var info_div;

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.bottom = '20px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.style.fontSize = "24px";
	info.innerHTML = '';
	container.appendChild( info );

	info_div = info;

	var width = window.innerWidth;
	var height = window.innerHeight;
	var ratio = height/width;
	var size = 10;
	//camera = new THREE.OrthographicCamera( -size, size, size*ratio, -size*ratio, -1, 10000 );
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

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

	var grid_material = new THREE.MeshBasicMaterial( { color: 0xe6d5c1 } );
	grid = new THREE.LineSegments(grid_geometry, grid_material);
	grid.position.copy(VVector3v(0, 0, -0.1));
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

	var grid_strong_material = new THREE.MeshBasicMaterial( { color: 0xc3b5a5 } );
	grid_strong = new THREE.LineSegments(grid_strong_geometry, grid_strong_material);
	grid_strong.position.copy(VVector3v(0, 0, -0.1));
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
	document.addEventListener( 'keyup', onDocumentKeyUp, false );

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
		var world_position = fromScreenPosition(screen_position, camera);
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
		else if (drag_object_type == "head_offset")
		{
			var difference = VVector3(drag_object_v1).sub(drag_object_handle);
			difference.add(fromScreenPosition(screen_position, camera));

			run_vectors[drag_object].v1.copy(difference);
		}
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
	drag_object_v1.copy(run_vectors[drag_object].v1);
}

function onDocumentMouseUp( event ) {
	event.preventDefault();

	raycaster.setFromCamera( mouse, camera );

	dragging = false;
}

function onDocumentKeyDown( event ) {
	switch (event.keyCode)
	{
	case 13: // enter
	case 32: // space bar
	case 34: // page down
	case 39: // right arrow
	case 40: // down arrow
		event.preventDefault();

		page_advance();
		break;

	case 33: // page up
	case 37: // left arrow
	case 38: // up arrow
		event.preventDefault();

		page_retreat();
		break;

	case 16: // shift
		event.preventDefault();

		shift_down = true;
		break;

	default:
	}
}

function onDocumentKeyUp( event ) {
	switch (event.keyCode)
	{
	case 16: // shift
		event.preventDefault();

		shift_down = false;
		break;

	default:
	}
}

function animate() {
	requestAnimationFrame( animate );

	render();
	stats.update();
}

function vector_transition(vector, transition, lerp)
{
	if (transition.type == "length")
	{
		var new_length = RemapVal(lerp, 0, 1, transition.start_value, transition.end_value);

		var v = VVector3(vector.v1);
		v.sub(vector.v0);

		var center = VVector3(v);
		center.multiplyScalar(0.5);
		center.add(vector.v0);

		v.normalize();
		v.multiplyScalar(new_length);

		var new_v0 = VVector3(v);
		new_v0.multiplyScalar(-0.5);
		new_v0.add(center);

		var new_v1 = VVector3(v);
		new_v1.multiplyScalar(0.5);
		new_v1.add(center);

		vector.v0 = new_v0;
		vector.v1 = new_v1;
	}
	else if (transition.type == "center")
	{
		var center_path = VVector3(transition.end_value);
		center_path.sub(transition.start_value);
		center_path.multiplyScalar(lerp);
		center_path.add(transition.start_value);

		var v = VVector3(vector.v1);
		v.sub(vector.v0);

		var new_v0 = VVector3(v);
		new_v0.multiplyScalar(-0.5);
		new_v0.add(center_path);

		var new_v1 = VVector3(v);
		new_v1.multiplyScalar(0.5);
		new_v1.add(center_path);

		vector.v0 = new_v0;
		vector.v1 = new_v1;
	}
	else if (transition.type == "direction")
	{
		var new_direction = new THREE.Quaternion();
		THREE.Quaternion.slerp(transition.start_value, transition.end_value, new_direction, lerp);

		var center = TV3_Center(vector.v0, vector.v1);
		var length = TV3_Distance(vector.v0, vector.v1);

		var new_v = VVector3v(1, 0, 0);
		new_v.applyQuaternion(new_direction);
		new_v.multiplyScalar(length/2);

		vector.v0 = VVector3(new_v);
		vector.v0.multiplyScalar(-1);
		vector.v0.add(center);

		vector.v1 = VVector3(new_v);
		vector.v1.add(center);
	}
	else
	{
		console.error("Unknown transition type");
	}
}

function update_length_label(vector)
{
	if (vector.length_label == undefined || vector.length_label == null)
		return;

	var scale = VVector3v(1, -0.1, -0.1).multiplyScalar(vector.length_label.text_size + 2);
	vector.length_label.position.copy(
		VVector3(vector.v1)
			.sub(VVector3(vector.v0))
			.multiplyScalar(0.5)
			.add(vector.v0)
			.sub(scale)
	);

	var new_length = VVector3(vector.v1).sub(vector.v0).length();

	if (shift_down && Math.abs(Math.round(new_length) - new_length) < 0.1)
		new_length = Math.round(new_length);

	if (vector.old_length == null || vector.old_length != new_length)
		vector.length_label.geometry = new THREE.TextGeometry("length: " + new_length.toFixed(2), length_text_attr);

	vector.old_length = new_length;
}

function update_angle_label(vector)
{
	if (vector.angle_label == undefined || vector.angle_label == null)
		return;

	var scale = VVector3v(0, 0, -0.1);
	vector.angle_label.position.copy(
		VVector3(vector.v1)
			.sub(vector.v0)
			.normalize()
			.add(VVector3v(1, 0, 0))
			.normalize()
			.add(vector.v0)
			.sub(scale)
	);

	vector.angle_circle.position.copy(vector.v0);
	vector.angle_xaxis.position.copy(vector.v0);

	var new_angle = Math.acos(VVector3(vector.v1).sub(vector.v0).normalize().dot(VVector3v(1, 0, 0)));
	var new_angle_degrees = new_angle * 180 / Math.PI;

	if (shift_down && Math.abs(Math.round(new_angle_degrees) - new_angle_degrees) < 0.1)
		new_angle_degrees = Math.round(new_angle_degrees);

	if (vector.v1.y - vector.v0.y < 0)
		new_angle_degrees = -new_angle_degrees;

	if (vector.old_angle == null || vector.old_angle != new_angle)
	{
		vector.angle_label.geometry = new THREE.TextGeometry("angle: " + new_angle_degrees.toFixed(2) + "°", length_text_attr);

		vector.angle_circle.geometry = new THREE.RingGeometry(0.7, 0.75, 30, 1, 0, new_angle);
		if (vector.v1.y - vector.v0.y < 0)
			vector.angle_circle.geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( -new_angle ) );
	}

	vector.old_angle = new_angle;
}

function update_coords_label(vector)
{
	if (vector.head_coord_label != undefined && vector.head_coord_label != null)
	{
		var offset = VVector3v(0.2, 0.2, -0.1);
		vector.head_coord_label.position.copy(
			VVector3(vector.v1)
				.add(offset)
		);

		var new_coord = (vector.v1.x+123) * (vector.v1.y+123) * (vector.v1.z+123);

		var x = vector.v1.x;
		if (Math.abs(vector.v1.x) < 0.01)
			x = 0;

		var y = vector.v1.y;
		if (Math.abs(vector.v1.y) < 0.01)
			y = 0;

		if (shift_down && Math.abs(Math.round(vector.v1.x) - vector.v1.x) < 0.1)
			x = Math.round(vector.v1.x);

		if (shift_down && Math.abs(Math.round(vector.v1.y) - vector.v1.y) < 0.1)
			y = Math.round(vector.v1.y);

		if (vector.old_head_coords == null || vector.old_head_coords != new_coord)
			vector.head_coord_label.geometry = new THREE.TextGeometry("(" + x.toFixed(2) + ", " + y.toFixed(2) + ")", length_text_attr);

		vector.old_head_coords = new_coord;
	}

	if (vector.tail_coord_label != undefined && vector.tail_coord_label != null)
	{
		var offset = VVector3v(-1.2, -0.2, -0.1).multiplyScalar(vector.tail_coord_label.text_size);
		vector.tail_coord_label.position.copy(
			VVector3(vector.v0)
				.add(offset)
		);

		var new_coord = (vector.v0.x+123) * (vector.v0.y+123) * (vector.v0.z+123);

		var x = vector.v0.x;
		if (Math.abs(vector.v0.x) < 0.01)
			x = 0;

		var y = vector.v0.y;
		if (Math.abs(vector.v0.y) < 0.01)
			y = 0;

		if (shift_down && Math.abs(Math.round(vector.v0.x) - vector.v0.x) < 0.1)
			x = Math.round(vector.v0.x);

		if (shift_down && Math.abs(Math.round(vector.v0.y) - vector.v0.y) < 0.1)
			y = Math.round(vector.v0.y);

		if (vector.old_tail_coords == null || vector.old_tail_coords != new_coord)
			vector.tail_coord_label.geometry = new THREE.TextGeometry("(" + x.toFixed(2) + ", " + y.toFixed(2) + ")", length_text_attr);

		vector.old_tail_coords = new_coord;
	}
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
	for (var k in run_vectors)
	{
		var vector = run_vectors[k];

		update_length_label(vector);
		update_angle_label(vector);
		update_coords_label(vector);

		if (vector.kill)
		{
			vector.vector.material.transparent = true;
			vector.vector.material.opacity -= TRANSITION_SPEED*dt;

			if (vector.vector.material.opacity <= 0)
			{
				parentTransform.remove(vector.vector);
				parentTransform.remove(vector.vector_head);
				parentTransform.remove(vector.vector_head_handle);
				parentTransform.remove(vector.vector_handle);
				parentTransform.remove(vector.vector_base);

				delete run_vectors[k]; // TODO: Can I do this in a loop over run_vectors?
				continue;
			}
		}
		else
		{
			if (vector.vector.material.transparent)
			{
				vector.vector.material.opacity += TRANSITION_SPEED*dt;
				if (vector.vector.material.opacity >= 1)
					vector.vector.material.transparent = false;
			}
		}

		var arrange = false;

		if (vector.fixorigin)
		{
			vector.v0.copy(VVector3v(0, 0, 0));
			arrange = true;
		}

		if (vector.fixbase)
		{
			var base_vector = run_vectors[vector.fixbase];
			if (!base_vector)
				console.error("Couldn't find base vector: " + vector.fixbase);

			vector.v1.copy(VVector3(vector.v1).sub(vector.v0).add(base_vector.v1));
			vector.v0.copy(base_vector.v1);

			arrange = true;
		}

		if (vector.fixhead)
		{
			var head_vector = run_vectors[vector.fixhead];
			if (!head_vector)
				console.error("Couldn't find head vector: " + vector.fixhead);

			vector.v1.copy(head_vector.v1);

			arrange = true;
		}

		for (var j = 0; j < vector.transitions.length; j++)
		{
			var transition = vector.transitions[j];
			var lerp = RemapVal(clock.getElapsedTime(), transition.start_time, transition.end_time, 0, 1);

			if (lerp >= 1)
			{
				arrange = true;
				vector_transition(vector, transition, 1);
				array_swap_pop(vector.transitions, j);
				j--;
				continue;
			}

			vector_transition(vector, transition, lerp);
			arrange = true;
		}

		if (arrange)
			arrangeVVector(k);
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

