import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootStateType, DispatchType } from './store';

export const useAppDispatch = () => useDispatch<DispatchType>();
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector;
