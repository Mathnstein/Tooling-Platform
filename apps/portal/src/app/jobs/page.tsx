'use client';

import { graphql } from '#/codegen/gql';
import JobCard from '#/components/JobCard';
import { JobCardErrorState, JobCardLoadingSkeleton } from '#/components/JobCardStates';
import { useQuery } from '@apollo/client/react';

const GET_JOBS = graphql(`
  query GetJobs {
    jobs {
      id
      toolId
      toolInput
      submittedBy {
        id
        name
        email
        role
      }
      timeSubmitted
      status
      isCanceled
    }
  }
`);

export default function ActiveJobsPage() {
  const { data, loading, error, refetch } = useQuery(GET_JOBS, {
    pollInterval: 10000, // Optional: Poll every 10s to keep the queue fresh
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: false,
  });

  const activeJobs = data?.jobs || [];

  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Active Job Queue</h1>
        <p className="text-zinc-500">Manage and monitor real-time tool executions.</p>
      </header>

      {/* Error State */}
      {error && <JobCardErrorState message={error.message} retry={() => refetch()} />}

      {/* Loading State */}
      {loading && activeJobs.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardLoadingSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!error && !loading && activeJobs.length === 0 && (
        <div className="p-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-center">
          <p className="text-zinc-500 font-medium">The queue is currently empty.</p>
          <p className="text-xs text-zinc-400 mt-1">New jobs will appear here automatically.</p>
        </div>
      )}

      {activeJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}