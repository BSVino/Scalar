var container, stats;
var camera, scene, raycaster, renderer, parentTransform, sphereInter;
var rotate_sphere, rotating = false, rotate_mouse_start_x, rotate_mouse_start_y, rotate_horizontal = 0, rotate_vertical = 0;

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
var run_matrices = {};
var raycast_objects = [];

var transform_grid;
var transform_grid_strong;
var transform_grid_matrix;

var shift_down = false;

var mesh_mario;
var mesh_pacman;
var mesh_clyde;

var texture_pacman1;
var texture_pacman2;
var texture_clyde_u;
var texture_clyde_ur;
var texture_clyde_ul;
var texture_clyde_d;
var texture_clyde_dr;
var texture_clyde_dl;


function mesh_from_name(name)
{
	if (name == "mario")
		return mesh_mario;
	if (name == "pacman")
		return mesh_pacman;
	if (name == "clyde")
		return mesh_clyde;

	console.error("Unknown mesh name");
	return null;
}

function visualvectors_init()
{
	pages = [
		// INTRO
		{
			vectors: [
			],

			hide_rotate: true,
			center_div: "<br /><br /><br /><span style='font-family: serif'>" +
				"<em>Visual Vectors</em><br />" +
				"by Jorge Rodriguez @VinoBS<br /><br />" +
				"Follow along at<br />" +
				"<em>http://vinoisnotouzo.com/vv</em><br />" +
				"</span>"
		},
		{
			vectors: [
			],

			hide_rotate: true,
			center_div: "<br /><br /><br /><br /><span style='font-family: serif'>" +
				"A 2D location:<br />" +
				"(x, y)<br />" +
				"</span>"
		},
		{
			vectors: [
			],

			hide_rotate: true,
			center_div: "<span style='font-family: serif'>" +
				"A <em>vector</em> is an object<br />" +
				"defined by an ordered set of components<br />" +
				"with the following properties.<br />" +
				"If <em>a</em> <em>b</em> and <em>c</em> are vectors and <em>x, y</em> are real numbers:<br /><br />" +
				"<em>a</em> + <em>b</em> = <em>b</em> + <em>a</em><br />" +
				"(<em>a</em> + <em>b</em>) + <em>c</em> = <em>a</em> + (<em>b</em> + <em>c</em>)<br />" +
				"<em>x</em>(<em>y</em><em>a</em>) = (<em>x</em><em>y</em>)<em>a</em><br />" +
				"<em>x</em>(<em>a</em> + <em>b</em>) = <em>x</em><em>a</em> + <em>x</em><em>b</em><br /><br />" +
				"...</span>"
		},
		{
			vectors: [
			],

			hide_rotate: true,
			center_div: "<br /><br /><br /><br /><span style='font-family: serif'>" +
				"How Albert Einstein thought about physics:<br /><br />" +
				"<em>\"I have sensations of a kinesthetic or muscular type.\"</em><br /><br />" +
				"</span>"
		},

		// VECTOR
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(-1, 0, 0), v1: VVector3v(1, 1, 0)}),
			],

			info_div: "new THREE.Vector3()"
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
					coordinates: true,
					notransition: true,
					spritehead: "mario"
				}),
			]
		},

		// ADDITION
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(-1, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true,
					notransition: true,
					spritehead: "mario"
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, -1, 0),
				})
			]
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true,
					spritehead: "mario"
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
					fixbase: "green",
					spritehead: "mario"
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
					fixhead: "red",
					nodrag: true,
					spritehead: "mario"
				})
			],
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					label: "a",
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, -1, 0),
					label: "b",
					notransition: true,
					fixbase: "green"
				}),
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					label: "c",
					fixorigin: true,
					notransition: true,
					fixhead: "red",
					nodrag: true
				})
			],

			info_div: "<span style='font-family: serif'><em>c = a + b</em></span><br />c = a.add(b);"
		},

		// ADDITION TAKE 2
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(-1, 0, 0), v1: VVector3v(1, 1, 0),
					length: true,
					angle: true,
					notransition: true
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, -1, 0),
					length: true,
					angle: true,
					notransition: true,
				}),
			]
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(-1, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, -1, 0),
					fixorigin: true
				}),
			]
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(-1, 0, 0), v1: VVector3v(1, 1, 0),
					label: "a",
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, -1, 0),
					label: "b",
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					label: "c",
					fixorigin: true,
					fixheadsum: ["red", "green"],
					nodrag: true
				})
			],

			info_div: "<span style='font-family: serif'><em>c = a + b</em></span><br />c = a.add(b);"
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(-1, 0, 0), v1: VVector3v(1, 1, 0),
					label: "a",
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, -1, 0),
					label: "b",
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "greendup", color: 0x0D690F, v0: VVector3v(-1, 0, 0), v1: VVector3v(1, 1, 0),
					label: "a",
					fixbase: "red",
					fixhead: "blue",
					notransition: true,
					nodrag: true
				}),
				VVector({name: "reddup", color: 0x690D0D, v0: VVector3v(-1, 0, 0), v1: VVector3v(1, 1, 0),
					label: "b",
					fixbase: "green",
					fixhead: "blue",
					notransition: true,
					nodrag: true
				}),
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					label: "c",
					fixorigin: true,
					fixheadsum: ["red", "green"],
					notransition: true,
					nodrag: true
				})
			],

			info_div: "<span style='font-family: serif'><em>c = a + b</em></span><br />c = a.add(b);"
		},

		// SUBTRACTION
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					label: "c",
					notransition: true,
					fixorigin: true,
					spritehead: "clyde"
				}),
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					label: "p",
					fixorigin: true,
					notransition: true,
					spritehead: "pacman"
				})
			],

			info_div: "<span style='font-family: serif'><em>p = c + ?</em></span><br /><br />"
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					label: "c",
					notransition: true,
					fixorigin: true,
					spritehead: "clyde"
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, -1, 0),
					label: "b",
					notransition: true,
					fixbase: "green",
					fixhead: "blue",
					nodrag: true
				}),
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					label: "p",
					fixorigin: true,
					notransition: true,
					spritehead: "pacman"
				})
			],

			info_div: "<span style='font-family: serif'><em>p = c + ?</em></span><br /><br />"
		},
 		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					label: "c",
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, -1, 0),
					label: "b",
					notransition: true,
					fixbase: "green",
					fixhead: "blue",
					nodrag: true
				}),
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					label: "p",
					fixorigin: true,
					notransition: true
				})
			],

			info_div: "<span style='font-family: serif'><em>p - c = b</em></span><br />b = p.sub(c);"
		},

		// DISTANCE
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true,
					spritehead: "clyde"
				}),
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					fixorigin: true,
					notransition: true,
					spritehead: "pacman"
				})
			],
		},

		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true,
					spritehead: "clyde"
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, -1, 0),
					notransition: true,
					fixbase: "green",
					fixhead: "blue",
					nodrag: true
				}),
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					fixorigin: true,
					notransition: true,
					spritehead: "pacman"
				})
			],
		},

		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true,
					spritehead: "clyde"
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, -1, 0),
					length: true,
					notransition: true,
					fixbase: "green",
					fixhead: "blue",
					nodrag: true
				}),
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					fixorigin: true,
					notransition: true,
					spritehead: "pacman"
				})
			],
		},

		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					label: "c",
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, -1, 0),
					label: "b",
					length: true,
					notransition: true,
					fixbase: "green",
					fixhead: "blue",
					nodrag: true
				}),
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					label: "p",
					fixorigin: true,
					notransition: true
				})
			],

			info_vector_distance: ["green", "blue", "red"]
		},

		/*
		{
			center_div: "<br /><br /><br /><span style='font-family: serif'><em>Questions?</em></span>"
		},
		*/

		// SCALAR MULTIPLICATION
		{
			vectors: [
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(-1, 0, 0), v1: VVector3v(1, 1, 0),
					length: true,
					spritehead: "mario"
				})
			]
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					fixdirection: "red",
					show_multiples: "red",
					length: true
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(2, 1, 0), v1: VVector3v(2, 2, 0),
					length: true,
					show_multiples: "green",
					fixdirection: "green"
				}),
			],
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					label: "a",
					fixdirection: "red",
					length: true
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(2, 1, 0), v1: VVector3v(2, 2, 0),
					notransition: true,
					label: "b",
					fixdirection: "green",
					length: true
				}),
			],

			info_scalar_multiplication: ["green", "red"]
		},

