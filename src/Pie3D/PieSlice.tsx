import {
  animated,
  config as springConfigs,
  useSpring,
} from '@react-spring/three';
import { Text } from '@react-three/drei';
import { format } from 'd3-format';
import React from 'react';
import Billboard from './Billboard';
import { palette } from './theme';

const springConfig = springConfigs.wobbly;

const PieSlice = ({
  i,
  shape,
  arcs,
  datum,
  arcGenerator,
  extrudeSettings,
  totalValue,
  height,
  onClick,
  valueLabelPosition = 0.5,
  offset = 0,
  roughness = 0.2,
  metalness = 0,
  formatter = format('.0%'),
  showValue = true,
  valueAsPercent = true,
}: any) => {
  const arc = arcs[i];
  const label = datum.label;
  const color = datum.color ?? palette[i % palette.length];
  let xOffset = 0;
  let zOffset = 0;
  // explode the pieces
  // 1. we need to get middle angle of the slice
  const theta = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;

  // 2. unit direction vector to offset by
  let explosionMagnitude = 0.2;
  if (datum.explode) {
    xOffset = Math.cos(theta) * explosionMagnitude;
    zOffset = Math.sin(theta) * explosionMagnitude;
  }

  const innerRadius = arcGenerator.innerRadius()(arc);
  const outerRadius = arcGenerator.outerRadius()(arc);
  const labelPosition =
    (valueLabelPosition * (outerRadius - innerRadius) + innerRadius) * 0.01;
  let xText = Math.cos(theta) * labelPosition;
  let zText = Math.sin(theta) * labelPosition;
  const yTextOffset = 0.125;
  // glorious idea for laziness
  // const percent = (arc.endAngle - arc.startAngle) / (Math.PI * 2)
  const percent = arc.value / totalValue;

  const springProps = useSpring({
    // xOffset,
    // zOffset,
    height,
    position: [xOffset, height + offset, zOffset],
    config: springConfig,
  });

  const extrudeGeometryArgs = React.useMemo(() => [shape, extrudeSettings], [
    shape,
    extrudeSettings,
  ]);

  return (
    <animated.group key={i} position={springProps.position as any}>
      <animated.mesh
        rotation={[Math.PI / 2, 0, 0]}
        scale={springProps.height.to((height: any) => [1, 1, height])}
        onClick={evt => {
          onClick?.(i);
          // @ts-ignore
          evt.stopPropagation(true);
        }}
        receiveShadow
        // onPointerEnter={() => setActiveSlice(i)}
        // onPointerLeave={() => setActiveSlice(undefined)}
      >
        {/* <shapeGeometry args={[shape]} /> */}
        <extrudeGeometry args={extrudeGeometryArgs as any} />
        {/* <cylinderGeometry args={[1, 1, 0.4, 64]} /> */}
        {/* <meshPhongMaterial color={color} /> */}
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
        {/* <meshBasicMaterial color={color} side={BackSide} /> */}
      </animated.mesh>
      {showValue && (
        <Billboard>
          <Text
            position={[xText, yTextOffset, zText]}
            castShadow
            fontSize={0.2}
            maxWidth={200}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign={'left'}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={1}
            color="white"
            outlineWidth={'2.5%'}
            outlineColor="#000000"
            outlineOpacity={0.2}
          >
            {valueAsPercent ? formatter(percent) : arc.value}
          </Text>
        </Billboard>
      )}
      {label && (
        <Billboard>
          <Text
            position={[xText, yTextOffset + (showValue ? 0.15 : 0), zText]}
            castShadow={!showValue}
            fontSize={showValue ? 0.1 : 0.125}
            maxWidth={200}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign={'left'}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={1}
            color={showValue ? color : 'white'}
            outlineWidth={'2.5%'}
            outlineColor="#000000"
            outlineOpacity={1}
            strokeColor="white"
            strokeWidth={'2%'}
          >
            {label}
          </Text>
        </Billboard>
      )}
    </animated.group>
  );
};

export default PieSlice;
