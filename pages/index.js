import React from 'react';
import PropTypes from 'prop-types';
import { ascByKey } from 'utils';
import { ADVANCED_JOBS, ROLE_ACTION_IDS } from 'data/jobs';
import Header from 'components/Header';
import Articles from 'components/Articles';
import Footer from 'components/Footer';
import JobSelect from 'components/JobSelect';
import { JobSelectContextProvider } from 'components/JobSelect/context';
import JobMenu from 'components/JobSelect/JobMenu';
import fetch from 'node-fetch';
import XIVBars from './XIVBars';
import { XIVBarsContextProvider } from './XIVBars/context';

import styles from './styles.scss';

function Index({
  jobs,
  actions,
  selectedJob,
  roleActions,
  query
}) {
  return (
    <>
      {(selectedJob) ? (
        <XIVBarsContextProvider actions={actions}>
          <div className={styles.header}>
            <div className="container">
              <div className="row">
                <JobSelectContextProvider>
                  <JobSelect jobs={jobs} selectedJob={selectedJob} />
                </JobSelectContextProvider>
              </div>

              <div className={styles.description}>
                {/* eslint-disable-next-line react/no-danger */}
                <p dangerouslySetInnerHTML={{ __html: selectedJob.Description }} />
              </div>

            </div>
          </div>
          <div className={styles.primary}>
            <XIVBars
              jobs={jobs}
              actions={actions}
              selectedJob={selectedJob}
              roleActions={roleActions}
            />
          </div>
        </XIVBarsContextProvider>
      ) : (
        <>
          <div className={styles.header}>
            <Header query={query} selectedJob={selectedJob} jobs={jobs} />
          </div>
          <div className={styles.primary}>
            <JobSelectContextProvider>
              <JobMenu jobs={jobs} />
            </JobSelectContextProvider>
          </div>
        </>
      )}

      <div className={styles.articles}>
        <Articles />
      </div>

      <div className={styles.footer}>
        <Footer />
      </div>
    </>
  );
}

Index.getInitialProps = async (req) => {
  const ctx = req;

  // TODO: Refactor API calls into a separate lib component
  const apiUrl = 'https://xivapi.com';

  // Get Jobs List
  const jobsData = await fetch(`${apiUrl}/ClassJob`)
    .then((res) => res.json())
    .then((json) => json.Results);
  const jobs = jobsData.sort(ascByKey('Name'));

  function decorateJobs() {
    const decoratedData = ADVANCED_JOBS.map((advancedJob) => {
      const jobData = jobs.find((job) => job.ID === advancedJob.ID);
      return { ...jobData, ...advancedJob };
    });
    return decoratedData;
  }

  const decoratedJobs = decorateJobs();

  // Get Selected Job
  const { query } = ctx;
  const selectedJob = query.job ? decoratedJobs.find((job) => job.Abbr === query.job) : null;

  let jobActions = [];
  let roleActions = [];

  // Fetch Actions
  if (selectedJob) {
    const jobActionRequest = `${apiUrl}/search?indexes=Action,CraftAction&filters=ClassJobTargetID=${selectedJob.ID}`;

    jobActions = await fetch(jobActionRequest)
      .then((res) => res.json())
      .then(async (actions) => {
        let classJobActions = [];
        if (selectedJob.ClassID !== null) {
          const classJobActionsRequest = `${apiUrl}/search?indexes=Action,CraftAction&filters=ClassJobTargetID=${selectedJob.ClassID}`;
          classJobActions = await fetch(classJobActionsRequest)
            .then((res) => res.json())
            .then((json) => json.Results);
        }
        return [...classJobActions, ...actions.Results];
      });

    if (selectedJob.Role) {
      // Refactor this is pull IDS from ClassJob object instead of ROLE_ACTION_IDS
      roleActions = await fetch(
        `${apiUrl}/Action?ids=${ROLE_ACTION_IDS[selectedJob.Role].toString()}`
      )
        .then((res) => res.json())
        .then((json) => json.Results);
    }
  }

  return {
    jobs: decoratedJobs,
    actions: jobActions,
    selectedJob,
    roleActions,
    query
  };
};

Index.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedJob: PropTypes.shape(),
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  query: PropTypes.shape().isRequired
};

Index.defaultProps = {
  selectedJob: null
};

export default Index;