/*
		// NORMALIZING
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					label: "a",
					fixdirection: "red",
					length: true
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(2, 1, 0), v1: VVector3v(2, 2, 0),
					notransition: true,
					label: "b",
					fixdirection: "green",
					fixlength: 1,
					length: true
				}),
			],

			info_normalize: ["green", "red"]
		},
*/

		// DOT PRODUCT
		{
			vectors: [
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(-1, 0, 0),
					fixorigin: true
				}),
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true,
					angleto: "red"
				}),
			],
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true,
					angleto: "red",
					label: "a"
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(-1, 0, 0),
					notransition: true,
					fixorigin: true,
					label: "b"
				}),
			],

			info_dot_product: ["green", "red"]
		},
		{
			center_div: "<br /><br /><br /><span style='font-family: serif'><em>a · b = </em>|<em>a</em>| × |<em>b</em>| × cos(<em>θ</em>)</span>",

			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true,
					label: "a",
					length: true
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(-1, 0, 0),
					notransition: true,
					fixorigin: true,
					label: "b",
					length: true
				}),
			],
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true,
					label: "a",
					length: true
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(-1, 0, 0),
					notransition: true,
					fixorigin: true,
					label: "b",
					length: true
				}),
			],

			info_dot_product_angle: ["green", "red"]
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true,
					fixlength: 1,
					label: "a"
				}),
				VVector({name: "red", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(-1, 0, 0),
					notransition: true,
					fixorigin: true,
					fixlength: 1,
					label: "b"
				}),
			],

			info_dot_product_angle: ["green", "red"]
		},

		/*
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true,
					label: "a"
				}),
			],

			info_dot_product_lengthsqr: "green"
		},
		*/

		// COMPONENTS
		{
			vectors: [
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true
				}),
				VVector({name: "x", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					fixorigin: true,
					vector_width: 0.5,
					nodrag: true,
					fixxprojection: "blue"
				}),
				VVector({name: "y", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					fixorigin: true,
					vector_width: 0.5,
					nodrag: true,
					fixyprojection: "blue"
				}),
			],
		},
		{
			vectors: [
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true,
					coordinates: true
				}),
				VVector({name: "x", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					fixorigin: true,
					vector_width: 0.5,
					fixxprojection: "blue",
					nodrag: true,
					coordinates: true
				}),
				VVector({name: "y", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					fixorigin: true,
					vector_width: 0.5,
					fixyprojection: "blue",
					nodrag: true,
					coordinates: true
				}),
			],
		},
		{
			vectors: [
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					label: "a",
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "x", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					label: "a.x",
					vector_width: 0.5,
					notransition: true,
					fixorigin: true,
					fixxprojection: "blue",
					nodrag: true
				}),
				VVector({name: "y", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					label: "a.y",
					vector_width: 0.5,
					notransition: true,
					fixorigin: true,
					fixyprojection: "blue",
					nodrag: true
				}),
			],

			info_components: "blue"
		},
		{
			vectors: [
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					label: "a",
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "x", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					label: "a.x",
					vector_width: 0.5,
					notransition: true,
					fixorigin: true,
					fixxprojection: "blue",
					nodrag: true
				}),
				VVector({name: "y", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					label: "a.y",
					vector_width: 0.5,
					notransition: true,
					fixorigin: true,
					fixyprojection: "blue",
					nodrag: true
				}),
			],

			info_div: "<span style='font-family: serif'><em>a.x</em> + <em>a.y</em> = <em>a</em></span>"
		},

/*
		// VECTOR PROJECTION
		{
			vectors: [
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "shadow", color: 0x0, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					vector_width: 0.5,
					notransition: true,
					fixorigin: true,
					fixxprojection: "blue",
					nodrag: true
				}),
			],
		},
		{
			vectors: [
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true,
					notransition: true
				}),
				VVector({name: "green", color: 0x39E73D, v0: VVector3v(0, 0, 0), v1: VVector3v(2, 1, 0),
					fixorigin: true
				}),
			],
		},
		{
			vectors: [
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true,
					notransition: true
				}),
				VVector({name: "green", color: 0x39E73D, v0: VVector3v(0, 0, 0), v1: VVector3v(2, 1, 0),
					fixorigin: true,
					notransition: true
				}),
				VVector({name: "shadow", color: 0x0, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					vector_width: 0.5,
					fixprojection: ["blue", "green"],
					nodrag: true
				}),
			],
		},
		{
			vectors: [
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true,
					notransition: true
				}),
				VVector({name: "green", color: 0x39E73D, v0: VVector3v(0, 0, 0), v1: VVector3v(2, 1, 0),
					angleto: "blue",
					fixorigin: true,
					notransition: true
				}),
				VVector({name: "shadow", color: 0x0, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					vector_width: 0.5,
					fixprojection: ["blue", "green"],
					nodrag: true,
					notransition: true
				}),
			],
		},
		{
			vectors: [
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 2, 0),
					label: "a",
					fixorigin: true
				}),
				VVector({name: "green", color: 0x39E73D, v0: VVector3v(0, 0, 0), v1: VVector3v(2, 0, 0),
					label: "b",
					fixorigin: true
				}),
				VVector({name: "shadow", color: 0x0, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					vector_width: 0.5,
					fixprojection: ["blue", "green"],
					nodrag: true,
					notransition: true
				}),
			],

			info_dot_product_projection: ["blue", "green"]
		},
		{
			vectors: [
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(2, 2, 0),
					label: "a",
					fixorigin: true,
					notransition: true
				}),
				VVector({name: "green", color: 0x39E73D, v0: VVector3v(0, 0, 0), v1: VVector3v(2, 0, 0),
					label: "b",
					fixorigin: true,
					notransition: true
				}),
				VVector({name: "shadow", color: 0x0, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					vector_width: 0.5,
					fixprojection: ["blue", "green"],
					nodrag: true,
					notransition: true
				}),
			],

			info_projection: ["blue", "green"]
		},
		*/

		{
			center_div: "<br /><br /><br /><span style='font-family: serif'><em>Questions?</em></span>"
		},

		// MATRICES
		{
			vectors: [
			],

			center_div: "<br /><br /><br /><span style='font-family: serif'>" +
				"<em>A matrix is a transformation</em><br /><br /><br />" +
				"</span>"
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(2, 0, 0),
					fixorigin: true
				}),
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(Math.sqrt(2), Math.sqrt(2), 0),
					fixorigin: true,
					nodrag: true,
					transform: ["green", new THREE.Matrix4().makeBasis(VVector3v(Math.sqrt(2)/2, Math.sqrt(2)/2, 0), VVector3v(-Math.sqrt(2)/2, Math.sqrt(2)/2, 0), VVector3v(0, 0, 1))]
				}),
			],

			info_div: "<span style='font-family: serif'>Rotation by 45°</span>"
		},
		{
			vectors: [
				VVector({name: "green", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(2, 0, 0),
					fixorigin: true,
					spriterot: "pacman"
				}),
			],
		},
		{
			vectors: [
				VVector({name: "vx", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					fixlength: 1,
					fixorigin: true,
					coordinates: true,
					transform: ["vy", new THREE.Matrix4().makeBasis(VVector3v(0, -1, 0), VVector3v(1, 0, 0), VVector3v(0, 0, 1))]
				}),
				VVector({name: "vy", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					fixlength: 1,
					fixorigin: true,
					coordinates: true,
					transform: ["vx", new THREE.Matrix4().makeBasis(VVector3v(0, 1, 0), VVector3v(-1, 0, 0), VVector3v(0, 0, 1))]
				}),
			],

			info_div: "<span style='font-family: serif'><em>Basis Vectors</em></span>"
		},
		{
			vectors: [
				VVector({name: "vx", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					fixlength: 1,
					fixorigin: true,
					transform: ["vy", new THREE.Matrix4().makeBasis(VVector3v(0, -1, 0), VVector3v(1, 0, 0), VVector3v(0, 0, 1))]
				}),
				VVector({name: "vy", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					fixlength: 1,
					fixorigin: true,
					transform: ["vx", new THREE.Matrix4().makeBasis(VVector3v(0, 1, 0), VVector3v(-1, 0, 0), VVector3v(0, 0, 1))]
				}),
			],

			info_rotation_by: "vx"
		},
		{
			vectors: [
				VVector({name: "vx", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					label: "x",
					fixlength: 1,
					fixorigin: true,
					transform: ["vy", new THREE.Matrix4().makeBasis(VVector3v(0, -1, 0), VVector3v(1, 0, 0), VVector3v(0, 0, 1))]
				}),
				VVector({name: "vy", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					label: "y",
					fixlength: 1,
					fixorigin: true,
					transform: ["vx", new THREE.Matrix4().makeBasis(VVector3v(0, 1, 0), VVector3v(-1, 0, 0), VVector3v(0, 0, 1))]
				}),
			],

			info_general_matrix_construction: ["vx", "vy"]
		},
		{
			vectors: [
				VVector({name: "vx", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					label: "x",
					fixlength: 1,
					fixorigin: true,
					transform: ["vy", new THREE.Matrix4().makeBasis(VVector3v(0, -1, 0), VVector3v(1, 0, 0), VVector3v(0, 0, 1))]
				}),
				VVector({name: "vy", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					label: "y",
					fixlength: 1,
					fixorigin: true,
					transform: ["vx", new THREE.Matrix4().makeBasis(VVector3v(0, 1, 0), VVector3v(-1, 0, 0), VVector3v(0, 0, 1))]
				}),
			],

			info_rotation_matrix_construction: "vx"
		},
		{
			matrices: {
				rotation: [ "vx", "vy" ]
			},

			vectors: [
				VVector({name: "vx", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					fixlength: 1,
					fixorigin: true,
					transform: ["vy", new THREE.Matrix4().makeBasis(VVector3v(0, -1, 0), VVector3v(1, 0, 0), VVector3v(0, 0, 1))]
				}),
				VVector({name: "vy", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					fixlength: 1,
					fixorigin: true,
					transform: ["vx", new THREE.Matrix4().makeBasis(VVector3v(0, 1, 0), VVector3v(-1, 0, 0), VVector3v(0, 0, 1))]
				}),
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true
				}),
				VVector({name: "blue_transformed", color: 0x3939E7, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true,
					nodrag: true,
					transform: ["blue", "rotation"]
				}),
			],

			info_div: "<span style='font-family: serif'>Mv</span><br />"
				+ "v.applyMatrix4(M)"
		},

		// TRANSFORMING A VECTOR WITH A MATRIX
		{
			vectors: [
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "x", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					fixorigin: true,
					nodrag: true,
					vector_width: 0.5,
					fixxprojection: "blue"
				}),
				VVector({name: "y", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					fixorigin: true,
					nodrag: true,
					vector_width: 0.5,
					fixyprojection: "blue"
				}),
			],
		},
		{
			vectors: [
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "x", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					fixorigin: true,
					nodrag: true,
					vector_width: 0.5,
					fixxprojection: "blue",
					length: true
				}),
				VVector({name: "y", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					fixorigin: true,
					nodrag: true,
					vector_width: 0.5,
					fixyprojection: "blue",
					length: true
				}),
			],
		},
		{
			matrices: {
				rotation: [ "vx", "vy" ]
			},

			vectors: [
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "x", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					fixorigin: true,
					nodrag: true,
					vector_width: 0.5,
					fixxprojection: "blue"
				}),
				VVector({name: "y", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					fixorigin: true,
					nodrag: true,
					vector_width: 0.5,
					fixyprojection: "blue"
				}),

				VVector({name: "vx", color: 0xC91818, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					fixlength: 1,
					fixorigin: true,
					transform: ["vy", new THREE.Matrix4().makeBasis(VVector3v(0, -1, 0), VVector3v(1, 0, 0), VVector3v(0, 0, 1))]
				}),
				VVector({name: "vy", color: 0x16B51A, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					fixlength: 1,
					fixorigin: true,
					transform: ["vx", new THREE.Matrix4().makeBasis(VVector3v(0, 1, 0), VVector3v(-1, 0, 0), VVector3v(0, 0, 1))]
				}),
			],

			info_div: "<span style='font-family: serif'><em>Recipe</em>:<br />1. Apply lengths<br />2. Add components</span>"
		},
		{
			matrices: {
				rotation: [ "vx", "vy" ]
			},

			vectors: [
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "x", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					fixorigin: true,
					nodrag: true,
					vector_width: 0.5,
					fixxprojection: "blue"
				}),
				VVector({name: "y", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					fixorigin: true,
					nodrag: true,
					vector_width: 0.5,
					fixyprojection: "blue"
				}),

				VVector({name: "vx", color: 0xC91818, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					fixlength: 1,
					fixorigin: true,
					transform: ["vy", new THREE.Matrix4().makeBasis(VVector3v(0, -1, 0), VVector3v(1, 0, 0), VVector3v(0, 0, 1))]
				}),
				VVector({name: "vy", color: 0x16B51A, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					fixlength: 1,
					fixorigin: true,
					transform: ["vx", new THREE.Matrix4().makeBasis(VVector3v(0, 1, 0), VVector3v(-1, 0, 0), VVector3v(0, 0, 1))]
				}),

				VVector({name: "vxs", color: 0xC91818, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					nodrag: true,
					vector_width: 0.5,
					fixorigin: true,
					transform: ["vx", ["scaleofx", "x"]]
				}),
				VVector({name: "vys", color: 0x16B51A, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					nodrag: true,
					vector_width: 0.5,
					fixorigin: true,
					transform: ["vy", ["scaleofy", "y"]]
				}),
			],
		},
		{
			matrices: {
				rotation: [ "vx", "vy" ]
			},

			vectors: [
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					notransition: true,
					fixorigin: true
				}),
				VVector({name: "x", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					fixorigin: true,
					nodrag: true,
					vector_width: 0.5,
					fixxprojection: "blue"
				}),
				VVector({name: "y", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					fixorigin: true,
					nodrag: true,
					vector_width: 0.5,
					fixyprojection: "blue"
				}),

				VVector({name: "vx", color: 0xC91818, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					fixlength: 1,
					fixorigin: true,
					transform: ["vy", new THREE.Matrix4().makeBasis(VVector3v(0, -1, 0), VVector3v(1, 0, 0), VVector3v(0, 0, 1))]
				}),
				VVector({name: "vy", color: 0x16B51A, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					fixlength: 1,
					fixorigin: true,
					transform: ["vx", new THREE.Matrix4().makeBasis(VVector3v(0, 1, 0), VVector3v(-1, 0, 0), VVector3v(0, 0, 1))]
				}),

				VVector({name: "vxs", color: 0xC91818, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					nodrag: true,
					vector_width: 0.5,
					fixorigin: true,
					transform: ["vx", ["scaleofx", "x"]]
				}),
				VVector({name: "vys", color: 0x16B51A, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					nodrag: true,
					vector_width: 0.5,
					fixorigin: true,
					transform: ["vy", ["scaleofy", "y"]]
				}),
				VVector({name: "blue_transformed", color: 0x3939E7, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true,
					nodrag: true,
					transform: ["blue", "rotation"]
				}),
			],
		},

