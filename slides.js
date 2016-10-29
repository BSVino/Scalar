Scalar.get_slides = function() {
	return [
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
}