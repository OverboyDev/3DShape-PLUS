const SDK = self.SDK

//<-- BEHAVIOR_INFO -->

let app = null

SDK.Behaviors[BEHAVIOR_INFO.id] = class extends SDK.IBehaviorBase {
	constructor() {
		super(BEHAVIOR_INFO.id)
		SDK.Lang.PushContext("behaviors." + BEHAVIOR_INFO.id.toLowerCase())
		this._info.SetName(self.lang(".name"))
		this._info.SetDescription(self.lang(".description"))
		this._info.SetVersion(BEHAVIOR_INFO.version)
		this._info.SetCategory(BEHAVIOR_INFO.category)
		this._info.SetAuthor(BEHAVIOR_INFO.author)
		this._info.SetHelpUrl(self.lang(".help-url"))

		if (BEHAVIOR_INFO.icon) {
			this._info.SetIcon(BEHAVIOR_INFO.icon, BEHAVIOR_INFO.icon.endsWith(".svg") ? "image/svg+xml" : "image/png")
		}

		if (BEHAVIOR_INFO.fileDependencies && BEHAVIOR_INFO.fileDependencies.length) {
			BEHAVIOR_INFO.fileDependencies.forEach((file) => {
				this._info.AddFileDependency({
					...file,
					filename: `c3runtime/${file.filename}`
				})
			})
		}

		if (BEHAVIOR_INFO.info && BEHAVIOR_INFO.info.Set)
			Object.keys(BEHAVIOR_INFO.info.Set).forEach((key) => {
				const value = BEHAVIOR_INFO.info.Set[key]
				const fn = this._info[`Set${key}`]
				if (fn && value !== null && value !== undefined) fn.call(this._info, value)
			})
		SDK.Lang.PushContext(".properties")
		this._info.SetProperties((BEHAVIOR_INFO.properties || []).map((prop) => new SDK.PluginProperty(prop.type, prop.id, prop.options)))
		SDK.Lang.PopContext() // .properties
		SDK.Lang.PopContext()
	}
}
const B_C = SDK.Behaviors[BEHAVIOR_INFO.id]
B_C.Register(BEHAVIOR_INFO.id, B_C)

B_C.Type = class extends SDK.IBehaviorTypeBase {
	constructor(sdkPlugin, iObjectType) {
		super(sdkPlugin, iObjectType)
	}
}

B_C.Instance = class extends SDK.IBehaviorInstanceBase {
	constructor(sdkType, inst) {
		super(sdkType, inst)
		console.log("inst", this, inst)
		//console.log("objectInstance", inst.GetObjectInstance())
		//console.log("objectInstance_external", inst.GetExternalSdkInstance())
	}

	Release() {
		globalThis.project = this._behaviorInstance.GetProject()
		console.log("project", project)
	}

	OnCreate() {
		console.log("project", this._behaviorInstance.GetProject())
	}

	OnPropertyChanged(id, value) {
		console.log("OnPropertyChanged", id, value)
		console.log("this", this)

		globalThis.project = this._behaviorInstance.GetProject()
		globalThis.shape = project.GetObjectTypeByName("3DShape").GetAllInstances()[0]
		console.log("project", project)
		console.log("shape", shape)

		console.log("sdkType", this._sdkType)
		console.log("inst", this._inst)
		console.log("behInst", this._behInst)
		/*
        //
		switch (id) {
			case "skin-sprite":
				//this.UpdateRiveObject() //This is there to update my renderer
				break
			case "skin-animation":
				//this.UpdateRiveObject() //This is there to update my renderer
				break
		}*/
	}

	LoadC2Property(name, valueString) {
		return false // not handled
	}
}
