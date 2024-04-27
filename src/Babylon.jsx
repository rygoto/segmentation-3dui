import React, { useEffect, useRef, useState } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, Mesh, MeshBuilder, ActionManager, ExecuteCodeAction, WebXRState, WebXRDomOverlay } from '@babylonjs/core';

function Babylon() {
    const canvasRef = useRef(null);
    const [showText, setShowText] = useState(false);
    const [scene, setScene] = useState(null);

    useEffect(() => {
        if (canvasRef.current) {
            const engine = new Engine(canvasRef.current, true);
            const scene = new Scene(engine);
            setScene(scene);
            const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 2, new Vector3(0, 0, 5), scene);
            camera.attachControl(canvasRef.current, true);
            const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
            const sphere = Mesh.CreateSphere("sphere", 16, 2, scene);

            sphere.actionManager = new ActionManager(scene);
            sphere.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
                setShowText(!showText);
            }));

            const xr = scene.createDefaultXRExperienceAsync({
                uiOptions: {
                    sessionMode: 'immersive-ar',
                },
            });

            xr.then(xrExperience => {
                const featuresManager = xrExperience.baseExperience.featuresManager;
                featuresManager.enableFeature(WebXRDomOverlay, "latest",
                    { element: ".dom-overlay-container" }), undefined, false;
                xrExperience.baseExperience.onStateChangedObservable.add((webXRState) => {
                    switch (webXRState) {
                        case WebXRState.ENTERING_XR:
                        case WebXRState.IN_XR:
                            console.log("overlay type:", featuresManager.getEnabledFeature(WebXRDomOverlay)?.domOverlayType);
                            break;
                    }
                });
            });

            engine.runRenderLoop(() => {
                scene.render();
            });

            return () => {
                engine.dispose();
            };
        }
    }, []);

    function addShapes() {
        if (scene) {
            const box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
            box.position.x = -3;
            const cone = MeshBuilder.CreateCylinder("cone", { diameterTop: 0, height: 3 }, scene);
            cone.position.x = 3;
            const icosphere = MeshBuilder.CreateIcoSphere("icosphere", { radius: 1.5, flat: true, subdivisions: 2 }, scene);
            icosphere.position.z = 3;
        }
    }

    return (
        <>
            <canvas ref={canvasRef} style={{ width: '800px', height: '600px' }} />
            <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px' }}>
                {showText && "Unko!"}
            </div>
            <div className="dom-overlay-container">
                {"Oikora!-Gomen"}
            </div>

            <button onClick={addShapes} style={{ position: 'absolute', top: '10px', right: '10px' }}>Add Shapes</button>
        </>
    );
}

export default Babylon;
