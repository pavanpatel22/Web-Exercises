import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOptimisticUpdate, clearOptimisticUpdate } from '../store/slices/formBuilderSlice';
import { selectHasPendingUpdates } from '../store/selectors';

export const useOptimisticUpdates = () => {
  const dispatch = useDispatch();
  const hasPendingUpdates = useSelector(selectHasPendingUpdates);

  const performOptimisticUpdate = useCallback((action, asyncOperation) => {
    const updateId = `update-${Date.now()}`;
    
    // Set optimistic update
    dispatch(setOptimisticUpdate({
      id: updateId,
      ...action,
    }));

    // Perform the actual action
    dispatch(action);

    // Return a promise that resolves when the async operation completes
    return Promise.resolve()
      .then(() => asyncOperation?.())
      .then(() => {
        dispatch(clearOptimisticUpdate(updateId));
        return true;
      })
      .catch((error) => {
        dispatch(clearOptimisticUpdate(updateId));
        // TODO: Handle rollback here
        console.error('Optimistic update failed:', error);
        throw error;
      });
  }, [dispatch]);

  return {
    performOptimisticUpdate,
    hasPendingUpdates,
  };
};