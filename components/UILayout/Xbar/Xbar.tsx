/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable react/prefer-stateless-function */

import { useAppState } from 'components/App/context';
import { hasActions } from 'lib/xbars';
import type { SlotProps } from 'types/Action';
import Bar from './Bar';
import LayoutControl from './LayoutControl';
import styles from './Xbar.module.scss';

export function Xbar() {
  const {
    viewData, chotbar, readOnly, showTitles
  } = useAppState();
  const {
    id, xhb, wxhb, exhb
  } = viewData;

  if (!chotbar) return null;

  const chotbarKeys = Object.keys(chotbar);

  return (
    <>
      { !(id && readOnly) && <LayoutControl />}

      <div className={styles.container} data-show-titles={showTitles}>
        {chotbarKeys.map((chotbarID) => {
          const barSet = chotbar[chotbarID] as SlotProps[];
          return (
            <div
              key={chotbarID}
              className={[styles.xbar, styles[chotbarID]].join(' ')}
              data-main={xhb ? chotbarID === chotbarKeys[xhb - 1] : false}
              data-wxhb={wxhb ? chotbarID === chotbarKeys[wxhb - 1] : false}
              data-exhb={exhb ? chotbarID === chotbarKeys[exhb - 1] : false}
              data-visible={hasActions(barSet) || !readOnly}
            >
              <Bar bar={barSet} />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Xbar;