/*
		// SCALING MATRIX
		{
			matrices: {
				scale: [ "sx", "sy" ]
			},

			vectors: [
				VVector({name: "sx", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					fixorigin: true,
					fixxaxis: true
				}),
				VVector({name: "sy", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					fixorigin: true,
					fixyaxis: true
				}),
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true
				}),
				VVector({name: "blue_transformed", color: 0x3939E7, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true,
					nodrag: true,
					transform: ["blue", "scale"]
				}),
			],
		},

		// ARBITRARY MATRIX
		{
			matrices: {
				arbitrary: [ "ax", "ay" ]
			},

			vectors: [
				VVector({name: "ax", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					fixorigin: true
				}),
				VVector({name: "ay", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					fixorigin: true
				}),
			],

			transform_grid: "arbitrary"
		},

		{
			matrices: {
				arbitrary: [ "ax", "ay" ]
			},

			vectors: [
				VVector({name: "ax", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					fixorigin: true
				}),
				VVector({name: "ay", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					fixorigin: true
				}),
				VVector({name: "blue", color: 0x0D0D69, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true
				}),
				VVector({name: "x", color: 0x690D0D, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					fixorigin: true,
					nodrag: true,
					vector_width: 0.5,
					fixxprojection: "blue"
				}),
				VVector({name: "y", color: 0x0D690F, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					fixorigin: true,
					nodrag: true,
					vector_width: 0.5,
					fixyprojection: "blue"
				}),
				VVector({name: "vxs", color: 0xC91818, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 0, 0),
					notransition: true,
					nodrag: true,
					vector_width: 0.5,
					fixorigin: true,
					transform: ["ax", ["scaleofx", "x"]]
				}),
				VVector({name: "vys", color: 0x16B51A, v0: VVector3v(0, 0, 0), v1: VVector3v(0, 1, 0),
					notransition: true,
					nodrag: true,
					vector_width: 0.5,
					fixorigin: true,
					transform: ["ay", ["scaleofy", "y"]]
				}),
				VVector({name: "blue_transformed", color: 0x3939E7, v0: VVector3v(0, 0, 0), v1: VVector3v(1, 1, 0),
					fixorigin: true,
					nodrag: true,
					transform: ["blue", "arbitrary"]
				}),
			],
		*/

		{
			vectors: [
			],

			center_div: "<br /><br /><br /><span style='font-family: serif'><em>A word of warning</em></span>"
		},
		{
			vectors: [
			],

			center_div: "<br /><br /><br /><span style='font-family: serif'>" +
				"<em>Questions</em><br /><span style='font-size: 20px'>@VinoBS bs.vino@gmail.com</span><br /><br />" +
				"<em>http://vinoisnotouzo.com/vv</em><br /><br /><br />" +
				"<em><span style='font-size: 24px'>Arithmetical symbols are written diagrams<br /> and geometrical figures are graphic formulas.<br/>- David Hilbert<br /><br /><br /></span></em>" +
				"<em><span style='font-size: 24px'>Special thanks: Michael and William Golden, Bret Victor, Steven Wittens<br />Qamar Farooqui, Andrea Greenberg, Pax Kivimae, Alan Lee</em>" +
				"</span>"
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
	v.vector.scale.setY(v.vector_width);
	v.vector.scale.setZ(v.vector_width);
	v.vector.quaternion.setFromUnitVectors(
		new THREE.Vector3(1, 0, 0),
		direction
	);

	v.vector_head.scale.setY(v.vector_width);
	v.vector_head.scale.setZ(v.vector_width);
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
	font: 'droid serif',
	weight: 'normal',
	bevelEnabled: false
};

