## Pie3D

Demo:

```tsx
import React from 'react';
import { Pie3D } from 'easycc-rc-4';
const data = [
  {
    id: '1',
    value: 10,
    label: '哈哈',
    color: 'red',
    height: 1,
  },
  {
    id: '2',
    value: 20,
    label: '哈哈就啊哈安静安静',
    color: 'blue',
    height: 1.5,
  },
];
const Index = () => {
  const onClickItem = value => console.log('点击结果', value);
  return (
    <div style={{ width: 400, height: 400 }}>
      <Pie3D
        spinSpeedValue={0.2}
        showPanel={false}
        data={data}
        title="第一季度报表"
        onClickItem={onClickItem}
      />
    </div>
  );
};

export default Index;
```
