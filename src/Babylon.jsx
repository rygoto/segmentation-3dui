import React, { useEffect, useRef, useState } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, Mesh, ActionManager, ExecuteCodeAction } from '@babylonjs/core';

function Babylon() {
    const canvasRef = useRef(null);
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        if (canvasRef.current) {
            const engine = new Engine(canvasRef.current, true);
            const scene = new Scene(engine);
            const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 2, new Vector3(0, 0, 5), scene);
            camera.attachControl(canvasRef.current, true);
            const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
            const sphere = Mesh.CreateSphere("sphere", 16, 2, scene);

            sphere.actionManager = new ActionManager(scene);
            sphere.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
                setShowText(!showText);
            }));

            engine.runRenderLoop(() => {
                scene.render();
            });

            const xr = scene.createDefaultXRExperienceAsync({
                uiOptions: {
                    sessionMode: 'immersive-ar',
                },
            });

            return () => {
                engine.dispose();
            };
        }
    }, []);

    return (
        <>
            <canvas ref={canvasRef} style={{ width: '800px', height: '600px' }} />
            {showText && <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px' }}>
                Unko!
            </div>}
        </>
    );
}

export default Babylon;
