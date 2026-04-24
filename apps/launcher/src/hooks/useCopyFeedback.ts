import { useEffect } from 'react';
import type { Dispatch } from 'react';

import { COPY_FEEDBACK_MS } from '@/constants';
import type { UiAction } from '@/state';

export function useCopyFeedback(copiedId: string | null, dispatch: Dispatch<UiAction>): void {
  useEffect(() => {
    if (!copiedId) {
      return undefined;
    }

    const id = window.setTimeout(() => dispatch({ type: 'COPY_EXPIRED' }), COPY_FEEDBACK_MS);

    return () => window.clearTimeout(id);
  }, [copiedId, dispatch]);
}
