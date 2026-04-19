'use client';

import { graphql } from '#/codegen/gql';
import { Job, JobStatus } from '#/codegen/gql/graphql';
import { useMutation } from '@apollo/client/react';
import { memo, useState } from 'react';

const CANCEL_JOB_MUTATION = graphql(`
  mutation CancelJob($input: CancelJobInput!) {
    cancelJob(input: $input)
  }
`);

const REENABLE_JOB_MUTATION = graphql(`
  mutation ReenableJob($input: ReenableJobInput!) {
    reenableJob(input: $input)
  }
`);

interface JobCardProps {
  job: Job;
}

const JobCard = memo(function JobCard({ job }: JobCardProps) {
  const [cancelJob] = useMutation(CANCEL_JOB_MUTATION, {
    optimisticResponse: {
      cancelJob: true,
    },
    refetchQueries: ['GetJobs'],
  });

  const [reenableJob] = useMutation(REENABLE_JOB_MUTATION, {
    optimisticResponse: {
      reenableJob: true,
    },
    refetchQueries: ['GetJobs'],
  });

const handleToggleCancel = async () => {
  const isCurrentlyCanceled = job.isCanceled;

  if (isCurrentlyCanceled) {
    // REENABLE logic
    await reenableJob({
      variables: { input: { id: job.id } },
      optimisticResponse: {
        __typename: 'Mutation', // Always good practice to include this
        reenableJob: true,
      },
    });
  } else {
    // CANCEL logic
    await cancelJob({
      variables: { input: { id: job.id } },
      optimisticResponse: {
        __typename: 'Mutation',
        cancelJob: true,
      },
    });
  }
};

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(job.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="group relative flex items-center">
                <button 
                    onClick={copyToClipboard}
                    className="group relative flex items-center gap-1.5 px-2 py-1 -ml-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    title="Click to copy full ID"
                    >
                    <span className={`text-xs font-mono transition-colors ${copied ? 'text-green-600 dark:text-green-400' : 'text-zinc-500'}`}>
                        ID: {job.id.slice(0, 8)}...
                    </span>
                    
                    {/* Tooltip Overlay */}
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50">
                        <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black text-[10px] font-mono py-1 px-2 rounded shadow-lg whitespace-nowrap">
                        {copied ? 'Copied to clipboard!' : `Copy full ID:\n${job.id}`}
                        </div>
                    </div>
                </button>
            </div>
          <StatusBadge status={job.status} isCanceled={job.isCanceled} />
        </div>
        
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
          {job.toolId}
        </h3>
        <p className="text-sm text-zinc-500 mb-4">Submitted by: {job.submittedBy.name}</p>
        
        <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg mb-4">
          <code className="text-xs text-zinc-600 dark:text-zinc-300 block truncate">
            {typeof job.toolInput === 'object' 
              ? JSON.stringify(job.toolInput) 
              : job.toolInput}
          </code>
        </div>
      </div>

        <button
        onClick={handleToggleCancel}
        className={`w-full py-2 px-4 rounded-xl font-medium transition-all shadow-sm active:scale-95 text-sm ${
          job.isCanceled 
            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700" 
            : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50"
        }`}
      >
        {job.isCanceled ? 'Re-enable Job' : 'Cancel Job'}
      </button>
    </div>
  );
});

export default JobCard;

function StatusBadge({ status, isCanceled }: { status: JobStatus, isCanceled?: boolean | null }) {
  if (isCanceled) return <span className="px-2 py-1 text-xs rounded-md bg-zinc-100 text-zinc-500">CANCELED</span>;
  
  const statusStyles: Record<JobStatus, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    PROCESSING: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
    CANCELED: 'bg-zinc-100 text-zinc-500',
  };

  return (
    <span className={`px-2 py-1 text-xs font-bold rounded-md ${statusStyles[status] || statusStyles.PENDING}`}>
      {status}
    </span>
  );
}