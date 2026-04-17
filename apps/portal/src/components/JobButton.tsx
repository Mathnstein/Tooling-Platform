'use client';

import { useState } from 'react';
import { graphql } from '#/codegen/gql';
import { useLazyQuery } from '@apollo/client/react';

// Define the query (Codegen will pick this up)
const GET_JOBS = graphql(`
  query GetJobs {
    jobs {
      id
      status
    }
  }
`);

export default function JobButton() {
  // Setup the query trigger
  // useLazyQuery is perfect for buttons—it doesn't run until you call 'getJobs'
  const [getJobs, { loading, data, error }] = useLazyQuery(GET_JOBS);

  return (
    <div className="space-y-4">
      <button
        onClick={() => getJobs()}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors disabled:bg-zinc-400"
      >
        {loading ? "Fetching..." : "Fetch Queue Jobs"}
      </button>

      {/* Display Results */}
      {error && (
        <p className="text-red-500">Error: {error.message}</p>
      )}

      {data && (
        <div className="mt-6 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
          <h3 className="font-semibold mb-2">Queue Results:</h3>
          <pre className="text-sm font-mono overflow-auto max-h-40">
            {JSON.stringify(data.jobs, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}