import { ReactNode, HTMLAttributes, PropsWithChildren } from 'react';
import { useIntersect } from '../../hooks/useIntersect';

export interface InfiniteScrollProps
  extends Pick<HTMLAttributes<HTMLDivElement>, 'className'> {
  loading: ReactNode | undefined;
  onIntersect: () => void;
}

const InfiniteScroll = ({
  loading,
  children,
  className,
  onIntersect
}: InfiniteScrollProps & PropsWithChildren) => {
  const triggerRef = useIntersect(onIntersect);

  return (
    <div className={className}>
      {children}
      <div ref={triggerRef} style={{ height: '1px' }} />
      {loading && loading}
    </div>
  );
};

export default InfiniteScroll;