var angle_text_attr = {
	size: 60,
	height: 0,
	curveSegments: 3,
	font: 'droid serif',
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
}

function page_setup(page)
{
	current_page = page;

	init_vectors = pages[page].vectors;

	if ("info_div" in pages[page])
		info_div.innerHTML = pages[page].info_div;
	else
		info_div.innerHTML = "";

	if ("center_div" in pages[page])
		center_div.innerHTML = pages[page].center_div;
	else
		center_div.innerHTML = "";

	rotate_sphere.visible = !("hide_rotate" in pages[page]);

	pagenumber_div.innerHTML = "" + (page+1);

	run_matrices = pages[page].matrices;

	transform_grid_matrix = pages[page].transform_grid;

	if (pages[page].transform_grid)
	{
		scene.add(transform_grid);
		scene.add(transform_grid_strong);
	}
	else
	{
		scene.remove(transform_grid);
		scene.remove(transform_grid_strong);
	}

	for (var vname in run_vectors)
	{
		var v = run_vectors[vname];

		if (!v.kill)
		{
			remove_raycast_object(v.vector_handle);
			remove_raycast_object(v.vector_head_handle);
			remove_raycast_object(v.vector_base);
		}
		v.kill = true;

		if (v.length_label)
		{
			parentTransform.remove(v.length_label);
			v.length_label = null;
		}

		if (v.angle_label)
		{
			parentTransform.remove(v.angle_label);
			v.angle_label = null;
		}

		if (v.angle_circle)
		{
			parentTransform.remove(v.angle_circle);
			v.angle_circle = null;
		}

		if (v.angle_xaxis)
		{
			parentTransform.remove(v.angle_xaxis);
			v.angle_xaxis = null;
		}

		if (v.head_coord_label)
		{
			parentTransform.remove(v.head_coord_label);
			v.head_coord_label = null;
		}

		if (v.tail_coord_label)
		{
			parentTransform.remove(v.tail_coord_label);
			v.tail_coord_label = null;
		}

		if (v.name_label)
		{
			parentTransform.remove(v.name_label);
			v.name_label = null;
		}

		if (v.spritehead)
		{
			parentTransform.remove(v.spritehead);
			v.spritehead = null;
		}

		if (v.spriterot)
		{
			parentTransform.remove(v.spriterot);
			v.spriterot = null;
		}

		if (v.component_xaxis)
		{
			parentTransform.remove(v.component_xaxis);
			v.component_xaxis = null;
		}

		if (v.component_yaxis)
		{
			parentTransform.remove(v.component_yaxis);
			v.component_yaxis = null;
		}

		if (v.projection_v0)
		{
			parentTransform.remove(v.projection_v0);
			v.projection_v0 = null;
		}

		if (v.projection_v1)
		{
			parentTransform.remove(v.projection_v1);
			v.projection_v1 = null;
		}
	}

	for ( var i = 0; i < init_vectors.length; i ++ )
	{
		var vname = init_vectors[i].name;
		var v = run_vectors[vname];

		var init_v0 = VVector3(init_vectors[i].v0);
		var init_v1 = VVector3(init_vectors[i].v1);

		var fixorigin = false;
		var test = false;

		if ("fixorigin" in init_vectors[i] && init_vectors[i].fixorigin)
			fixorigin = true;

		if (fixorigin)
		{
			if (v && (!("fixorigin" in v) || !v.fixorigin))
			{
				test = true;
				init_v1.copy(v.v1).sub(v.v0);
			}

			init_v0 = VVector3v(0, 0, 0);
		}
		else if (init_vectors[i].fixbase)
		{
			init_v1.sub(init_v0).add(run_vectors[init_vectors[i].fixbase].v1);
			init_v0.copy(run_vectors[init_vectors[i].fixbase].v1);
		}

		if (vname in run_vectors)
		{
			if (!("notransition" in init_vectors[i]))
			{
				v.transitions = [];

				{
					var d0 = TV3_Distance(v.v0, v.v1);
					var d1 = TV3_Distance(init_v0, init_v1);
					if (Math.abs(d0 - d1) > 0.00001)
						v.transitions.push(VTransition("length", d0, d1,
							clock.getElapsedTime(), clock.getElapsedTime()+1/TRANSITION_SPEED
							));
				}
				{
					var v0 = TV3_Center(v.v0, v.v1);
					var v1 = TV3_Center(init_v0, init_v1);
					if (VVector3(v0).sub(v1).length() > 0.00001)
						v.transitions.push(VTransition("center", v0, v1,
							clock.getElapsedTime(), clock.getElapsedTime()+1/TRANSITION_SPEED
							));
				}
				{
					var q0 = TV3_Direction(v.v0, v.v1);
					var q1 = TV3_Direction(init_v0, init_v1);
					var v0 = VVector3v(1, 0, 0).applyQuaternion(q0);
					var v1 = VVector3v(1, 0, 0).applyQuaternion(q1);
					if (v0.dot(v1) < 0.9999)
						v.transitions.push(VTransition("direction", q0, q1,
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

			v = run_vectors[vname] = {};
			v.transitions = [];
			v.multiples = [];
			v.vector = vector;
			v.vector_head = vector_head;
			v.vector_handle = vector_handle;
			v.vector_head_handle = vector_head_handle;
			v.vector_base = vector_base;

			v.vector.material.transparent = true;
			v.vector.material.opacity = 0;
		}

		v.fixorigin = fixorigin;

		if (fixorigin || "fixbase" in init_vectors[i])
		{
			v.vector.userData.meshtype = "head_offset";
			v.vector_handle.userData.meshtype = "head_offset";
			v.vector_head.userData.meshtype = "head";
			v.vector_head_handle.userData.meshtype = "head";
			v.vector_base.userData.meshtype = "head_offset";
		}
		else
		{
			v.vector.userData.meshtype = "body";
			v.vector_handle.userData.meshtype = "body";
			v.vector_head.userData.meshtype = "head";
			v.vector_head_handle.userData.meshtype = "head";
			v.vector_base.userData.meshtype = "base";
		}

		v.fixbase = init_vectors[i].fixbase;
		v.fixhead = init_vectors[i].fixhead;
		v.fixheadsum = init_vectors[i].fixheadsum;
		v.fixdirection = init_vectors[i].fixdirection;
		v.fixlength = init_vectors[i].fixlength;
		v.fixxprojection = init_vectors[i].fixxprojection;
		v.fixyprojection = init_vectors[i].fixyprojection;
		v.transform = init_vectors[i].transform;
		v.fixxaxis = init_vectors[i].fixxaxis;
		v.fixyaxis = init_vectors[i].fixyaxis;
		v.fixprojection = init_vectors[i].fixprojection;
		v.show_multiples = init_vectors[i].show_multiples;

		if ("vector_width" in init_vectors[i])
			v.vector_width = init_vectors[i].vector_width;
		else
			v.vector_width = 1;

		if ("length" in init_vectors[i])
		{
			var text_material = new THREE.MeshBasicMaterial( { color: 0x0 } );
			var text_geometry = new THREE.TextGeometry("Length", length_text_attr);

			text_geometry.computeBoundingBox();

			var scale = 0.005;

			v.length_label = new THREE.Mesh( text_geometry, text_material );
			v.length_label.scale.copy(VVector3v(scale, scale, scale));
			parentTransform.add(v.length_label);

			v.length_label.text_size = (text_geometry.boundingBox.max.x - text_geometry.boundingBox.min.x) * v.length_label.scale.x;
		}

		if ("angle" in init_vectors[i] || "angleto" in init_vectors[i])
		{
			var text_material = new THREE.MeshBasicMaterial( { color: 0x0 } );
			var text_geometry = new THREE.TextGeometry("angle: 123.45", angle_text_attr);

			text_geometry.computeBoundingBox();

			var scale = 0.005;

			v.angle_label = new THREE.Mesh( text_geometry, text_material );
			v.angle_label.scale.copy(VVector3v(scale, scale, scale));
			parentTransform.add(v.angle_label);

			v.angle_label.text_size = (text_geometry.boundingBox.max.x - text_geometry.boundingBox.min.x) * v.angle_label.scale.x;

			var circle_geometry = new THREE.RingGeometry(1, 5, 32);
			v.angle_circle = new THREE.Mesh(circle_geometry, text_material);
			parentTransform.add(v.angle_circle);

			if ("angle" in init_vectors[i])
			{
				var xaxis_geometry = new THREE.Geometry();

				for (var k = 0; k < 2; k += 0.2)
					xaxis_geometry.vertices.push(
						new THREE.Vector3( k, 0, 0 ),
						new THREE.Vector3( k+0.08, 0, 0 )
					);

				var xaxis_material = new THREE.LineBasicMaterial( { color: 0 } );
				v.angle_xaxis = new THREE.LineSegments(xaxis_geometry, xaxis_material);
				parentTransform.add(v.angle_xaxis);
			}

			if ("angleto" in init_vectors[i])
				v.angleto = init_vectors[i].angleto;

			v.angle_label.text_size = (text_geometry.boundingBox.max.x - text_geometry.boundingBox.min.x) * v.angle_label.scale.x;
		}

		if ("coordinates" in init_vectors[i])
		{
			var text_material = new THREE.MeshBasicMaterial( { color: 0x0 } );
			var text_geometry = new THREE.TextGeometry("(0.00, 0.00)", length_text_attr);

			text_geometry.computeBoundingBox();

			var scale = 0.005;

			v.head_coord_label = new THREE.Mesh( text_geometry, text_material );
			v.head_coord_label.scale.copy(VVector3v(scale, scale, scale));
			parentTransform.add(v.head_coord_label);
			v.head_coord_label.text_size = (text_geometry.boundingBox.max.x - text_geometry.boundingBox.min.x) * v.head_coord_label.scale.x;

			/*v.tail_coord_label = new THREE.Mesh( text_geometry, text_material );
			v.tail_coord_label.scale.copy(VVector3v(scale, scale, scale));
			parentTransform.add(v.tail_coord_label);
			v.tail_coord_label.text_size = (text_geometry.boundingBox.max.x - text_geometry.boundingBox.min.x) * v.tail_coord_label.scale.x;*/
		}

		if ("label" in init_vectors[i])
		{
			var text_material = new THREE.MeshBasicMaterial( { color: 0x0 } );
			var text_geometry = new THREE.TextGeometry(init_vectors[i].label, length_text_attr);

			text_geometry.computeBoundingBox();

			var scale = 0.005;

			v.name_label = new THREE.Mesh( text_geometry, text_material );
			v.name_label.scale.copy(VVector3v(scale, scale, scale));
			parentTransform.add(v.name_label);

			v.name_label.text_size = (text_geometry.boundingBox.max.x - text_geometry.boundingBox.min.x) * v.name_label.scale.x;

			v.name_label_text = init_vectors[i].label;
		}

		if ("notransition" in init_vectors[i])
		{
			if (!("v0" in v))
				v.v0 = VVector3(init_v0);
			if (!("v1" in v))
				v.v1 = VVector3(init_v1);
		}
		else
		{
			v.v0 = VVector3(init_v0);
			v.v1 = VVector3(init_v1);
		}

		if (v.fixprojection)
		{
			var xaxis_geometry = new THREE.Geometry();

			xaxis_geometry.vertices.push(
				new THREE.Vector3( 0, 0, 0 ),
				new THREE.Vector3( 1, 0, 0 )
			);

			var xaxis_material = new THREE.LineBasicMaterial( { color: 0 } );

			v.projection_v0 = new THREE.LineSegments(xaxis_geometry, xaxis_material);
			parentTransform.add(v.projection_v0);

			v.projection_v1 = new THREE.LineSegments(xaxis_geometry, xaxis_material);
			parentTransform.add(v.projection_v1);
		}

		if (v.fixxprojection)
		{
			var xaxis_geometry = new THREE.Geometry();

			xaxis_geometry.vertices.push(
				new THREE.Vector3( 0, 0, 0 ),
				new THREE.Vector3( 0, 1, 0 )
			);

			var xaxis_material = new THREE.LineBasicMaterial( { color: 0 } );
			v.component_xaxis = new THREE.LineSegments(xaxis_geometry, xaxis_material);
			parentTransform.add(v.component_xaxis);
		}

		if (v.fixyprojection)
		{
			var yaxis_geometry = new THREE.Geometry();

			yaxis_geometry.vertices.push(
				new THREE.Vector3( 0, 0, 0 ),
				new THREE.Vector3( 1, 0, 0 )
			);

			var yaxis_material = new THREE.LineBasicMaterial( { color: 0 } );
			v.component_yaxis = new THREE.LineSegments(yaxis_geometry, yaxis_material);
			parentTransform.add(v.component_yaxis);
		}

		v.kill = false;

		if (!("nodrag" in init_vectors[i]))
		{
			raycast_objects.push(v.vector_base);
			raycast_objects.push(v.vector_handle);
			raycast_objects.push(v.vector_head_handle);
		}

		if ("spritehead" in init_vectors[i])
		{
			v.spritehead = mesh_from_name(init_vectors[i].spritehead);
			parentTransform.add(v.spritehead);
		}

		if ("spriterot" in init_vectors[i])
		{
			v.spriterot = mesh_from_name(init_vectors[i].spriterot);
			parentTransform.add(v.spriterot);
		}

		arrangeVVector(init_vectors[i].name);

		v.old_length = 0;
		update_length_label(v);

		v.old_angle = -7;
		update_angle_label(v);

		v.old_head_coords = -100;
		v.old_tail_coords = -100;
		update_coords_label(v);
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
var center_div;
var pagenumber_div;

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.bottom = '20px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.style.fontSize = "34px";
	info.innerHTML = '';
	container.appendChild( info );

	info_div = info;

	var center = document.createElement( 'div' );
	center.style.position = 'absolute';
	center.style.top = '20px';
	center.style.width = '100%';
	center.style.textAlign = 'center';
	center.style.fontSize = "34px";
	center.innerHTML = '';
	container.appendChild( center );

	center_div = center;

	pagenumber_div = document.createElement( 'div' );
	pagenumber_div.style.position = 'absolute';
	pagenumber_div.style.bottom = '20px';
	pagenumber_div.style.right = '20px';
	pagenumber_div.style.width = '100%';
	pagenumber_div.style.textAlign = 'right';
	pagenumber_div.style.fontSize = "24px";
	pagenumber_div.innerHTML = '';
	container.appendChild( pagenumber_div );

	var width = window.innerWidth;
	var height = window.innerHeight;
	var ratio = height/width;
	var size = 10;
	//camera = new THREE.OrthographicCamera( -size, size, size*ratio, -size*ratio, -1, 10000 );
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

	scene = new THREE.Scene();

	var light = new THREE.AmbientLight( 0xfff4d4 );
	scene.add( light );

	var light = new THREE.PointLight( 0xffffff, 1, 100 );
	light.position.set( -4, -2, 2 );
	scene.add( light );

	rotate_sphere_geometry = new THREE.SphereGeometry(0.3, 30, 20);
	var sphere_material = new THREE.MeshLambertMaterial( { color: 0x757263, transparent: true, opacity: 0.5 } );
	rotate_sphere = new THREE.Mesh( rotate_sphere_geometry, sphere_material );
	rotate_sphere.position.copy(VVector3v(-5, -2, 0));
	scene.add(rotate_sphere);

	raycast_objects.push(rotate_sphere);

	var spritegeometry = new THREE.BoxGeometry( 1, 1, 0 );

	var texture_mario = THREE.ImageUtils.loadTexture( "textures/mario.png" );
	var material_mario = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture_mario, alphaTest: 0.5 } );
	mesh_mario = new THREE.Mesh( spritegeometry, material_mario );

	texture_pacman1 = THREE.ImageUtils.loadTexture( "textures/pacman1.png" );
	texture_pacman2 = THREE.ImageUtils.loadTexture( "textures/pacman2.png" );
	var material_pacman = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture_pacman1, alphaTest: 0.5 } );
	mesh_pacman = new THREE.Mesh( spritegeometry, material_pacman );

	texture_clyde_u = THREE.ImageUtils.loadTexture( "textures/clyde-u.png" );
	texture_clyde_ur = THREE.ImageUtils.loadTexture( "textures/clyde-ur.png" );
	texture_clyde_ul = THREE.ImageUtils.loadTexture( "textures/clyde-ul.png" );
	texture_clyde_d = THREE.ImageUtils.loadTexture( "textures/clyde-d.png" );
	texture_clyde_dr = THREE.ImageUtils.loadTexture( "textures/clyde-dr.png" );
	texture_clyde_dl = THREE.ImageUtils.loadTexture( "textures/clyde-dl.png" );
	var material_clyde = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture_clyde_ul, alphaTest: 0.5 } );
	mesh_clyde = new THREE.Mesh( spritegeometry, material_clyde );

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

	transform_grid = new THREE.LineSegments(grid_geometry, grid_material);
	transform_grid_strong = new THREE.LineSegments(grid_strong_geometry, grid_strong_material);

	var geometry = new THREE.SphereGeometry( 0.08, 16, 12 );
	var dot_material = new THREE.MeshBasicMaterial( { color: 0x6a99b1, transparent: true, opacity: 0.5 } );

	sphereInter = new THREE.Mesh( geometry, dot_material );
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

