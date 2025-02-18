import { renderHook } from '@testing-library/react';

import useTopLayerElement from './useTopLayerElement';

describe('Hook should initialise', () => {
  it('all results will be empty with nothing in the top layer', () => {
    const { result } = renderHook(() => useTopLayerElement());

    expect(result.current.topDialog).toBe(null);
    expect(result.current.topElement).toBe(null);
    expect(result.current.isInTopLayer).toBe(false);
    expect(result.current.isTopElement).toBe(false);
    expect(result.current.topLayerList).toStrictEqual([]);
  });
});
