import React, { CSSProperties, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import Pie from './Pie';
import Turntable from './Turntable';
import useInputControls, { pieDataFromControls } from './useInputControls';
import { P3dDataType } from '@/interface';

type Pie3DProps = {
  data: P3dDataType[];
  style?: CSSProperties;
  showPanel?: boolean;
  spinSpeedValue?: number;
  title?: string;
  onClickItem: (id: string) => void;
};

const Pie3D: React.FC<Pie3DProps> = props => {
  const orbitControlsRef = React.useRef();
  const [controlValues, set] = useInputControls();
  const defaultData: any = pieDataFromControls(controlValues);
  const {
    data = defaultData,
    style = { width: '100%', height: '100%' },
    showPanel = false,
    spinSpeedValue = 0,
    title,
    onClickItem,
  } = props;

  const {
    innerRadius,
    outerRadius,
    cornerRadius,
    padAngle,
    environmentFile,
    spotLightIntensity,
    ambientLightIntensity,
    roughness,
    metalness,
    valueLabelPosition,
    showBloom,
    bloomStrength,
    bloomRadius,
    bloomThreshold,
    spinSpeed,
    backgroundColor,
    // title,
    titleMaxWidth,
    titleOffset,
    showValues,
    valuesAsPercent,
  } = controlValues;

  const addEnvironment = !!environmentFile;

  useEffect(() => {
    if (data && data.length > 0) {
      console.log('data', data);
      data.map((item: P3dDataType, i: number) => {
        set({ [`label${i}`]: item.label });
      });
    }
  }, [data, controlValues]);

  console.log('controlValues', controlValues);

  return (
    <div
      id="canvas-container"
      style={{ position: 'relative', backgroundColor, ...style }}
    >
      <Leva
        collapsed={window.innerWidth < 800}
        titleBar={{ title: 'Customize Pie' }}
        hidden={!showPanel}
      />
      <Canvas shadows dpr={[1, 2]} camera={{ position: [3, 3, 4], fov: 50 }}>
        <ambientLight intensity={ambientLightIntensity} />

        <spotLight
          intensity={spotLightIntensity}
          angle={0.1}
          penumbra={1}
          position={[10, 15, 10]}
          castShadow
        />
        <Suspense fallback={null}>
          <Turntable enabled={spinSpeedValue > 0} speed={spinSpeedValue * 0.02}>
            <Pie
              data={data}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              cornerRadius={cornerRadius}
              padAngle={padAngle}
              roughness={roughness}
              metalness={metalness}
              valueLabelPosition={valueLabelPosition}
              showValues={showValues}
              valuesAsPercent={valuesAsPercent}
              onClickSlice={(i: number) => {
                onClickItem && onClickItem(data[i]);
                set({ [`explode${i}`]: !controlValues[`explode${i}`] });
              }}
            />
          </Turntable>
        </Suspense>
        {/* {addEnvironment && (
          <Suspense fallback={null}>
            <Environment path="/hdri/" files={environmentFile} />
          </Suspense>
        )} */}
        {/* <ContactShadows
          rotation-x={Math.PI / 2}
          position={[0, -0.4, 0]}
          opacity={0.65}
          width={30}
          height={30}
          blur={1.5}
          far={0.8}
        /> */}
        {/* <GizmoHelper
          alignment={'bottom-left'}
          margin={[80, 80]}
          onTarget={() => orbitControlsRef?.current?.target}
          onUpdate={() => orbitControlsRef.current?.update()}
        >
          <GizmoViewport
            axisColors={['red', 'green', 'blue']}
            labelColor={'white'}
          />
        </GizmoHelper> */}
        {/* <OrbitControls
          ref={orbitControlsRef}
          // minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          // enableZoom={false}
          enablePan={false}
        />
        {showBloom && (
          <Effects
            backgroundColor={backgroundColor}
            bloomStrength={bloomStrength}
            bloomThreshold={bloomThreshold}
            bloomRadius={bloomRadius}
          />
        )} */}
      </Canvas>
      {/* Optionally render the 2D version */}
      {/* <div className="absolute top-0 left-0">
        <SvgPie data={data} />
      </div> */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          color: '#fff',
          textAlign: 'center',
          top: '50%',
          left: '50%',
          maxWidth: `${titleMaxWidth}vw`,
          transform: `translate(-50%, ${titleOffset}vh)`,
          textShadow: `-1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, 4px 4px 10px rgba(0,0,0,0.5)`,
        }}
      >
        {title}
      </div>
    </div>
  );
};

export default Pie3D;
