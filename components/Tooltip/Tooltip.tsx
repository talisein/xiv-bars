import { useEffect, useState, useRef } from 'react';
import { useTooltipState } from './context';
import Description from './Description';
import styles from './Tooltip.module.scss';

export function Tooltip() {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [positionStyle, setPositionStyle] = useState({ transform: 'none' });
  const [anchor, setAnchor] = useState('right');
  const [viewport, setViewport] = useState({ height: 0, width: 0 });
  const { title, body, position } = useTooltipState();

  useEffect(() => {
    setAnchor(styles.right);
  }, [title, body]);

  useEffect(() => {
    const { innerHeight: height, innerWidth: width } = window;
    setViewport({ height, width });
  }, [window.innerHeight, window.innerWidth]);

  useEffect(() => {
    if (position) {
      const anchorStyle = [];
      if (contentRef.current) {
        const {
          offsetHeight: boxHeight,
          offsetWidth: boxWidth
        } = contentRef.current as HTMLDivElement;
        if (position.x > (viewport.width - boxWidth)) anchorStyle.push('right');
        if (position.y > (viewport.height - boxHeight)) anchorStyle.push('bottom');
      }

      if (tooltipRef.current) {
        tooltipRef.current.dataset.anchor = anchorStyle.join(' ');
      }

      const posStyle = {
        transform: `translate(${position?.x}px, ${position?.y}px)`,
      };
      setPositionStyle(posStyle);
    }
  }, [position]);

  return (
    <div
      ref={tooltipRef}
      className={[styles.tooltip, anchor].join(' ')}
      style={positionStyle}
    >
      <div
        className={styles.content}
        ref={contentRef}
        aria-hidden={!title && !body}
      >
        { title ? (
          <>
            <h4 className={styles.title}>{title}</h4>
            { body && (
              <Description content={body} />
            )}
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default Tooltip;