/*
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
*/

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

	mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

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

		run_constraints(run_vectors[drag_object]);

		arrangeVVector(drag_object);
	}
	else if (rotating)
	{
		rotate_horizontal = Math.atan(mouse.x - rotate_mouse_start_x) * 0.8;
		rotate_vertical = Math.atan(mouse.y - rotate_mouse_start_y) * 0.8;
	}
}

function onDocumentMouseDown( event ) {
	event.preventDefault();

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( raycast_objects, true);

	if (!intersects.length)
		return;

	if (intersects[0].object == rotate_sphere)
	{
		rotating = true;
		rotate_mouse_start_x = mouse.x;
		rotate_mouse_start_y = mouse.y;
	}
	else
	{
		dragging = true;
		drag_object = intersects[0].object.userData.vname;
		drag_object_type = intersects[0].object.userData.meshtype;
		drag_object_handle.copy(intersects[0].point);
		drag_object_offset.copy(drag_object_handle);
		drag_object_offset.sub(intersects[0].object.position);
		drag_object_v1.copy(run_vectors[drag_object].v1);
	}
}

function onDocumentMouseUp( event ) {
	event.preventDefault();

	raycaster.setFromCamera( mouse, camera );

	dragging = false;
	rotating = false;
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
	if (stats)
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

	var vec_normalized = VVector3(vector.v1).sub(vector.v0).normalize();
	var new_angle = Math.acos(vec_normalized.dot(VVector3v(1, 0, 0)));

	if (vector.angleto)
	{
		var othervec = run_vectors[vector.angleto];
		var othervec_normalized = VVector3(othervec.v1).sub(othervec.v0).normalize();

		var average_vector = VVector3(vector.v1)
			.sub(vector.v0)
			.normalize()
			.add(othervec_normalized)
			.normalize();

		vector.angle_label.position.copy(
			VVector3(average_vector)
				.add(vector.v0)
				.sub(scale)
		);

		if (average_vector.x < 0)
			vector.angle_label.position.add(VVector3v(-1.1, 0, 0).multiplyScalar(vector.angle_label.text_size))
	}
	else
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
	if (vector.angle_xaxis)
		vector.angle_xaxis.position.copy(vector.v0);

	if (vector.angleto)
	{
		var othervec = run_vectors[vector.angleto];
		var othervec_normalized = VVector3(othervec.v1).sub(othervec.v0).normalize();
		new_angle = Math.acos(vec_normalized.dot(othervec_normalized));
	}

	var new_angle_degrees = new_angle * 180 / Math.PI;

	if (shift_down && Math.abs(Math.round(new_angle_degrees) - new_angle_degrees) < 0.1)
		new_angle_degrees = Math.round(new_angle_degrees);

	if (!vector.angleto && vector.v1.y - vector.v0.y < 0)
		new_angle_degrees = -new_angle_degrees;

	if (vector.old_angle == null || vector.old_angle != new_angle)
	{
		vector.angle_label.geometry = new THREE.TextGeometry("angle: " + new_angle_degrees.toFixed(2) + "°", length_text_attr);

		vector.angle_circle.geometry = new THREE.RingGeometry(0.7, 0.75, 30, 1, 0, new_angle);

		if (vector.angleto)
		{
			var vec_angle = Math.atan2(vec_normalized.y, vec_normalized.x);
			var vec2_angle = Math.atan2(othervec_normalized.y, othervec_normalized.x);

			var difference = (vec2_angle - vec_angle);
			if (difference < -Math.PI)
				difference += Math.PI * 2;
			else if (difference > Math.PI)
				difference -= Math.PI * 2;

			if (difference > 0)
				vector.angle_circle.geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( vec_angle ) );
			else
				vector.angle_circle.geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( vec_angle + difference ) );
		}
		else if (vector.v1.y - vector.v0.y < 0)
			vector.angle_circle.geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( -new_angle ) );
	}

	vector.old_angle = new_angle;
}

