const SKIN_SPRITE = 0
const SKIN_ANIMATION = 1
const FRAME_ALLFACES = 2
const COLOR = 3

const tempQuad = C3.New(C3.Quad)
const tempColor = C3.New(C3.Color)

function float2string(a, b, c, d) {
	// >>> Get
	a = C3.clamp(Math.floor(1024 * a), -8192, 8191)
	b = C3.clamp(Math.floor(1024 * b), -8192, 8191)
	c = C3.clamp(Math.floor(1024 * c), -8192, 8191)
	d = C3.clamp(Math.floor(1023 * d), 0, 1023)
	0 > a && (a += 16384)
	0 > b && (b += 16384)
	0 > c && (c += 16384)
	return -(16384 * (16384 * a) * 1024 + 16384 * b * 1024 + c * 1024 + d)
}

function getInstanceJs(parentClass, scriptInterface, addonTriggers, C3) {
	return class extends parentClass {
		constructor(inst, properties) {
			super(inst)

			this.isShape3D = C3.Plugins.Shape3D && this._inst._objectType._plugin instanceof C3.Plugins.Shape3D ? true : false
			//console.log("isShape3D: " + this.isShape3D)

			this._skinObject = null
			this._skinAnimation = null
			this._faceSkins = [null, null, null, null, null, null]

			if (properties) {
				//INIT COLOR

				//const color = properties[COLOR]
				const color = [1, 1, 1]
				const colorString = float2string(color[0], color[1], color[2], 1)
				tempColor.setFromRgbValue(colorString)
				this.GetWorldInfo()._SetColor(tempColor)

				//INIT ALL FACES

				//INIT SKIN
				this._prop_skinObjectName = properties[SKIN_SPRITE]
				this._prop_skinAnimationName = properties[SKIN_ANIMATION]
				requestAnimationFrame(() => {
					this.shape3D_SdkInst = this._inst._sdkInst
					this._inst._sdkInst._oldDrawFace = this._inst._sdkInst._DrawFace
					this._inst._sdkInst._DrawFace = this._DrawFace
					//console.log("oldDrawFace", this._inst._sdkInst._oldDrawFace)
					//console.log("DrawFace", this._inst._sdkInst._DrawFace)
					this.InitSkin()
					//console.log("properties[FRAME_ALLFACES]", properties[FRAME_ALLFACES] - 1)
					this.SetAllFacesToFace(properties[FRAME_ALLFACES] - 1)
					/*
					requestAnimationFrame(() => {
						this.SetAllFacesToFace(properties[FRAME_ALLFACES] - 1)
					})*/
				})
			}
		}

		InitSkin() {
			//console.log("InitSkin", this._prop_skinObjectName, this._prop_skinAnimationName)
			//const objectClass = this._runtime.GetObjectClassByName(this._prop_skinObjectName)
			const objectClass = this._runtime.GetObjectClassByName(this._prop_skinObjectName)
			//console.log("initskin objectClass", objectClass)
			this.SetSkin(objectClass, this._prop_skinAnimationName)
		}

		//======== ENABLED ========

		RemoveAllFaceObjects() {
			if (!this.isShape3D) return
			this.shape3D_SdkInst = this._inst._sdkInst
			const faceObjects = this.shape3D_SdkInst._faceObjects
			for (let i = 0; i < faceObjects.length; i++) {
				faceObjects[i] = null
			}
			this._runtime.UpdateRender()
		}

		SetAllFacesToFace(image) {
			if (!this.isShape3D) return
			if (image < 0) return
			this.shape3D_SdkInst = this._inst._sdkInst
			const faceImages = this.shape3D_SdkInst._faceImages
			const faceObjects = this.shape3D_SdkInst._faceObjects
			for (let i = 0; i < faceImages.length; i++) {
				faceImages[i] = image
				faceObjects[i] = null
			}
			//console.log("SetAllFacesToFace")
			this._runtime.UpdateRender()
		}

		ResetAllFacesToOriginalFace() {
			if (!this.isShape3D) return
			this.shape3D_SdkInst = this._inst._sdkInst
			const faceImages = this.shape3D_SdkInst._faceImages
			const faceObjects = this.shape3D_SdkInst._faceObjects
			for (let i = 0; i < faceImages.length; i++) {
				faceImages[i] = i
				faceObjects[i] = null
			}
			//console.log("SetAllFacesToFace")
			this._runtime.UpdateRender()
		}

		/*
		SetAllFacesToFrame(number) {
			if (!this.isShape3D) return
			this.shape3D_SdkInst = this._inst._sdkInst
			const faceImages = this.shape3D_SdkInst._faceImages
			const faceObjects = this.shape3D_SdkInst._faceObjects
			for (let i = 0; i < faceImages.length; i++) {
				if (faceImages[i] === image && faceObjects[i] === null) return
				faceImages[i] = image
				faceObjects[i] = null
			}
			this._runtime.UpdateRender()
		}*/

		SetAllFacesToObjectClass(objectClass) {
			if (!this.isShape3D) return
			if (objectClass !== null && objectClass.IsFamily()) objectClass = objectClass.GetFamilyMembers()[0]
			this.shape3D_SdkInst = this._inst._sdkInst
			const faceObjects = this.shape3D_SdkInst._faceObjects
			for (let i = 0; i < faceObjects.length; i++) {
				faceObjects[i] = objectClass
			}
			this._runtime.UpdateRender()
		}

		SetSkin(objectClass, animation) {
			//console.log("SetSkin")
			//is 3DShape Plugin
			if (!this.isShape3D) return
			this.shape3D_SdkInst = this._inst._sdkInst
			//objectClass exists
			if (!objectClass) return
			if (objectClass.IsFamily()) objectClass = objectClass.GetFamilyMembers()[0]
			//const inst = objectClass.GetPairedInstance(this.GetInstance())
			const inst = objectClass.GetPairedInstance(this.shape3D_SdkInst.GetInstance())
			if (!inst) return
			const sdkInst = inst.GetSdkInstance()

			if (!C3.Plugins.Sprite || !(sdkInst instanceof C3.Plugins.Sprite.Instance)) return
			//console.log("SET SKIN 1")
			//console.log("Get animation: ", objectClass.GetAnimationByName(animation))
			if (objectClass.GetAnimationByName(animation) === null) return
			this._skinObject = objectClass
			//console.log("this._skinObject ", this._skinObject)

			//lowercase animation
			this._skinAnimation = animation

			//console.log("SET SKIN")
			/*
			const faceSkins = this.shape3D_SdkInst._faceSkins
			for (let i = 0; i < faceObjects.length; i++) {
				faceSkins[i] = [objectClass, animation]
			}*/

			//remove faceObjects
			const faceObjects = this.shape3D_SdkInst._faceObjects
			for (let i = 0; i < faceObjects.length; i++) {
				faceObjects[i] = null
			}

			this._runtime.UpdateRender()
		}

		// Monkey patch draw Face
		_DrawFace(renderer, i, tlx, tly, tlz, trx, try_, trz, brx, bry, brz, blx, bly, blz, shape) {
			//console.log("Monkey patch DrawFace")
			let texture = null
			let quadTex = null
			let preCalculatedQuadTexCoords = false
			renderer.SetTextureFillMode()
			const faceObjectClass = this._faceObjects[i]
			//console.log("this", this)
			const extendedBehavior = this._inst.GetBehaviorSdkInstanceFromCtor(C3.Behaviors.overboy_3d_shape_plus)
			//console.log("extendedBehavior", extendedBehavior)
			if (faceObjectClass !== null) {
				this._inst._sdkInst._oldDrawFace(renderer, i, tlx, tly, tlz, trx, try_, trz, brx, bry, brz, blx, bly, blz, shape)
				return
				//skipped (used original DrawFace)
				/*
				const inst = faceObjectClass.GetPairedInstance(this.GetInstance())
				if (!inst) return
				const sdkInst = inst.GetSdkInstance()
				if (C3.Plugins.Sprite && sdkInst instanceof C3.Plugins.Sprite.Instance) {
					texture = sdkInst.GetTexture()
					if (texture === null) return
					quadTex = sdkInst.GetTexQuad()
				} else if (
					(C3.Plugins.TiledBg && sdkInst instanceof C3.Plugins.TiledBg.Instance) ||
					(C3.Plugins.NinePatch && sdkInst instanceof C3.Plugins.NinePatch.Instance)
				) {
					let areaWidth = 0
					let areaHeight = 0
					const zTilingFactor = this._zTilingFactor
					switch (shape) {
						case 0:
						case 1:
							areaWidth = extendedBehavior.distanceTo3D(tlx, tly, tlz, trx, try_, trz, zTilingFactor)
							areaHeight = extendedBehavior.distanceTo3D(trx, try_, trz, brx, bry, brz, zTilingFactor)
							break
						case 2:
							areaWidth = extendedBehavior.distanceTo3D(blx, bly, blz, brx, bry, brz, zTilingFactor)
							areaHeight = extendedBehavior.distanceTo3D(tlx, tly, tlz, blx, bly, blz, zTilingFactor)
							break
						case 3:
							areaWidth = extendedBehavior.distanceTo3D(blx, bly, blz, brx, bry, brz, zTilingFactor)
							areaHeight = extendedBehavior.distanceTo3D(trx, try_, trz, brx, bry, brz, zTilingFactor)
							break
						case 4:
							areaWidth = extendedBehavior.distanceTo3D(blx, bly, blz, brx, bry, brz, zTilingFactor)
							areaHeight = extendedBehavior.distanceTo3D(
								tlx,
								tly,
								tlz,
								(blx + brx) / 2,
								(bly + bry) / 2,
								(blz + brz) / 2,
								zTilingFactor
							)
							break
					}
					if (C3.Plugins.TiledBg && sdkInst instanceof C3.Plugins.TiledBg.Instance) {
						texture = sdkInst.GetTexture()
						if (texture === null) return
						sdkInst.CalculateTextureCoordsFor3DFace(areaWidth, areaHeight, tempQuad)
						preCalculatedQuadTexCoords = true
						sdkInst.SetTilingShaderProgram(renderer)
					} else {
						if (shape !== 0) return
						sdkInst._Set3DCallback((drawRect, texRect) => {
							drawRect.divide(areaWidth, areaHeight)
							const lf = drawRect.getLeft()
							const tf = drawRect.getTop()
							const rf = drawRect.getRight()
							const bf = drawRect.getBottom()
							const [ntlx, ntly, ntlz] = lerp3d2(tlx, tly, tlz, trx, try_, trz, blx, bly, blz, lf, tf)
							const [ntrx, ntry, ntrz] = lerp3d2(tlx, tly, tlz, trx, try_, trz, blx, bly, blz, rf, tf)
							const [nbrx, nbry, nbrz] = lerp3d2(tlx, tly, tlz, trx, try_, trz, blx, bly, blz, rf, bf)
							const [nblx, nbly, nblz] = lerp3d2(tlx, tly, tlz, trx, try_, trz, blx, bly, blz, lf, bf)
							renderer.Quad3D(ntlx, ntly, ntlz, ntrx, ntry, ntrz, nbrx, nbry, nbrz, nblx, nbly, nblz, texRect)
						})
						sdkInst._Draw(renderer, 0, 0, areaWidth, areaHeight)
						sdkInst._Set3DCallback(null)
						return
					}
				} else return*/
			} else if (extendedBehavior._skinObject) {
				//ACTUAL MONKEY PATCHING
				//console.log("DRAW FACE SKIN")
				//console.log("this._skinObject 2: ", extendedBehavior._skinObject)
				const inst = extendedBehavior._skinObject.GetPairedInstance(this.GetInstance())
				//const inst = this._skinObject.GetPairedInstance(this.shape3D_SdkInst.GetInstance())
				if (!inst) return
				const sdkInst = inst.GetSdkInstance()
				i = this._faceImages[i]
				//console.log("Sprite Inst: ", inst)
				//console.log("Sprite sdkInst: ", sdkInst)
				const frame = inst._objectType.GetAnimationByName(extendedBehavior._skinAnimation).GetFrameAt(i)
				const imageInfo = frame.GetImageInfo()
				texture = imageInfo.GetTexture()
				if (texture === null) return
				quadTex = imageInfo.GetTexQuad()
			} else {
				i = this._faceImages[i]
				const frame = this._animation.GetFrameAt(i)
				const imageInfo = frame.GetImageInfo()
				texture = imageInfo.GetTexture()
				if (texture === null) return
				quadTex = imageInfo.GetTexQuad()
			}
			renderer.SetTexture(texture)
			if (shape >= 3 || preCalculatedQuadTexCoords) {
				if (!preCalculatedQuadTexCoords) tempQuad.copy(quadTex)
				if (shape === 3) {
					tempQuad.setTlx(tempQuad.getTrx())
					tempQuad.setTly(tempQuad.getTly())
				} else if (shape === 4) {
					tempQuad.setTlx((tempQuad.getTlx() + tempQuad.getTrx()) / 2)
					tempQuad.setTly((tempQuad.getTly() + tempQuad.getTry()) / 2)
				}
				renderer.Quad3D2(tlx, tly, tlz, trx, try_, trz, brx, bry, brz, blx, bly, blz, tempQuad)
			} else renderer.Quad3D2(tlx, tly, tlz, trx, try_, trz, brx, bry, brz, blx, bly, blz, quadTex)
		}

		distanceTo3D(x1, y1, z1, x2, y2, z2, zScale) {
			return Math.hypot(x2 - x1, y2 - y1, (z2 - z1) * zScale)
		}

		Is_Skin(objectClass, animationName) {
			let ret
			if (this._skinObject !== objectClass) ret = false
			if (animationName === "") ret = true
			ret = this._skinAnimation.toLowerCase() === animationName.toLowerCase()
			return ret
		}

		_DrawFace_Old(renderer, i, tlx, tly, tlz, trx, try_, trz, brx, bry, brz, blx, bly, blz, shape) {
			let texture = null
			let quadTex = null
			let preCalculatedQuadTexCoords = false
			renderer.SetTextureFillMode()
			const faceObjectClass = this._faceObjects[i]
			if (faceObjectClass !== null) {
				const inst = faceObjectClass.GetPairedInstance(this.GetInstance())
				if (!inst) return
				const sdkInst = inst.GetSdkInstance()
				if (C3.Plugins.Sprite && sdkInst instanceof C3.Plugins.Sprite.Instance) {
					texture = sdkInst.GetTexture()
					if (texture === null) return
					quadTex = sdkInst.GetTexQuad()
				} else if (
					(C3.Plugins.TiledBg && sdkInst instanceof C3.Plugins.TiledBg.Instance) ||
					(C3.Plugins.NinePatch && sdkInst instanceof C3.Plugins.NinePatch.Instance)
				) {
					let areaWidth = 0
					let areaHeight = 0
					const zTilingFactor = this._zTilingFactor
					switch (shape) {
						case 0:
						case 1:
							areaWidth = extendedBehavior.distanceTo3D(tlx, tly, tlz, trx, try_, trz, zTilingFactor)
							areaHeight = extendedBehavior.distanceTo3D(trx, try_, trz, brx, bry, brz, zTilingFactor)
							break
						case 2:
							areaWidth = extendedBehavior.distanceTo3D(blx, bly, blz, brx, bry, brz, zTilingFactor)
							areaHeight = extendedBehavior.distanceTo3D(tlx, tly, tlz, blx, bly, blz, zTilingFactor)
							break
						case 3:
							areaWidth = extendedBehavior.distanceTo3D(blx, bly, blz, brx, bry, brz, zTilingFactor)
							areaHeight = extendedBehavior.distanceTo3D(trx, try_, trz, brx, bry, brz, zTilingFactor)
							break
						case 4:
							areaWidth = extendedBehavior.distanceTo3D(blx, bly, blz, brx, bry, brz, zTilingFactor)
							areaHeight = extendedBehavior.distanceTo3D(
								tlx,
								tly,
								tlz,
								(blx + brx) / 2,
								(bly + bry) / 2,
								(blz + brz) / 2,
								zTilingFactor
							)
							break
					}
					if (C3.Plugins.TiledBg && sdkInst instanceof C3.Plugins.TiledBg.Instance) {
						texture = sdkInst.GetTexture()
						if (texture === null) return
						sdkInst.CalculateTextureCoordsFor3DFace(areaWidth, areaHeight, tempQuad)
						preCalculatedQuadTexCoords = true
						sdkInst.SetTilingShaderProgram(renderer)
					} else {
						if (shape !== 0) return
						sdkInst._Set3DCallback((drawRect, texRect) => {
							drawRect.divide(areaWidth, areaHeight)
							const lf = drawRect.getLeft()
							const tf = drawRect.getTop()
							const rf = drawRect.getRight()
							const bf = drawRect.getBottom()
							const [ntlx, ntly, ntlz] = lerp3d2(tlx, tly, tlz, trx, try_, trz, blx, bly, blz, lf, tf)
							const [ntrx, ntry, ntrz] = lerp3d2(tlx, tly, tlz, trx, try_, trz, blx, bly, blz, rf, tf)
							const [nbrx, nbry, nbrz] = lerp3d2(tlx, tly, tlz, trx, try_, trz, blx, bly, blz, rf, bf)
							const [nblx, nbly, nblz] = lerp3d2(tlx, tly, tlz, trx, try_, trz, blx, bly, blz, lf, bf)
							renderer.Quad3D(ntlx, ntly, ntlz, ntrx, ntry, ntrz, nbrx, nbry, nbrz, nblx, nbly, nblz, texRect)
						})
						sdkInst._Draw(renderer, 0, 0, areaWidth, areaHeight)
						sdkInst._Set3DCallback(null)
						return
					}
				} else return
			} else {
				i = this._faceImages[i]
				const frame = this._animation.GetFrameAt(i)
				const imageInfo = frame.GetImageInfo()
				texture = imageInfo.GetTexture()
				if (texture === null) return
				quadTex = imageInfo.GetTexQuad()
			}
			renderer.SetTexture(texture)
			if (shape >= 3 || preCalculatedQuadTexCoords) {
				if (!preCalculatedQuadTexCoords) tempQuad.copy(quadTex)
				if (shape === 3) {
					tempQuad.setTlx(tempQuad.getTrx())
					tempQuad.setTly(tempQuad.getTly())
				} else if (shape === 4) {
					tempQuad.setTlx((tempQuad.getTlx() + tempQuad.getTrx()) / 2)
					tempQuad.setTly((tempQuad.getTly() + tempQuad.getTry()) / 2)
				}
				renderer.Quad3D2(tlx, tly, tlz, trx, try_, trz, brx, bry, brz, blx, bly, blz, tempQuad)
			} else renderer.Quad3D2(tlx, tly, tlz, trx, try_, trz, brx, bry, brz, blx, bly, blz, quadTex)
		}

		/*
        _SetFaceObjectClass(face, objectClass) {
            if (objectClass !== null && objectClass.IsFamily())
                objectClass = objectClass.GetFamilyMembers()[0];
            const faceObjects = this._faceObjects;
            if (faceObjects[face] === objectClass)
                return;
            faceObjects[face] = objectClass;
            this._runtime.UpdateRender()
        }*/

		/*
		_SetFaceImage(face, image) {
			const faceImages = shape3D_SdkInst._faceImages
			const faceObjects = shape3D_SdkInst._faceObjects
			if (faceImages[face] === image && faceObjects[face] === null) return
			faceImages[face] = image
			faceObjects[face] = null
			this._runtime.UpdateRender()
		}*/

		Skin_SpriteName() {
			if (!this._skinObject) return ""
			return this._skinObject.GetName()
		}

		Skin_AnimName() {
			if (!this._skinAnimation) return ""
			return this._skinAnimation
		}

		//Tick() {}

		//=========== USUAL ============

		Release() {
			super.Release()
		}

		SaveToJson() {
			return {
				// data to be saved for savegames
			}
		}

		LoadFromJson(o) {
			// load state for savegames
		}

		Trigger(method) {
			super.Trigger(method)
			const addonTrigger = addonTriggers.find((x) => x.method === method)
			if (addonTrigger) {
				this.GetScriptInterface().dispatchEvent(new C3.Event(addonTrigger.id))
			}
		}

		GetScriptInterfaceClass() {
			return scriptInterface
		}
	}
}
