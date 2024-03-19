// WARNING: DO NOT EDIT THIS FILE, IT IS AUTOGENERATED
module.exports = {
	addonType: "behavior",
	id: "overboy_3d_shape_plus",
	name: "3DShape Plus",
	version: "1.0",
	category:
		// "attributes",
		// "movements",
		// "other",
		"general",
	author: "Overboy",
	website: "https://overboy.itch.io/",
	documentation: "https://overboy.itch.io/",
	description: "3DShape PLUS is a behavior extending the features of 3DShape Objects.",
	// icon: "icon.svg", // defaults to "icon.svg" if omitted
	// addonUrl: "https://www.construct.net/en/make-games/addons/####/XXXX", // displayed in auto-generated docs
	// githubUrl: "https://github.com/skymen/XXXX", // displays latest release version in auto-generated docs
	fileDependencies: [
		/*
        {
            filename: "additionalScript.js",
            type: "inline-script",
        }
        */
		/*
    {
      filename: "filename.js", // no need to include "c3runtime/" prefix
      type:
        "copy-to-output"
        "inline-script"
        "external-dom-script"
        "external-runtime-script"
        "external-css"

      // for copy-to-output only
      // fileType: "image/png"
    }
    */
	],
	info: {
		Set: {
			IsOnlyOneAllowed: false,
			CanBeBundled: true,
			IsDeprecated: false
		}
	},
	properties: [
		{
			type: "text",
			id: "skin-sprite",
			options: {
				initialValue: ""
			},
			name: "Skin Sprite Name",
			desc: "The Sprite object to use as a skin"
		},
		{
			type: "text",
			id: "skin-animation",
			options: {
				initialValue: ""
			},
			name: "Skin Anim Name",
			desc: "The Name of the animation of the Sprite to use as a skin. (IMPORTANT : the animation frames match the faces of the 3DShape object, it's not an actual animation)"
		},

		{
			type: "combo",
			id: "all-faces-to-face",
			options: {
				initialValue: "none",
				items: [
					{ none: "None" },
					{ back: "Back (0)" },
					{ front: "Front (1)" },
					{ left: "Left (2)" },
					{ right: "Right (3)" },
					{ top: "Top (4)" },
					{ bottom: "Bottom (5)" }
				]
			},
			name: "Set All Faces Images to Face Image",
			desc: "Set all faces to use the image of this face. (if not set to None)"
		} /*,
		{
			type: "color",
			id: "color-start",
			options: {
				initialValue: [1, 1, 1]
			},
			name: "Start Color",
			desc: "The color that will be set on startup, useful to set a different color at runtime and at edit-time (to easily create Level Design)"
		}*/
	],
	aceCategories: {
		general: "",
		settings: "Settings"
	},
	Acts: {
		SetAllFacesToFace: {
			category: "general",
			forward: "SetAllFacesToFace",
			autoScriptInterface: true,
			highlight: false,
			deprecated: false,
			params: [
				{
					id: "image",
					name: "Image",
					desc: "The image to use for the chosen face. (Defined in the Animation Editor)",
					type: "combo",
					items: [
						{ back: "Back (0)" },
						{ front: "Front (1)" },
						{ left: "Left (2)" },
						{ right: "Right (3)" },
						{ top: "Top (4)" },
						{ bottom: "Bottom (5)" }
					]
				}
			],
			listName: "Set all faces to face",
			displayText: "{my}: Set all faces to use image of [i]{0}[/i] face",
			description: "Set all faces of the shape to use the image of a specific face of the Animation Editor."
		},

		ResetAllFacesToOriginalFace: {
			category: "general",
			forward: "ResetAllFacesToOriginalFace",
			autoScriptInterface: true,
			highlight: false,
			deprecated: false,
			params: [],
			listName: "Reset faces to their original face image",
			displayText: "{my}: Set all faces to use image of their original face image",
			description:
				"Set all faces of the shape to use the image frame corresponding to their side. Note : this don't remove the skin, but make sure all faces use their own corresponding image (Back uses frame 0, Front uses frame 1, Left uses frame 2 etc). "
		},

		SetAllFacesToObjectClass: {
			category: "general",
			forward: "SetAllFacesToObjectClass",
			autoScriptInterface: true,
			highlight: false,
			deprecated: false,
			params: [
				{
					id: "object",
					name: "Object",
					desc: "{my}: The object to use for all faces",
					type: "object"
				}
			],
			listName: "Set all faces to object",
			displayText: "{my}: Set all faces to use image of [i]{0}[/i]",
			description: "Set all faces of the shape to use the image of another object. An instance of the object must be in the same layout."
		},

		SetSkin: {
			category: "general",
			forward: "SetSkin",
			autoScriptInterface: true,
			highlight: false,
			deprecated: false,
			params: [
				{
					id: "object",
					name: "Sprite",
					desc: "{my}: The Sprite to use as a skin",
					type: "object"
				},
				{
					id: "animation",
					name: "Animation",
					desc: "{my}: The animation of the Sprite to use as a skin",
					type: "string"
				}
			],
			listName: "Set skin",
			displayText: "{my}: Set skin [i]{0}[/i], animation [i]{1}[/i]",
			description: "Set skin"
		},
		RemoveAllFaceObjects: {
			category: "general",
			forward: "RemoveAllFaceObjects",
			autoScriptInterface: true,
			highlight: false,
			deprecated: true,
			params: [],
			listName: "Remove all face objects",
			displayText: "{my}: Remove all face objects",
			description:
				"Remove all Objects used as faces. Note : this don't remove the skin or set back faces to use their original image. It just remove the objects used as faces."
		}
	},

	Cnds: {
		Is_Skin: {
			category: "general",
			forward: "Is_Skin",
			autoScriptInterface: true,
			highlight: false,
			deprecated: false,
			params: [
				{
					id: "object",
					name: "Sprite",
					desc: "{my}: The Sprite to use as a skin",
					type: "object"
				},
				{
					id: "animation",
					name: "Animation",
					desc: "{my}: The animation of the Sprite used as a skin (leave empty to check if any skin from this Sprite is used)",
					type: "string"
				}
			],
			listName: "Is Skin",
			displayText: "{my} Is Skin [i]{0}[/i], animation [i]{1}[/i]",
			description: "Check if the Sprite and a particular animation are used as a skin"
		}
	},

	Exps: {
		Skin_SpriteName: {
			category: "general",
			forward: "Skin_SpriteName",
			autoScriptInterface: true,
			params: [],
			returnType: "string",
			description: "Returns the name of the Sprite Object used as a skin"
		},
		Skin_AnimName: {
			category: "general",
			forward: "Skin_AnimName",
			autoScriptInterface: true,
			params: [],
			returnType: "string",
			description: "Returns the name of animation of the Sprite Object used as a skin"
		}
	}
}