function update_coords_label(vector)
{
	if (vector.head_coord_label != undefined && vector.head_coord_label != null)
	{
		var offset = VVector3v(0.4, 0.2, -0.1);
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

function run_constraints(vector)
{
	var arrange = false;

	if (vector.transform && run_vectors[drag_object] != vector)
	{
		var transform_vector = run_vectors[vector.transform[0]]
		if (transform_vector)
		{
			var matrix = vector.transform[1];
			if (typeof(matrix) === 'string')
			{
				if (run_matrices && run_matrices[matrix])
				{
					var vx = run_vectors[run_matrices[matrix][0]].v1;
					var vy = run_vectors[run_matrices[matrix][1]].v1;
					matrix = new THREE.Matrix4().makeBasis(vx, vy, VVector3v(0, 0, 1));

					vector.v1.copy(
						VVector3(transform_vector.v1).sub(transform_vector.v0)
						.applyMatrix4(matrix)
						.add(transform_vector.v0)
					);

					arrange = true;
				}
			}
			else if (Array.isArray(matrix))
			{
				if (matrix[0] == 'scaleofx')
				{
					var scale = run_vectors[matrix[1]].v1.dot(VVector3v(1, 0, 0));
					matrix = new THREE.Matrix4().makeBasis(VVector3v(scale, 0, 0), VVector3v(0, scale, 0), VVector3v(0, 0, scale));

					vector.v1.copy(
						VVector3(transform_vector.v1)
						.sub(transform_vector.v0)
						.applyMatrix4(matrix)
						.add(transform_vector.v0)
					);

					arrange = true;
				}
				else if (matrix[0] == 'scaleofy')
				{
					var scale = run_vectors[matrix[1]].v1.dot(VVector3v(0, 1, 0));
					matrix = new THREE.Matrix4().makeBasis(VVector3v(scale, 0, 0), VVector3v(0, scale, 0), VVector3v(0, 0, scale));

					vector.v1.copy(
						VVector3(transform_vector.v1)
						.sub(transform_vector.v0)
						.applyMatrix4(matrix)
						.add(transform_vector.v0)
					);

					arrange = true;
				}
			}
			else
			{
				vector.v1.copy(
					VVector3(transform_vector.v1).sub(transform_vector.v0)
					.applyMatrix4(matrix)
					.add(transform_vector.v0)
				);

				arrange = true;
			}
		}
	}

	if (vector.fixdirection && run_vectors[drag_object] != vector)
	{
		var dir_vector = run_vectors[vector.fixdirection];
		if (!dir_vector)
			console.error("Couldn't find direction vector: " + vector.fixdirection);

		var new_direction = TV3_Direction(dir_vector.v0, dir_vector.v1);

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

		arrange = true;
	}

	if (vector.fixlength)
	{
		var new_length = vector.fixlength;
		//var length_vector = run_vectors[vector.fixlength];
		//if (length_vector)
		//	new_length = TV3_Distance(length_vector.v0, length_vector.v1);

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

		arrange = true;
	}

	if (vector.fixprojection)
	{
		var original_vector = run_vectors[vector.fixprojection[0]];
		var projection_vector = run_vectors[vector.fixprojection[1]];

		vector.v0.copy(TV3_NearestPointOnLine(original_vector.v0, projection_vector.v0, projection_vector.v1));
		vector.v0.setZ(0.1);
		vector.v1.copy(TV3_NearestPointOnLine(original_vector.v1, projection_vector.v0, projection_vector.v1));
		vector.v1.setZ(0.1);

		if (vector.projection_v0)
		{
			var xaxis_geometry = new THREE.Geometry();

			xaxis_geometry.vertices.push(
				VVector3(vector.v0),
				VVector3(original_vector.v0)
			);

			vector.projection_v0.geometry = xaxis_geometry;
		}

		if (vector.projection_v1)
		{
			var xaxis_geometry = new THREE.Geometry();

			xaxis_geometry.vertices.push(
				VVector3(vector.v1),
				VVector3(original_vector.v1)
			);

			vector.projection_v1.geometry = xaxis_geometry;
		}

		arrange = true;
	}

	if (vector.fixxprojection)
	{
		vector.v1.copy(run_vectors[vector.fixxprojection].v0);
		vector.v1.setX(run_vectors[vector.fixxprojection].v1.x);
		vector.v0.copy(run_vectors[vector.fixxprojection].v0);

		if (vector.component_xaxis)
		{
			vector.component_xaxis.position.copy(vector.v1);
			vector.component_xaxis.scale.copy(VVector3v(1, 1, 1));
			vector.component_xaxis.scale.setY(run_vectors[vector.fixxprojection].v1.y - run_vectors[vector.fixxprojection].v0.y);
		}

		arrange = true;
	}

	if (vector.fixyprojection)
	{
		vector.v1.copy(run_vectors[vector.fixyprojection].v0);
		vector.v1.setY(run_vectors[vector.fixyprojection].v1.y);
		vector.v0.copy(run_vectors[vector.fixyprojection].v0);

		if (vector.component_yaxis)
		{
			vector.component_yaxis.position.copy(vector.v1);
			vector.component_yaxis.scale.copy(VVector3v(1, 1, 1));
			vector.component_yaxis.scale.setX(run_vectors[vector.fixyprojection].v1.x - run_vectors[vector.fixyprojection].v0.x);
		}

		arrange = true;
	}

	if (vector.fixorigin)
	{
		var transition = false;
		for (var t in vector.transitions)
		{
			if (vector.transitions[t].type == "center")
			{
				transition = true;
				break;
			}
		}

		if (!transition)
		{
			vector.v1.sub(vector.v0);
			vector.v0.copy(VVector3v(0, 0, 0));
			arrange = true;
		}
	}

	if (vector.fixbase)
	{
		var base_vector = run_vectors[vector.fixbase];
		if (base_vector)
		{
			vector.v1.copy(VVector3(vector.v1).sub(vector.v0).add(base_vector.v1));
			vector.v0.copy(base_vector.v1);

			arrange = true;
		}
	}

	if (vector.fixhead)
	{
		var head_vector = run_vectors[vector.fixhead];
		if (!head_vector)
			console.error("Couldn't find head vector: " + vector.fixhead);

		vector.v1.copy(head_vector.v1);

		arrange = true;
	}

	if (vector.fixheadsum)
	{
		var sum = VVector3v(0, 0, 0);

		for (var i in vector.fixheadsum)
		{
			var term_vector = run_vectors[vector.fixheadsum[i]];
			if (!term_vector)
				console.error("Couldn't find head vector: " + vector.fixheadsum[i]);

			sum.add(VVector3(term_vector.v1).sub(term_vector.v0));
		}

		vector.v1.copy(sum);

		arrange = true;
	}

	if (vector.fixxaxis)
	{
		vector.v0.setY(0);
		vector.v0.setZ(0);
		vector.v1.setY(0);
		vector.v1.setZ(0);

		arrange = true;
	}

	if (vector.fixyaxis)
	{
		vector.v0.setX(0);
		vector.v0.setZ(0);
		vector.v1.setX(0);
		vector.v1.setZ(0);

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

	return arrange;
}

function render() {
	dt = clock.getDelta();

	camera.position.x = Math.sin(rotate_horizontal) * 10;//Math.cos(clock.getElapsedTime())*10;
	camera.position.y = Math.sin(rotate_vertical) * 10;
	camera.position.z = 10;//Math.sin(clock.getElapsedTime())*10;
	camera.lookAt( new THREE.Vector3(0, 0, 0) );


	if (!rotating)
	{
		rotate_horizontal *= 0.95;
		rotate_vertical *= 0.95;
	}

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

	if ((clock.getElapsedTime() % 0.8) < 0.4)
		mesh_pacman.material.map = texture_pacman1;
	else
		mesh_pacman.material.map = texture_pacman2;

	var clyde_to_pacman = VVector3(mesh_pacman.position).sub(mesh_clyde.position).normalize();
	var dot_up = clyde_to_pacman.dot(VVector3v(0, 1, 0));
	var dot_right = clyde_to_pacman.dot(VVector3v(1, 0, 0));

	if (dot_up > 0)
	{
		if (dot_right > 0.5)
			mesh_clyde.material.map = texture_clyde_ur;
		else if (dot_right < -0.5)
			mesh_clyde.material.map = texture_clyde_ul;
		else
			mesh_clyde.material.map = texture_clyde_u;
	}
	else
	{
		if (dot_right > 0.5)
			mesh_clyde.material.map = texture_clyde_dr;
		else if (dot_right < -0.5)
			mesh_clyde.material.map = texture_clyde_dl;
		else
			mesh_clyde.material.map = texture_clyde_d;
	}

	// Handle animations
	for (var k in run_vectors)
	{
		var vector = run_vectors[k];

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

		var arrange = run_constraints(vector);

		if (arrange)
			arrangeVVector(k);

		if (vector.spritehead)
		{
			vector.spritehead.position.copy(vector.v1);
			vector.spritehead.quaternion.copy(new THREE.Quaternion());
		}

		if (vector.spriterot)
		{
			vector.spriterot.position.copy(vector.v0);
			vector.spriterot.quaternion.copy(TV3_Direction(vector.v0, vector.v1));
		}

		update_length_label(vector);
		update_angle_label(vector);
		update_coords_label(vector);

		if (vector.show_multiples)
		{
			var vector_length = VVector3(vector.v1).sub(vector.v0).length();

			var other_vector = run_vectors[vector.show_multiples];
			var other_vector_length = VVector3(other_vector.v1).sub(other_vector.v0).length();

			var num_multiples = Math.floor(vector_length/other_vector_length);

			while (vector.multiples.length > num_multiples)
			{
				var last_multiple = vector.multiples[vector.multiples.length-1];
				parentTransform.remove(last_multiple.body);
				parentTransform.remove(last_multiple.head);
				vector.multiples.pop();
			}

			var arrow_material = new THREE.MeshBasicMaterial( { color: other_vector.vector.material.color } );

			while (vector.multiples.length < num_multiples)
			{
				var multiple = {
					body: new THREE.Mesh( vector_geometry, arrow_material ),
					head: new THREE.Mesh( head_geometry, arrow_material )
				};

				parentTransform.add(multiple.body);
				parentTransform.add(multiple.head);
				vector.multiples.push(multiple);
			}

			var vec_start = VVector3(vector.v0);
			var vec_direction = VVector3(vector.v1).sub(vector.v0).normalize().multiplyScalar(other_vector_length);

			for (var k = 0; k < vector.multiples.length; k++)
			{
				vector.multiples[k].body.position.copy(vec_start);
				vector.multiples[k].body.position.setZ(0.1);
				vector.multiples[k].head.position.copy(VVector3(vec_start).add(vec_direction));
				vector.multiples[k].head.position.setZ(0.1);

				var direction = VVector3(vector.v1).sub(vector.v0).normalize();

				vector.multiples[k].body.scale.setX(other_vector_length - 0.25);
				vector.multiples[k].body.scale.setY(0.5);
				vector.multiples[k].body.scale.setZ(0.5);
				vector.multiples[k].body.quaternion.setFromUnitVectors(
					new THREE.Vector3(1, 0, 0),
					direction
				);

				vector.multiples[k].head.scale.setY(1.2);
				vector.multiples[k].head.scale.setZ(1.2);
				vector.multiples[k].head.quaternion.setFromUnitVectors(
					new THREE.Vector3(1, 0, 0),
					direction
				);

				vec_start.add(vec_direction);
			}
		}
		else
		{
			while (vector.multiples.length)
			{
				var last_multiple = vector.multiples[vector.multiples.length-1];
				parentTransform.remove(last_multiple.body);
				parentTransform.remove(last_multiple.head);
				vector.multiples.pop();
			}
		}

		if (vector.name_label != undefined && vector.name_label != null)
		{
			var scale = VVector3v(1, 0, 0).multiplyScalar(vector.name_label.text_size);
			vector.name_label.position.copy(
				VVector3(vector.v1)
					.sub(VVector3(vector.v0))
					.multiplyScalar(0.5)
					.add(vector.v0)
					.sub(scale)
					.add(VVector3v(-0.2, 0.2, 0))
			);
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

	if (transform_grid_matrix)
	{
		var matrix = run_matrices[transform_grid_matrix];
		var vx = VVector3(run_vectors[matrix[0]].v1).sub(run_vectors[matrix[0]].v0);
		var vy = VVector3(run_vectors[matrix[1]].v1).sub(run_vectors[matrix[1]].v0);

		var M = new THREE.Matrix4().makeBasis(vx, vy, VVector3v(0, 0, 0));
		transform_grid.matrix.identity().multiply(M);
		transform_grid_strong.matrix.identity().multiply(M);

		transform_grid.matrixAutoUpdate = false;
		transform_grid_strong.matrixAutoUpdate = false;
	}

	renderer.render( scene, camera );

	if (pages[current_page].info_vector_distance)
	{
		var vector_a_name = pages[current_page].info_vector_distance[0];
		var vector_b_name = pages[current_page].info_vector_distance[1];
		var vector_c_name = pages[current_page].info_vector_distance[2];
		var vector_a = run_vectors[vector_a_name];
		var vector_b = run_vectors[vector_b_name];
		var vector_c = run_vectors[vector_c_name];
		var distance = TV3_Distance(vector_b.v1, vector_a.v1);
		var a = run_vectors[vector_a_name].name_label_text;
		var b = run_vectors[vector_b_name].name_label_text;
		var c = run_vectors[vector_c_name].name_label_text;
		info_div.innerHTML = "<span style='font-family: serif'>|<em>" + c + "</em>| = |<em>" + b + " - " + a + "</em>| = " + distance.toFixed(3) + "</span><br />"
			+ b + ".sub(" + a + ").length();";
	}

	if (pages[current_page].info_scalar_multiplication)
	{
		var vector_a_name = pages[current_page].info_scalar_multiplication[1];
		var vector_b_name = pages[current_page].info_scalar_multiplication[0];
		var vector_a = run_vectors[vector_a_name];
		var vector_b = run_vectors[vector_b_name];
		var ratio = TV3_Distance(vector_a.v0, vector_a.v1)/TV3_Distance(vector_b.v0, vector_b.v1);
		info_div.innerHTML = "<span style='font-family: serif'><em>" + run_vectors[vector_a_name].name_label_text + " = " + ratio.toFixed(3) + run_vectors[vector_b_name].name_label_text + "</em></span><br />"
			+ run_vectors[vector_a_name].name_label_text + " = " + run_vectors[vector_b_name].name_label_text + ".multiplyScalar(" + ratio.toFixed(3) + ");";
	}

	if (pages[current_page].info_normalize)
	{
		var vector_a_name = pages[current_page].info_normalize[1];
		var vector_b_name = pages[current_page].info_normalize[0];
		var vector_a = run_vectors[vector_a_name];
		var vector_b = run_vectors[vector_b_name];
		var ratio = TV3_Distance(vector_a.v0, vector_a.v1)/TV3_Distance(vector_b.v0, vector_b.v1);
		info_div.innerHTML = "<span style='font-family: serif'><em>" + run_vectors[vector_a_name].name_label_text + " = a · </em>1/|<em>" + run_vectors[vector_b_name].name_label_text + "</em>|</span><br />"
			+ run_vectors[vector_a_name].name_label_text + " = " + run_vectors[vector_b_name].name_label_text + ".normalize();";
	}

	if (pages[current_page].info_dot_product)
	{
		var vector_a_name = pages[current_page].info_dot_product[0];
		var vector_b_name = pages[current_page].info_dot_product[1];
		var vector_a = run_vectors[vector_a_name];
		var vector_b = run_vectors[vector_b_name];
		var dot = VVector3(vector_a.v0).sub(vector_a.v1).dot(VVector3(vector_b.v0).sub(vector_b.v1));
		info_div.innerHTML = "<span style='font-family: serif'><em>" + run_vectors[vector_a_name].name_label_text + " · " + run_vectors[vector_b_name].name_label_text + " = " + dot.toFixed(3) + "</em></span><br />"
			+ run_vectors[vector_a_name].name_label_text + "_dot_" + run_vectors[vector_b_name].name_label_text + " = " + run_vectors[vector_a_name].name_label_text + ".dot(" + run_vectors[vector_b_name].name_label_text + ");";
	}

	if (pages[current_page].info_dot_product_angle)
	{
		var vector_a_name = pages[current_page].info_dot_product_angle[0];
		var vector_b_name = pages[current_page].info_dot_product_angle[1];
		var vector_a = run_vectors[vector_a_name];
		var vector_b = run_vectors[vector_b_name];
		var vector3_a = VVector3(vector_a.v0).sub(vector_a.v1);
		var vector3_b = VVector3(vector_b.v0).sub(vector_b.v1);
		var vector3_a_length = vector3_a.length();
		var vector3_b_length = vector3_b.length();
		var dot = vector3_a.normalize().dot(vector3_b.normalize());
		var a = run_vectors[vector_a_name].name_label_text;
		var b = run_vectors[vector_b_name].name_label_text;
		info_div.innerHTML = "<span style='font-family: serif'><em>" + a + " · " + b + " = </em>|<em>" + a + "</em>| × |<em>" + b + "</em>| × cos(<em>θ</em>)<br /> = "
			+ vector3_a_length.toFixed(1) + " × " + vector3_b_length.toFixed(1) + " × " + dot.toFixed(1) + " = " + (vector3_a_length*vector3_b_length*dot).toFixed(3) + "</span><br />"
			+ a + "_dot_" + b + " = " + a + ".dot(" + b + ");";
	}

	if (pages[current_page].info_dot_product_lengthsqr)
	{
		var vector_a_name = pages[current_page].info_dot_product_lengthsqr;
		var vector_a = run_vectors[vector_a_name];
		var vector3_a = VVector3(vector_a.v0).sub(vector_a.v1);
		var vector3_a_length = vector3_a.length();
		var dot = vector3_a.normalize().dot(vector3_a.normalize());
		var a = run_vectors[vector_a_name].name_label_text;
		info_div.innerHTML = "<span style='font-family: serif'><em>" + a + " · " + a + " = </em>|<em>" + a + "</em>| × |<em>" + a + "</em>| × cos(<em>θ</em>)<br /> = "
			+ vector3_a_length.toFixed(1) + " × " + vector3_a_length.toFixed(1) + " × " + dot.toFixed(1) + " = " + (vector3_a_length*vector3_a_length*dot).toFixed(3) + "</span><br />"
			+ "length_" + a + "_sqr = " + a + ".dot(" + a + ");";
	}

	if (pages[current_page].info_components)
	{
		var vector_name = pages[current_page].info_components;
		var vector = run_vectors[vector_name];
		var vector3 = VVector3(vector.v1).sub(vector.v0);
		var a = run_vectors[vector_name].name_label_text;
		info_div.innerHTML = "<span style='font-family: serif'><em>" + a + "<sub>x</sub> = " + vector3.x.toFixed(3) + "</span><br />"
			+ a + ".x = " + vector3.x.toFixed(3) + ";<br />";
	}

	if (pages[current_page].info_dot_product_projection)
	{
		var vector_a_name = pages[current_page].info_dot_product_projection[0];
		var vector_b_name = pages[current_page].info_dot_product_projection[1];
		var vector_a = run_vectors[vector_a_name];
		var vector_b = run_vectors[vector_b_name];
		var vector3_a = VVector3(vector_a.v0).sub(vector_a.v1);
		var vector3_b = VVector3(vector_b.v0).sub(vector_b.v1);
		var dot = vector3_a.dot(vector3_b);
		var vector3_a_length = vector3_a.length();
		var vector3_b_length = vector3_b.length();
		var dot_normalized = vector3_a.normalize().dot(vector3_b.normalize());
		var a = run_vectors[vector_a_name].name_label_text;
		var b = run_vectors[vector_b_name].name_label_text;
		info_div.innerHTML = "<span style='font-family: serif'>(<em>" + a + "</em> · <em>" + b + "</em>) <em>" + b + " = </em>(" + dot.toFixed(2) + ") <em>" + b + "</em><br /><br />";
	}

	if (pages[current_page].info_projection)
	{
		var vector_a_name = pages[current_page].info_projection[0];
		var vector_b_name = pages[current_page].info_projection[1];
		var vector_a = run_vectors[vector_a_name];
		var vector_b = run_vectors[vector_b_name];
		var vector3_a = VVector3(vector_a.v0).sub(vector_a.v1);
		var vector3_b = VVector3(vector_b.v0).sub(vector_b.v1);
		var dot = vector3_a.dot(vector3_b) / vector3_b.dot(vector3_b);
		var vector3_a_length = vector3_a.length();
		var vector3_b_length = vector3_b.length();
		var a = run_vectors[vector_a_name].name_label_text;
		var b = run_vectors[vector_b_name].name_label_text;
		info_div.innerHTML = "<span style='font-family: serif'>(<em>" + a + "</em> · <em>" + b + "</em> / <em>" + b + "</em> · <em>" + b + "</em>) <em>" + b + "</em> = </em>(" + dot.toFixed(2) + ") <em>" + b + "</em><br /><br />";
	}

	if (pages[current_page].info_rotation_by)
	{
		var vector_name = pages[current_page].info_rotation_by;
		var vector = run_vectors[vector_name];
		var vector3 = VVector3(vector.v1).sub(vector.v0);
		var angle = Math.atan2(vector3.y, vector3.x) / 2 / Math.PI * 360;
		var a = run_vectors[vector_name].name_label_text;
		info_div.innerHTML = "<span style='font-family: serif'>Rotation by " + angle.toFixed(2) + "°</span>";
	}

	if (pages[current_page].info_general_matrix_construction)
	{
		var vector_name_a = pages[current_page].info_general_matrix_construction[0];
		var vector_name_b = pages[current_page].info_general_matrix_construction[1];
		var vector_a = run_vectors[vector_name_a];
		var vector_b = run_vectors[vector_name_b];
		var a = run_vectors[vector_name_a].name_label_text;
		var b = run_vectors[vector_name_b].name_label_text;
		info_div.innerHTML = "<span style='font-family: serif'>M = [" + a + ", " + b + "]</span><br />"
			+ "new THREE.Matrix4().makeBasis(" + a + ", " + b + ");<br />";
	}

	if (pages[current_page].info_rotation_matrix_construction)
	{
		var vector_name = pages[current_page].info_rotation_matrix_construction;
		var vector = run_vectors[vector_name];
		var vector3 = VVector3(vector.v1).sub(vector.v0);
		var angle = Math.atan2(vector3.y, vector3.x) / 2 / Math.PI * 360;
		var a = run_vectors[vector_name].name_label_text;
		info_div.innerHTML = "<span style='font-family: serif'>Rotation by " + angle.toFixed(2) + "°</span><br />"
			+ "new THREE.Matrix4().makeRotationZ(" + Math.atan2(vector3.y, vector3.x).toFixed(2) + ");<br />";
	}
}
