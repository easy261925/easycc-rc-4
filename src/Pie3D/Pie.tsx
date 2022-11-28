import { useLoader } from '@react-three/fiber';
import { sum } from 'd3-array';
import { PieArcDatum, Arc, DefaultArcObject } from 'd3-shape';
import React, { useReducer } from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import makePie from './makePie';
import PieSlice from './PieSlice';

const DEFAULT_EXTRUDE_SETTINGS = {
  curveSegments: 256,
  steps: 2,
  depth: 1, // should be 1 for our scaling to wokr
  bevelEnabled: true,
  bevelThickness: 0.01,
  bevelSize: 0.01,
  bevelOffset: 0.0,
  bevelSegments: 1,
};

const Pie = ({
  data: inputData,
  innerRadius = 2,
  outerRadius = 100,
  cornerRadius = 0,
  padAngle = 0.05,
  roughness,
  metalness,
  onClickSlice,
  valueLabelPosition,
  showValues,
  valuesAsPercent,
}: any) => {
  // note we read data out to get the cached version that is in sync with our pie
  const { data, arcs, shapes, arcGenerator }: any = useCachedPie(
    inputData,
    innerRadius,
    outerRadius,
    cornerRadius,
    padAngle,
  );

  if (!shapes) return null;

  const totalValue = sum(arcs, (d: any) => d.value);

  return (
    <group>
      {shapes.map((shape: any, i: React.Key | null | undefined) => {
        return (
          <PieSlice
            key={i}
            shape={shape}
            i={i}
            totalValue={totalValue}
            // @ts-ignore
            height={data[i].height}
            // @ts-ignore
            offset={data[i].offset}
            extrudeSettings={DEFAULT_EXTRUDE_SETTINGS}
            // @ts-ignore
            datum={data[i]}
            arcs={arcs}
            arcGenerator={arcGenerator}
            onClick={onClickSlice}
            roughness={roughness}
            metalness={metalness}
            valueLabelPosition={valueLabelPosition}
            showValue={showValues}
            valueAsPercent={valuesAsPercent}
          />
        );
      })}
    </group>
  );
};

export default Pie;

/** generate our pie shapes for Three (may suspend) */
const usePie = (
  data: any,
  innerRadius: any,
  outerRadius: any,
  cornerRadius: any,
  padAngle: any,
) => {
  // generate our pie
  const { pieSvgDataUri, arcs, arcGenerator } = makePie(
    data,
    innerRadius,
    outerRadius,
    cornerRadius,
    padAngle,
  );

  // this will suspend when loading a new svg data URI
  const loadedSvg = useLoader(SVGLoader, pieSvgDataUri);

  // return everything in a bundle to facilitate caching
  return { data, innerRadius, loadedSvg, pieSvgDataUri, arcs, arcGenerator };
};

/** Cache our pie so when useLoader suspends we can return a previous version */
const useCachedPie = (
  data: any,
  innerRadius: any,
  outerRadius: any,
  cornerRadius: any,
  padAngle: any,
) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const cachedPie: any = React.useRef();
  let pie: any;

  try {
    /* eslint-disable react-hooks/rules-of-hooks */
    pie = usePie(data, innerRadius, outerRadius, cornerRadius, padAngle);
    /* eslint-enable react-hooks/rules-of-hooks */
  } catch (promise) {
    // if we have never loaded, just suspend
    if (!cachedPie.current) throw promise;
    // otherwise, we will use our cached pie.
    pie = cachedPie.current;

    // force a re-render after the promise resolves since we canceled normal suspense
    promise.then(() => forceUpdate());
  }

  // keep the last drawn pie cached
  React.useEffect(() => {
    cachedPie.current = pie;
  });

  // convert our threejs-loaded svg to threejs shapes
  const shapes = React.useMemo(
    () =>
      pie.loadedSvg.paths.flatMap((shapePath: { toShapes: () => any }) =>
        shapePath.toShapes(),
      ),
    [pie.loadedSvg],
  );

  return { ...pie, shapes };
};
