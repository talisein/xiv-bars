import React, { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GENERAL_ACTIONS } from 'data/actions';
import UILayout from 'components/UILayout';
import LayoutToggle from 'components/LayoutToggle';
import Action from 'components/Action';
import JobSelect from 'components/JobSelect';
import Tooltip, { TooltipContextProvider } from 'components/Tooltip';
import { SelectedActionContextProvider } from 'components/SelectedAction';
import { JobSelectContextProvider } from 'components/JobSelect/context';
import LoadScreen from 'components/LoadScreen';
import Sharing from 'components/Sharing';
import { XIVBarsContextProvider } from './context';

import styles from './styles.scss';

function XIVBars({
  jobs,
  actions,
  selectedJob,
  roleActions
}) {
  const containerEl = createRef();
  const [containerRect, setContainerRect] = useState({});

  useEffect(() => {
    const rect = containerEl.current.getBoundingClientRect();
    setContainerRect(rect);
  }, []);

  return (
    <XIVBarsContextProvider actions={actions}>
      <TooltipContextProvider>
        <SelectedActionContextProvider>
          <div ref={containerEl} className={styles.appContainer}>
            <div className={`${styles.controlPanel} ${styles.container}`}>
              {jobs && (
                <JobSelectContextProvider>
                  <div className={styles.sidebar}>
                    <JobSelect jobs={jobs} selectedJob={selectedJob} />
                  </div>
                </JobSelectContextProvider>
              )}

              <div className={styles.main}>
                <LayoutToggle />
                <Sharing />
              </div>
            </div>

            <div className={`${styles.container} ${styles.appWrapper}`}>
              <div className={`panel ${styles.sidebar}`}>
                <div className={styles.actionsPanel}>
                  <div className={styles.jobActions}>
                    <h4 className={styles.sectionTitle}>Job Actions</h4>
                    <ul className={styles.listActions}>
                      {actions
                        && actions.map((action) => (
                          <li key={`action-${action.ID}`}>
                            <Action action={action} />
                          </li>
                        ))}
                    </ul>
                  </div>

                  {(roleActions && roleActions.length) > 0 && (
                    <div className={styles.roleActions}>
                      <h4 className={styles.sectionTitle}>Role Actions</h4>
                      <ul className={styles.listActions}>
                        {roleActions.map((action) => (
                          <li key={`action-${action.ID}`}>
                            <Action action={action} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className={styles.generalActions}>
                    <h4 className={styles.sectionTitle}>General Actions</h4>
                    <ul className={styles.listActions}>
                      {GENERAL_ACTIONS.map((action) => (
                        <li key={`action-${action.ID}`}>
                          <Action action={action} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className={`${styles.uiLayout} ${styles.main}`}>
                <UILayout />
              </div>
            </div>
            <LoadScreen />
            <Tooltip container={containerRect} />
          </div>
        </SelectedActionContextProvider>
      </TooltipContextProvider>
    </XIVBarsContextProvider>
  );
}

XIVBars.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedJob: PropTypes.shape().isRequired,
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default XIVBars;
