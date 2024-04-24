import { VRButton, ARButton, XR, Controllers, Hands } from '@react-three/xr'
import { Canvas } from '@react-three/fiber'

function XRScene() {
    return (
        <>
            <VRButton mode={'AR'} />
            <Canvas>
                <XR>
                    <mesh>
                        <boxGeometry />
                        <meshBasicMaterial color="orange" />
                    </mesh>
                </XR>
            </Canvas>
        </>
    )
};

export default XRScene;